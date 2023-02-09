
import json
from datetime import datetime


# Writes a list of dictionaries to a JSON file.
def json_to_file(json_data):

    # Adds a timestamp key and value to each dictionary in the list.
    for item in json_data:
        item['timestamp'] = datetime.now()

    # Writes the list of dictionaries to the file 'stub/data.json'.
    with open("stub/data.json", "w") as f:
        json.dump(json_data, f, indent=4, default=str)


# Writes the provided JSON data to a file named "stub/area_data.json".
def json_to_file_area(json_data):

    # Writing to data.json.
    with open("stub/area_data.json", "w") as f:
        json.dump(json_data, f, indent=4, default=str)
