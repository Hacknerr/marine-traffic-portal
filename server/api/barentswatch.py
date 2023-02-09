
import requests
import json
from tools import utilities
from api.credentials import config


# requests/collects the mmsi of all boats in a specific area from the api.
def data_request_of_area(token):

    url = f"{config['api_historic_base_url']}/v1/historic/mmsiinarea"
    headers = {
        'authorization': 'Bearer ' + token['access_token'],
        'content-type': 'application/json',
    }

    # data struct necessary for tracking a geographical area
    data_raw = {
        "msgtimefrom": utilities.format_datetime(utilities.get_datetime_2_hours_ago()),
        "msgtimeto": utilities.format_datetime(utilities.getCurrentTime()),
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

    # attempts to make request.
    try:
        response = requests.post(url, headers=headers, json=data_raw)
        response.raise_for_status()
        data = json.loads(response.text)
        if not data:
            print("No data received.")
        return response.json()
    except requests.exceptions.HTTPError as err:
        print("Error: " + str(err))


# collects the latest data of all vessels in the input list
def get_data_from_mmsi(token, mmsi_list):
    url = f"{config['api_base_url']}/v1/latest/combined"
    headers = {
        'authorization': 'Bearer ' + token['access_token'],
        'content-type': 'application/json',
    }
    data = {
        'mmsi': mmsi_list
    }

    response = requests.post(url, headers=headers, json=data)
    response.raise_for_status()
    return response.json()
