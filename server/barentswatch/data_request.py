"""
This module contains functions for retrieving ship data from BarentsWatch APIs.
"""
import json
import requests
from tools import utilities
from barentswatch import credentials


def data_request_of_area(token):
    """
    Fetches data about mmsi in a specific area from a RESTful API endpoint.
    """
    # Defines the API endpoint for fetching mmsi from a specific area.
    url = f"{credentials.config['api_historic_base_url']}/v1/historic/mmsiinarea"

    print(url)

    # Defines the required headers for making the API request.
    headers = {
        'authorization': 'Bearer ' + token['access_token'],
        'content-type': 'application/json',
    }

    two_hours_ago = utilities.get_datetime_2_hours_ago()
    now = utilities.getCurrentTime()

    print(two_hours_ago)
    print(now)

    data_raw = {
        "msgtimefrom": two_hours_ago,
        "msgtimeto": now,
        "polygon": {
            "coordinates": [
                [
                    [
                        10.359286605583947,
                        63.419130867795786
                    ],
                    [
                        10.391560425183059,
                        63.41586975271488
                    ],
                    [
                        10.435286245285766,
                        63.42472048783199
                    ],
                    [
                        10.47953261086667,
                        63.43473249809645
                    ],
                    [
                        10.507121521169267,
                        63.449394941119806
                    ],
                    [
                        10.501395520917413,
                        63.464980097690756
                    ],
                    [
                        10.491505156847296,
                        63.4882257431112
                    ],
                    [
                        10.453505336995107,
                        63.500073747690436
                    ],
                    [
                        10.412382244279826,
                        63.51354197957528
                    ],
                    [
                        10.363971514880518,
                        63.50936286319026
                    ],
                    [
                        10.301506057590217,
                        63.49171096032066
                    ],
                    [
                        10.267670601558962,
                        63.46428243634642
                    ],
                    [
                        10.359286605583947,
                        63.419130867795786
                    ]
                ]
            ],
            "type": "Polygon"
        }
    }

    # Attempts to make the API request and return the response data.
    try:
        response = requests.post(url, headers=headers, json=data_raw)

        # Raises an error if the response status is not 200 (OK).
        response.raise_for_status()

        # Loads the response data into a Python dictionary.
        data = json.loads(response.text)

        # Checks if the response data is empty.
        if not data:
            print("No data received.")

        # Returns the response data as a JSON object.
        return response.json()

    except requests.exceptions.HTTPError as err:
        print("Error: " + str(err))


def get_data_from_mmsi(token, mmsi_list):
    """
    Retrieves the latest data of all ships based on MMSI numbers.
    """
    # Defines the API endpoint for retrieving the latest ship data.
    url = f"{credentials.config['api_base_url']}/v1/latest/combined"

    # Sets the necessary headers for the API request.
    headers = {
        'authorization': 'Bearer ' + token['access_token'],
        'content-type': 'application/json',
    }

    # Packages the list of MMSI numbers into the API request payload.
    data = {
        'mmsi': mmsi_list
    }

    # Makes the API request and check for errors.
    response = requests.post(url, headers=headers, json=data)
    response.raise_for_status()

    # Return the JSON formatted response from the API
    return response.json()
