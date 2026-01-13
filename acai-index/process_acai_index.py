# python ./acai-index/process_acai_index.py

import numpy as np
import pandas as pd
import krippendorff
from itertools import combinations

# --------------------------------------------------
# Paths
# --------------------------------------------------
PIVOT_PATH = "./data/Prolific-Annotations-Pivoted.csv"
LINKS_PATH = "./data/ACAI-US79-all-links.csv"
OUTPUT_PATH = "./data/ACAI-US79-scored.csv"

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
# Load data
# --------------------------------------------------
df_pivot = pd.read_csv(PIVOT_PATH)
df_links = pd.read_csv(LINKS_PATH)

score_cols = [c for c in df_pivot.columns if c.startswith("k")]

# --------------------------------------------------
# Helpers
# --------------------------------------------------
def domain_cols(domain):
    return [c for c in score_cols if f"-{domain}" in c]


def safe_alpha(matrix):
    if matrix is None:
        return np.nan
    try:
        return krippendorff.alpha(matrix, level_of_measurement="ordinal")
    except ValueError:
        return np.nan


def build_matrix(row, cols, exclude_k=None):
    data = []
    for k in [1, 2, 3]:
        if exclude_k == k:
            continue
        kcols = [c for c in cols if c.startswith(f"k{k}-")]
        vals = row[kcols].values.astype(float)
        if not np.all(np.isnan(vals)):
            data.append(vals)
    return np.array(data) if len(data) >= 2 else None


def pairwise_agreement(matrix):
    if matrix is None:
        return np.nan
    agreements = []
    for i, j in combinations(range(matrix.shape[0]), 2):
        a, b = matrix[i], matrix[j]
        mask = ~np.isnan(a) & ~np.isnan(b)
        if mask.any():
            agreements.append(np.mean(a[mask] == b[mask]))
    return np.mean(agreements) if agreements else np.nan


def domain_aggregated_matrix(row, exclude_k=None):
    data = []
    for k in [1, 2, 3]:
        if exclude_k == k:
            continue
        vals = []
        for d in ["A", "B", "C", "D"]:
            cols = [c for c in domain_cols(d) if c.startswith(f"k{k}-")]
            vals.append(np.nanmean(row[cols]))
        vals = np.array(vals)
        if not np.all(np.isnan(vals)):
            data.append(vals)
    return np.array(data) if len(data) >= 2 else None


def compute_domain_means(row, exclude_k=None):
    means = {}
    for d in ["A", "B", "C", "D"]:
        vals = []
        for k in [1, 2, 3]:
            if exclude_k == k:
                continue
            cols = [c for c in domain_cols(d) if c.startswith(f"k{k}-")]
            vals.append(np.nanmean(row[cols]))
        means[d] = np.nanmean(vals)
    return means


def compute_acai(domain_means, weights):
    total_w = sum(weights.values())
    return sum(weights[d] * domain_means[d] for d in weights) / total_w * 100.0

# --------------------------------------------------
# Build master rows
# --------------------------------------------------
rows = []

for _, row in df_pivot.iterrows():
    uid = row["UID"]

    out = {"Index": uid}

    # write out means
    dm_all = compute_domain_means(row)
    for d in ["A", "B", "C", "D"]:
        out[f"mean_{d}"] = dm_all[d]


    # ---- Inter-annotator agreement ----
    out["alpha_overall"] = safe_alpha(build_matrix(row, score_cols))
    out["pairwise_overall"] = pairwise_agreement(build_matrix(row, score_cols))
    out["alpha_domain_aggregated"] = safe_alpha(domain_aggregated_matrix(row))

    # ---- ACAI per weighting scheme ----
    for scheme, w in WEIGHTING_SCHEMES.items():
        dm_all = compute_domain_means(row)
        out[f"ACAI_{scheme}"] = compute_acai(dm_all, w)

        # LOO ACAI
        for k in [1, 2, 3]:
            dm_drop = compute_domain_means(row, exclude_k=k)
            out[f"ACAI_{scheme}_drop_k{k}"] = compute_acai(dm_drop, w)

            for d in ["A", "B", "C", "D"]:
                out[f"mean_{d}_drop_k{k}"] = dm_drop[d]

    rows.append(out)

df = pd.DataFrame(rows)

# --------------------------------------------------
# Rank diagnostics PER SCHEME
# --------------------------------------------------
for scheme in WEIGHTING_SCHEMES:
    base = f"ACAI_{scheme}"
    df[f"rank_{scheme}"] = df[base].rank(ascending=False, method="average")

    for k in [1, 2, 3]:
        df[f"rank_{scheme}_drop_k{k}"] = df[f"{base}_drop_k{k}"].rank(
            ascending=False, method="average"
        )
        df[f"rank_change_{scheme}_k{k}"] = (
            df[f"rank_{scheme}_drop_k{k}"] - df[f"rank_{scheme}"]
        )

    df[f"max_abs_rank_change_{scheme}"] = df[
        [f"rank_change_{scheme}_k{k}" for k in [1, 2, 3]]
    ].abs().max(axis=1)

# --------------------------------------------------
# Merge with links + save
# --------------------------------------------------
df_out = df_links.merge(df, on="Index", how="left")
df_out.to_csv(OUTPUT_PATH, index=False)

print("ACAI scoring + agreement + rank robustness written to:", OUTPUT_PATH)
