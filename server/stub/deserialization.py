import json


# reads data from json file and returns it as a string.
# this method is currently deprecated.
def read_file_to_string():
    with open("stub/data.json") as f:
        json_data_as_string = f.read()
    return json_data_as_string


# reads data from json file and returns it as a string.
def read_file_to_string_area():
    with open("stub/area_data.json") as f:
        json_data_as_string = f.read()
    return json_data_as_string


# takes json data as input and returns a list of dictionaries.
def json_to_list(json_string):
    data = json.loads(json_string)
    return [dict(item) for item in data]
