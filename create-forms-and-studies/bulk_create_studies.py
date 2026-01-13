# python ./create_forms_and_studies/bulk_create_studies.py

import requests
import time
import os
from dotenv import load_dotenv

# ---------------------------------------------------------
# CONFIGURATION
# ---------------------------------------------------------
load_dotenv()
API_TOKEN = os.getenv("PROLIFIC_TOKEN")
BASE_URL = "https://api.prolific.com/api/v1"

# ---------------------------------------------------------
# 1. LOAD FORM URL + INTRO STRING PAIRS
# ---------------------------------------------------------
def load_form_pairs(filename="./data/google_forms.txt"):
    pairs = []
    with open(filename, "r") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue

            # Expect format: URL | INTRO_STRING
            if "|" not in line:
                raise ValueError(f"Invalid line format: {line}")
            
            _, _, url_part, intro_part = line.split("|")
            url = url_part.strip()
            intro_string = intro_part.strip()
            intro_string = intro_string.replace("\\n", "\n") # unescape

            pairs.append((url, intro_string))

    return pairs


form_pairs = load_form_pairs()
print(f"Loaded {len(form_pairs)} form URLs.")


# ---------------------------------------------------------
# 2. STUDY PARAMETERS
# ---------------------------------------------------------
REWARD_USD_CENTS = 600
ESTIMATED_TIME_MIN = 30
TOTAL_PLACES = 3
PROJECT = "695360bbb2a245356f360e53" # grab from URL when on the UI project page
PROLIFIC_ID_OPTION = "question"
DEVICE_COMPATIBILITY = ["desktop"]
COMPLETION_CODE = "COMPLETED42"
DELAY_SECONDS = 1
FILTERS = [
    {
        "filter_id": "current-country-of-residence",
        "selected_values": ["1"]  # United States
    },
    {
        "filter_id": "fluent-languages",
        "selected_values": ["19"]   # English
    }
]


# ---------------------------------------------------------
# 3. API HEADERS
# ---------------------------------------------------------
headers = {
    "Authorization": f"Token {API_TOKEN}",
    "Content-Type": "application/json"
}


# ---------------------------------------------------------
# 4. FUNCTION TO CREATE A DRAFT STUDY
# ---------------------------------------------------------
def create_draft_study(payload):
    url = f"{BASE_URL}/studies/"
    res = requests.post(url, json=payload, headers=headers)
    res.raise_for_status()
    return res.json()


# ---------------------------------------------------------
# 5. CREATE A STUDY PER FORM
# More info here: https://docs.prolific.com/api-reference/studies/create-study 
# ---------------------------------------------------------
results = []

for i, (survey_url, intro_string) in enumerate(form_pairs, start=1):

    study_payload = {
        "name": f"Annotating U.S. University Policies on Artificial Intelligence (AI)",
        "internal_name": f"U{i}",
        "description": intro_string,
        "external_study_url": survey_url,
        "project": PROJECT,
        "prolific_id_option": PROLIFIC_ID_OPTION,
        "total_available_places": TOTAL_PLACES,
        "estimated_completion_time": ESTIMATED_TIME_MIN,
        "reward": REWARD_USD_CENTS,
        "currency": "USD",
        "filters": FILTERS,
        "completion_code": COMPLETION_CODE,
        "device_compatibility": DEVICE_COMPATIBILITY,
        # "auto_rejection_categories": ["EXCEPTIONALLY_FAST"] # we do not currently have access to this feature, will have to turn it on by hand and manually publish each study
    }

    try:
        response = create_draft_study(study_payload)
        study_id = response["id"]

        dashboard_url = f"https://app.prolific.com/researcher/studies/{study_id}/overview"

        results.append({
            "study_number": i,
            "study_id": study_id,
            "survey_url": survey_url,
            "intro_string": intro_string,
            "dashboard_url": dashboard_url
        })

        print(f"[Draft Created] Study {i} | ID: {study_id}")
        print(f"  → URL: {survey_url}")
        print(f"  → Internal Intro: {intro_string}")
        print(f"  → Dashboard: {dashboard_url}")

    except requests.exceptions.HTTPError as e:
        response_text = ""
        if e.response is not None:
            response_text = e.response.text
        print(f"[ERROR] Study {i}: {e}")
        if response_text:
            print(f"  → Response body: {response_text}")
        results.append({
            "study_number": i,
            "error": str(e),
            "response_body": response_text
        })
    except Exception as e:
        print(f"[ERROR] Study {i}: {e}")
        results.append({
            "study_number": i,
            "error": str(e)
        })

    time.sleep(DELAY_SECONDS)

print("\nAll draft studies created.")
