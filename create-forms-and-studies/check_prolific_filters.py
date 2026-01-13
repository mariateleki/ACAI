import json
import os
import requests
from dotenv import load_dotenv

# For filters, you first call the API with this script to see the availible filters: 
# https://docs.prolific.com/api-reference/filters/get-filters
# Then read this about how to set the filters based on the results: 
# https://docs.prolific.com/api-reference/filters/filters-overview

# ---------------------------------------------------------
# CONFIGURATION
# ---------------------------------------------------------
load_dotenv()
API_TOKEN = os.getenv("PROLIFIC_TOKEN")

# ---------------------------------------------------------
# PRINT
# ---------------------------------------------------------
url = "https://api.prolific.com/api/v1/filters/"
# querystring = {"filter_tag":"custom-group"}
headers = {"Authorization": API_TOKEN}
response = requests.get(url, headers=headers) # , params=querystring
print(json.dumps(response.json(), indent=2, sort_keys=True))
