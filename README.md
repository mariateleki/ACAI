# The Due Process Deficit: Auditing AI Governance in U.S. Higher Education

Code, data, and audit instruments for our FAccT '26 paper. Site: **https://acai-us79.org/** &middot; DOI: [10.1145/3805689.3812328](https://doi.org/10.1145/3805689.3812328).

ACAI scores 79 U.S. universities on 11 indicators across four governance domains — **A** Policy Clarity, **B** Faculty Support, **C** Feedback Mechanisms, **D** Detection Tools — under four weighting schemes (`equal`, `indicators`, `policy_heavy`, `teaching_heavy`).

## Layout

```
data/                      ACAI-US79 dataset + all derived tables
create-forms-and-studies/  Prolific study + Google Form generation
link-collection/           Allowed-source URLs reviewed during audit
llm-study/                 Multi-temperature LLM audit pipeline
acai-index/                Scoring scripts + analysis notebooks
site/                      React + Vite source for acai-us79.org
```

## Reproduce

```bash
conda env create -f environment.yml && conda activate acai
python acai-index/process_acai_index.py        # → data/ACAI-US79-scored.csv
python acai-index/process_acai_index_llm.py    # → data/ACAI-US79-LLM-ACAI.csv
jupyter lab acai-index/                        # analyses + LaTeX tables
```

Both scoring scripts use `.round(2)` + pandas `method="average"` for stable tie-breaking. The LLM study (`llm-study/run_multirun_llm_study.py`) needs `OPENAI_API_KEY` / `OPENAI_ORG_KEY` / `OPENAI_PROJECT_KEY` in a local `.env`; everything else replays from the committed CSVs offline.

## Site

```bash
cd site && npm install --legacy-peer-deps
npm run dev        # local at :5173
npm run deploy     # build + gh-pages push
```

## Citation

```bibtex
@inproceedings{teleki2026dueprocess,
  author    = {Teleki, Maria and Choi, Anna Seo Gyeong and Duray, Anne and Liu, Haoran and Zhang, Junyan and Dong, Xiangjue and Da Silva, Dilma and Koenecke, Allison and Caverlee, James},
  title     = {The Due Process Deficit: Auditing {AI} Governance in {U.S.} Higher Education},
  booktitle = {Proc. 2026 ACM Conference on Fairness, Accountability, and Transparency (FAccT '26)},
  year      = {2026},
  publisher = {ACM},
  doi       = {10.1145/3805689.3812328}
}
```

CC BY 4.0. Contact: [mariateleki@tamu.edu](mailto:mariateleki@tamu.edu?subject=%5BACAI%5D) (subject `[ACAI]`).
