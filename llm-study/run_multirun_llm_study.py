# python ./llm-study/run_multirun_llm_study.py

import os
import json
import time
import pandas as pd
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

# ----------------------- CONFIG -----------------------
os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")

client = OpenAI(
    organization=os.getenv("OPENAI_ORG_KEY"),
    project=os.getenv("OPENAI_PROJECT_KEY"),
)

# ----------------------- EXPERIMENT GRID -----------------------
RUN_ID = [1, 2, 3]
TEMPERATURES = [0.5, 1.0, 1.5]
FIXED_REASONING = "none" # fixed across all runs
SLEEP_SECONDS = 1

# ----------------------- DEFINITIONS -----------------------
list_of_ICI_criteria = [
  "A1. The university defines 'AI use,' 'AI assistance,' or 'AI-generated content.'",
  "A2. The university defines standards for citing AI-generated material.",
  "B1. The university provides guidance, training, or resources for instructors on AI-related teaching practices.",
  "B2. Official examples of appropriate and/or prohibited AI use are provided (e.g. example AI use cases, example prompts).",
  "B3. A faculty committee or group focused on teaching and learning about AI exists.",
  "B4. Faculty are offered syllabus language examples (e.g. use AI/don’t use AI/selectively use AI).",
  "C1. A faculty committee or advisory group focused on university AI policy or governance exists.",
  "C2. A student committee or advisory group focused on university AI policy or governance exists.",
  "C3. The university publishes AI policy update logs or explains revisions.",
  "D1. The university restricts, discourages, or warns against the use of AI detection tools.",
  "D2. Student misconduct determinations require human review and cannot be based solely on AI detection tools.",
]

VALID_SCORES = {"A", "B", "C", "D", "E"}

criteria_indices = {c.split(".")[0] for c in list_of_ICI_criteria}
criteria_block = "\n".join(list_of_ICI_criteria)

# ----------------------- PROMPT -----------------------
PROMPT_TEMPLATE = """Evaluating whether a university meets specific criteria based strictly on the provided institutional links.

University: {UNIVERSITY}

Approved sources (you must not use any external sites, but you should explore sublinks from these sites):
{LINK_LIST}

Evaluation criteria:
{CRITERIA_LIST}

Scoring scale (select exactly one per criterion):
A. Present/Yes — A clear statement directly addressing the item is found on an institutional page within 5 minutes.
B. Partial/Implicit/Somewhat — The item is mentioned or implied, but key details are missing.
C. Absent/No — You reasonably searched the allowed sources and did not find relevant content.
D. Unclear or Took Longer Than 5 Minutes — Navigation difficulty, vague language, or time limits prevented a confident decision.
E. Conflicting Information — Different institutional sources provide contradictory guidance for the same item.

Output requirements:
- Return VALID JSON ONLY.
- No markdown, no commentary.
- Return an ARRAY with one object per criterion.
- Every criterion MUST appear exactly once.

Schema:
[
  {{
    "criterion": "A1",
    "score": "A|B|C|D|E",
    "urls": ["https://...", "https://..."]
  }}
]
"""

# ----------------------- FUNCTIONS -----------------------
def parse_batch_output(raw_text, expected_criteria):
    try:
        parsed = json.loads(raw_text)
        if not isinstance(parsed, list):
            return None

        seen = set()
        results = {}

        for item in parsed:
            if not {"criterion", "score", "urls"}.issubset(item):
                return None
            if item["criterion"] not in expected_criteria:
                return None
            if item["score"] not in VALID_SCORES:
                return None
            if not isinstance(item["urls"], list):
                return None

            seen.add(item["criterion"])
            results[item["criterion"]] = item

        return results if seen == expected_criteria else None

    except json.JSONDecodeError:
        return None


def call_api(prompt, temperature):
    return client.responses.create(
        model="gpt-5.2-2025-12-11",
        temperature=temperature,
        reasoning={"effort": FIXED_REASONING},
        tools=[{"type": "web_search"}],
        tool_choice="auto",
        include=["web_search_call.action.sources"],
        input=prompt,
    )


def call_until_valid(prompt, expected_criteria, temperature):
    attempt = 0
    current_prompt = prompt

    while True:
        attempt += 1
        response = call_api(current_prompt, temperature)
        raw = response.output_text.strip()

        parsed = parse_batch_output(raw, expected_criteria)
        if parsed:
            return raw, parsed

        current_prompt += (
            "\n\nReturn VALID JSON ONLY.\n"
            "Ensure ALL criteria are present exactly once."
        )

        if attempt % 10 == 0:
            print(f"[Warning] {attempt} retries")

        time.sleep(SLEEP_SECONDS)

# ----------------------- MAIN -----------------------
df_base = pd.read_csv("./data/ACAI-US79-all-links.csv")

all_rows = []

for run_id in RUN_ID:
    for temperature in TEMPERATURES:

        print(f"\n=== RUN run_id={run_id}, temp={temperature} ===\n")

        for _, row in df_base.iterrows():
            print("UNIVERSITY:", row["Index"], row["Institution"])

            prompt = PROMPT_TEMPLATE.format(
                UNIVERSITY=row["Institution"],
                LINK_LIST=str(row["all-links"]),
                CRITERIA_LIST=criteria_block,
            )

            raw, results = call_until_valid(
                prompt,
                criteria_indices,
                temperature,
            )

            out = row.to_dict()
            out["run_id"] = run_id
            out["run_temperature"] = temperature
            out["raw_response"] = raw

            for crit, data in results.items():
                out[f"{crit}_score"] = data["score"]
                out[f"{crit}_urls"] = "; ".join(data["urls"])

            all_rows.append(out)

# ----------------------- SAVE -----------------------
df_all = pd.DataFrame(all_rows)
out_path = "./data/ACAI-US79-LLM-scored_ALL_RUNS.csv"
df_all.to_csv(out_path, index=False)

print("✅ Saved all runs to:", out_path)
