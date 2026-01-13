# python ./create_forms_and_studies/bulk_create_forms.py

import json
import copy
import pandas as pd
import os
from dotenv import load_dotenv

from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build


# ------------------------------------------------------------
# 1. AUTHENTICATION
# ------------------------------------------------------------
load_dotenv()

SCOPES = [
    "https://www.googleapis.com/auth/forms.body",
    "https://www.googleapis.com/auth/drive"
]


def authorize():
    creds = None
    try:
        creds = Credentials.from_authorized_user_file("token.json", SCOPES)
    except:
        pass

    if not creds or not creds.valid:
        flow = InstalledAppFlow.from_client_secrets_file("./create_forms_and_studies/credentials.json", SCOPES)
        creds = flow.run_local_server(port=0)
        with open("token.json", "w") as token:
            token.write(creds.to_json())
    return creds


# ------------------------------------------------------------
# 2. FORM CREATION HELPERS
# ------------------------------------------------------------

def create_form(forms_service, title):
    """Google only allows setting title during creation."""
    result = forms_service.forms().create(
        body={"info": {"title": title}}
    ).execute()
    return result["formId"]


def set_description(forms_service, form_id, description_text):
    """Set the form description using batchUpdate."""
    forms_service.forms().batchUpdate(
        formId=form_id,
        body={
            "requests": [
                {
                    "updateFormInfo": {
                        "info": {"description": description_text},
                        "updateMask": "description"
                    }
                }
            ]
        }
    ).execute()


def add_items(forms_service, form_id, items):
    """Insert all form items in correct order via batchUpdate."""
    requests = []
    for idx, item in enumerate(items):
        requests.append({
            "createItem": {
                "item": item,
                "location": {"index": idx}
            }
        })

    forms_service.forms().batchUpdate(
        formId=form_id,
        body={"requests": requests}
    ).execute()


def move_to_folder(drive_service, file_id, folder_id):
    """Move created form into Drive folder."""
    file = drive_service.files().get(fileId=file_id, fields="parents").execute()
    prev_parents = ",".join(file.get("parents", []))

    drive_service.files().update(
        fileId=file_id,
        addParents=folder_id,
        removeParents=prev_parents,
        fields="id, parents"
    ).execute()


# ------------------------------------------------------------
# 3. LOAD TEMPLATE FILE
# ------------------------------------------------------------

def load_base_form(json_path="./create_forms_and_studies/base_form.json"):
    with open(json_path, "r", encoding="utf-8") as f:
        return json.load(f)


# ------------------------------------------------------------
# 4. BULK CREATION PIPELINE
# ------------------------------------------------------------

def bulk_create(forms_service, drive_service=None, folder_id=None, count=79):
    results = []

    base_form = load_base_form()  # contains: description, items
    df = pd.read_csv("./data/ACAI-US79-all-links.csv")

    for i in range(1,count+1):
        UID = f"U{i}"
        row = df[df["Index"] == UID].iloc[0]

        university = row["Institution"]
        all_links = row["all-links"]

        # BUILD TITLE AND DESCRIPTION
        title = f"Annotating U.S. University Policies on Artificial Intelligence (AI): Survey for {university}"

        # SET UP DESCRIPTIONS FOR BOTH GOOGLE AND PROLIFIC
        google_description = (
            base_form["description"]["google"]
            .replace("[UNIVERSITY]", university)
            .replace("[LINKS]", all_links)
        )

        prolific_description = (
            base_form["description"]["prolific"]
            .replace("[UNIVERSITY]", university)
            .replace("[LINKS]", "[this list of links will be provided in the study]")
        )

        items = base_form["items"]

        # STEP 1 — CREATE EMPTY FORM (TITLE ONLY)
        form_id = create_form(forms_service, title)

        # STEP 2 — INSERT DESCRIPTION
        set_description(forms_service, form_id, google_description)

        # STEP 3 — INSERT ALL ITEMS
        add_items(forms_service, form_id, items)

        # PARTICIPANT LINK
        participant_url = f"https://docs.google.com/forms/d/{form_id}/viewform"

        # SAVE TO RESULTS, PASSING PROLIFIC DESCRIPTION TO SAVED OUTPUT FILE
        results.append((form_id, UID, participant_url, prolific_description))

        print(f"[OK] Created form {i}: {form_id} | {university}")
        print(f"     Participant URL: {participant_url}")

        # MOVE TO FOLDER
        if folder_id:
            move_to_folder(drive_service, form_id, folder_id)
            print(f"     Moved to folder: {folder_id}")

    return results


# ------------------------------------------------------------
# 5. MAIN ENTRY POINT
# ------------------------------------------------------------

if __name__ == "__main__":
    creds = authorize()
    forms_service = build("forms", "v1", credentials=creds)
    drive_service = build("drive", "v3", credentials=creds)

    DRIVE_FOLDER_ID = os.getenv("DRIVE_FOLDER_ID")
    COUNT = 79

    # THE PROLIFIC_DESCRIPTION BEING PASSED BACK AS results
    results = bulk_create(forms_service, drive_service, DRIVE_FOLDER_ID, COUNT)

    print("\nDONE — Forms Created:\n")
    # SAVE FOR PROLIFIC SCRIPT, THIS IS THE PROLIFIC_DESCRIPTION BEING PASSED BACK AS results
    with open("./data/google_forms.txt", "w") as f:
        for form_id, UID, participant_url, description in results:
            print(f"{UID} | {form_id} | {participant_url} | {description} \n")
            safe_description = description.replace("\n", "\\n")
            f.write(f"{UID} | {form_id} | {participant_url} | {safe_description} \n")


    print("\nSaved google_forms.txt\n")
