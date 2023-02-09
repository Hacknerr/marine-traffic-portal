import time
import json
import folium
import threading
from stub import deserialization, serialization
from database import firestore
from api import barentswatch, authentication
from flask import Flask, jsonify


# This function collects the MMSI values of all ships in a specific area from the Barentswatch API.
# The parameter token is required to access the Barentswatch API.
def stub(token):
    # Collects the MMSI values of all ships in a specific area from the API.
    collected_data = barentswatch.data_request_of_area(token)

    # If the collected data is not empty.
    if len(collected_data) != 0:
        # Writes the collected MMSI values to a JSON file temporarily
        serialization.json_to_file_area(collected_data)


# This function extracts the latitude and longitude from a list of dictionaries.
# After that, it returns a list of coordinates.
def get_coordinates_from_list_of_dicts(dict_list):
    coordinates = []
    for dictionary in dict_list:
        if "latitude" in dictionary and "longitude" in dictionary:
            # Extracts latitude and longitude and stores them as a list
            coordinates.append([dictionary["latitude"], dictionary["longitude"]])
    # Returns a list of lists, where each list contains a latitude and longitude value.
    return coordinates


# This function adds markers to the Folium map based on the latitude and longitude
def add_markers(m, coordinates_list):
    for coord in coordinates_list:
        folium.Marker(coord,
                      icon=folium.Icon(color='darkpurple', icon="ship", prefix='fa')
                      ).add_to(m)
    # Returns a Folium map object with markers added.
    return m


# This function regenerates the map by updating the data displayed on it.
def regenerate_map():
    """
    The following steps are performed:
    1. Collects authentication token for BarentsWatch API.
    2. Clears everything from the database.
    3. Writes data from API to file.
    4. Reads data from file and converts it to a list of MMSI.
    5. Uses the MMSI list to fetch boat data from the API.
    6. Writes the boat data to the database.
    7. Collects the boat data from the database.
    8. Extracts the latitude and longitude data from the boat data.
    9. Adds markers to the map based on the latitude and longitude data.
    10. Saves the map as an HTML file.
    """

    # Collects authentication token for BarentsWatch API.
    token = authentication.get_token()

    # Clears everything from the database.
    firestore.delete_collections()

    # Writes data from API to file.
    stub(token)

    # Reads data from file and converts it to a list of MMSI.
    list_of_mmsi = json.loads(deserialization.read_file_to_string_area())

    # Uses the MMSI list to fetch boat data from the API.
    boat_data_json_response = barentswatch.get_data_from_mmsi(token, list_of_mmsi)

    # Writes the boat data to the database.
    firestore.write_to_firestore(boat_data_json_response)

    # Collects the boat data from the database.
    list_of_boat_data = firestore.read_from_firestore()

    # Extracts the latitude and longitude data from the boat data.
    list_of_coords = get_coordinates_from_list_of_dicts(list_of_boat_data)

    # Adds markers to the map based on the latitude and longitude data.
    m = folium.Map(location=[63.486112, 10.3980667], zoom_start=11, tiles="cartodb positron", control_scale=True)
    m = add_markers(m, list_of_coords)

    # Saves the map as an HTML file.
    m.save("map.html")


# Initializes the Flask app.
app = Flask(__name__)


# Endpoint that returns a JSON object containing the coordinates of a location.
@app.route('/coordinates', methods=['GET'])
def get_coordinates():
    # Hardcoded coordinates of a location.
    coordinates = [63.486112, 10.3980667]

    # Returns the coordinates in a JSON format.
    return jsonify({'coordinates': coordinates})


# This function is continuously executed every 2 minutes.
# Allowing for the map to be updated in real-time.
def update_map():
    while True:
        regenerate_map()
        print("Map updated. Next update in a few minutes...")
        time.sleep(120)


# Main method
if __name__ == "__main__":
    # Starts a new thread for the `update_map` function
    t = threading.Thread(target=update_map)
    t.start()

    # Runs the Flask app with debug mode set to False
    app.run(debug=False)
