# Studying How U.S. Universities are Responding to AI

```
# To create the studies: 
python ./create_forms_and_studies/bulk_create forms.py
python ./create_forms_and_studies/bulk_create_studies.py

# To merge the results after all the annotations are done:
#     Input: [In Google Drive]
#     Output: Prolific-Annotations.csv
python ./create_forms_and_studies/bulk_merge_result_forms.py

# To process the form:
#     Input: Prolific-Annotations.csv from Google Drive
#     Output: Prolific-Annotations-Pivoted.csv
python ./acai-index/process_prolific_annotations.py

# To score with different weighting schemes:
#     Input: Prolific-Annotations-Pivoted.csv
#     Output: ACAI-US79-scored.csv
python ./acai-index/process_acai_index.py

# To analyze, run these notebooks: 
./acai-index/acai_and_interannotator.ipynb
./acai-index/subgroup_analysis.ipynb
```
