import re
import pandas as pd

INPUT_PATH = "data/ACAI-US79.csv"
OUTPUT_PATH = "data/ACAI-US79-all-links.csv"

def extract_links(cell):
    if pd.isna(cell):
        return []
    text = str(cell)
    lines = text.splitlines()
    bullet_links = []
    for line in lines:
        stripped = line.strip()
        if stripped.startswith("-"):
            link = stripped[1:].strip()
            if link:
                bullet_links.append(link)
    return bullet_links

def unique_preserve_order(items):
    seen = set()
    ordered = []
    for item in items:
        if item not in seen:
            seen.add(item)
            ordered.append(item)
    return ordered

def main():
    df = pd.read_csv(INPUT_PATH)

    link_columns = [
        col for col in df.columns
        if re.match(r"^T[1-7]\s+-", str(col))
    ]

    def gather_links(row):
        links = []
        for col in link_columns:
            links.extend(extract_links(row.get(col)))
        ordered = unique_preserve_order(links)
        if not ordered:
            return ""
        return "\n".join(f"- {link}" for link in ordered)

    df["all-links"] = df.apply(gather_links, axis=1)
    df.to_csv(OUTPUT_PATH, index=False)
    print(df.head())

if __name__ == "__main__":
    main()
