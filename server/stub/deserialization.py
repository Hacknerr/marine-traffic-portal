import json


# Reads a file located at "stub/data.json" and returns its contents as a string.
# Temporarily deprecated.
def read_file_to_string():
    with open("stub/data.json") as f:
        json_data_as_string = f.read()
    return json_data_as_string


# Reads a file located at "stub/area_data.json" and returns its contents as a string.
def read_file_to_string_area():
    with open("stub/area_data.json") as f:
        json_data_as_string = f.read()
    return json_data_as_string


# Takes a JSON string as input and returns a list of dictionaries.
def json_to_list(json_string):
    data = json.loads(json_string)
    return [dict(item) for item in data]
