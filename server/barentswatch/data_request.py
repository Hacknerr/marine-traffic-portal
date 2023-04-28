
import requests
import json
from tools import utilities
from credentials import config


# Requests and collects the mmsi of all ships in a specific area from the API.
def data_request_of_area(token):

    # Defines the API endpoint for fetching mmsi in a specific area.
    url = f"{config['api_historic_base_url']}/v1/historic/mmsiinarea"

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

    # Defines the data structure necessary for tracking a geographical area.
    # The data structure contains a time range and a polygon that defines the geographical area.
    data_raw_old = {
        "msgtimefrom": two_hours_ago,
        "msgtimeto": now,
        "polygon": {
            "coordinates": [
                [
                    [
                        10.6030045092038,
                        63.29961299403715
                    ],
                    [
                        11.073060510455235,
                        63.30242896215148
                    ],
                    [
                        11.424035658055743,
                        63.48487755288576
                    ],
                    [
                        11.712336672156425,
                        63.73281604842941
                    ],
                    [
                        11.712336672156425,
                        63.87944008236926
                    ],
                    [
                        11.411500831355767,
                        63.901505812735934
                    ],
                    [
                        10.979049310204175,
                        63.862879402934055
                    ],
                    [
                        10.70955053615387,
                        63.77439082776135
                    ],
                    [
                        10.358575388552424,
                        63.66894913265969
                    ],
                    [
                        10.082809201151662,
                        63.607724135195525
                    ],
                    [
                        9.93865869410078,
                        63.66894913265969
                    ],
                    [
                        9.838380080501224,
                        63.680066771990056
                    ],
                    [
                        9.694229573450372,
                        63.64113595368673
                    ],
                    [
                        9.606485786549769,
                        63.57706210328345
                    ],
                    [
                        9.568881303804716,
                        63.43727219262129
                    ],
                    [
                        9.713031810855426,
                        63.29971709814515
                    ],
                    [
                        9.957460931505835,
                        63.22640553869957
                    ],
                    [
                        10.270831599006499,
                        63.28281557065367
                    ],
                    [
                        10.6030045092038,
                        63.29961299403715
                    ]
                ]
            ],
            "type": "Polygon"
        }
    }

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


# Retrieves the latest data of all ships.
# The token parameter is a dictionary containing the API access token for authorization.
# list parameter is a list of MMSI numbers representing the ships for which to retrieve data.
def get_data_from_mmsi(token, mmsi_list):

    # Defines the API endpoint for retrieving the latest ship data.
    url = f"{config['api_base_url']}/v1/latest/combined"

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
