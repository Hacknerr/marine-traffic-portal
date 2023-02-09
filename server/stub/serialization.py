
import json
from datetime import datetime


# writes json data to .json file.
# this method is currently deprecated.
def json_to_file(json_data):
    for item in json_data:
        item['timestamp'] = datetime.now()
    # writing to data.json.
    with open("stub/data.json", "w") as f:
        json.dump(json_data, f, indent=4, default=str)


# writes json data to .json file.
def json_to_file_area(json_data):
    # writing to data.json
    with open("stub/area_data.json", "w") as f:
        json.dump(json_data, f, indent=4, default=str)
