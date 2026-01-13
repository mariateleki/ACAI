# python ./acai-index/process_acai_index_llm.py

import pandas as pd
import numpy as np

# --------------------------------------------------
# Paths
# --------------------------------------------------
INPUT_PATH = "./data/ACAI-US79-LLM-scored_ALL_RUNS.csv"
OUTPUT_PATH = "./data/ACAI-US79-LLM-ACAI.csv"

# --------------------------------------------------
# Score mapping (LLM → human-equivalent)
# --------------------------------------------------
SCORE_MAP = {
    "A": 1.0,
    "B": 0.5,
    "C": 0.0,
    "D": 0.0,
    "E": 0.0,
}

# --------------------------------------------------
# Weighting schemes
# --------------------------------------------------
WEIGHTING_SCHEMES = {
    "equal": {"A": 1, "B": 1, "C": 1, "D": 1},
    "indicators": {"A": 2, "B": 4, "C": 3, "D": 2},
    "policy_heavy": {"A": 1, "B": 1, "C": 2, "D": 2},
    "teaching_heavy": {"A": 1, "B": 2, "C": 1, "D": 1},
}

# --------------------------------------------------
# Helpers
# --------------------------------------------------
def score_to_value(x):
    if not isinstance(x, str):
        return np.nan
    return SCORE_MAP.get(x.strip(), np.nan)


def domain_columns(df, domain):
    return [c for c in df.columns if c.startswith(domain) and c.endswith("_score")]


def compute_acai(domain_means, weights):
    total_weight = sum(weights.values())
    return (
        sum(domain_means[d] * weights[d] for d in weights)
        / total_weight
        * 100.0
    )

# --------------------------------------------------
# Load data
# --------------------------------------------------
df = pd.read_csv(INPUT_PATH)

# --------------------------------------------------
# Normalize indicator scores immediately
# --------------------------------------------------
score_cols = [c for c in df.columns if c.endswith("_score")]
for c in score_cols:
    df[c] = df[c].apply(score_to_value)

# --------------------------------------------------
# 🔑 Average across run_id (LLM-as-annotator step)
# --------------------------------------------------
GROUP_KEYS = ["Index", "run_temperature"]

df_avg = (
    df
    .groupby(GROUP_KEYS, as_index=False)[score_cols]
    .mean()
)

# --------------------------------------------------
# Reattach stable metadata (institutional attributes)
# --------------------------------------------------
meta_cols = [
    c for c in df.columns
    if c not in score_cols + ["run_id", "raw_response"]
]

meta = (
    df[meta_cols]
    .drop_duplicates(subset=GROUP_KEYS)
)

df_avg = df_avg.merge(meta, on=GROUP_KEYS, how="left")

# --------------------------------------------------
# Compute domain means
# --------------------------------------------------
for d in ["A", "B", "C", "D"]:
    cols = domain_columns(df_avg, d)
    df_avg[f"mean_{d}"] = df_avg[cols].mean(axis=1)

# --------------------------------------------------
# Compute ACAI + ranks (per temperature)
# --------------------------------------------------
for scheme, weights in WEIGHTING_SCHEMES.items():
    df_avg[f"ACAI_{scheme}"] = df_avg.apply(
        lambda r: compute_acai(
            {d: r[f"mean_{d}"] for d in ["A", "B", "C", "D"]},
            weights,
        ),
        axis=1,
    )

    df_avg[f"rank_{scheme}"] = (
        df_avg
        .groupby("run_temperature")[f"ACAI_{scheme}"]
        .rank(ascending=False, method="average")
    )

# --------------------------------------------------
# Save output
# --------------------------------------------------
df_avg.to_csv(OUTPUT_PATH, index=False)

print("✅ LLM-averaged ACAI (by temperature) written to:", OUTPUT_PATH)
