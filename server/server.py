
import time
import json
import folium
import threading
from stub import deserialization, serialization
from database import firestore
from api import barentswatch, authentication
from flask import Flask, jsonify


# helper method for stubbing.
def stub(token):
    # requests/collects the mmsi of all ships in a specific area from the api.
    collected_data = barentswatch.data_request_of_area(token)
    if len(collected_data) != 0:
        # temporary writes the collected mmsi-s to a json file.
        serialization.json_to_file_area(collected_data)


# returns a list of coords from each boat from a list of dictionaries.
# each dictionary is a boat-object with json data.
def get_coordinates_from_list_of_dicts(dict_list):
    coordinates = []
    for dictionary in dict_list:
        if "latitude" in dictionary and "longitude" in dictionary:
            coordinates.append([dictionary["latitude"], dictionary["longitude"]])
    return coordinates


# takes list of coordinates and adds them to map. then returns the map.
# this method will be deprecated once connection til leaflet is established.
def add_markers(m, coordinates_list):
    for coord in coordinates_list:
        folium.Marker(coord,
                      icon=folium.Icon(color='darkpurple', icon="ship", prefix='fa')
                      ).add_to(m)
    return m


def regenerate_map():
    # collects authentication token for barentswatch api.
    token = authentication.get_token()

    # clears everything from the database.
    firestore.delete_collections()

    # writes data from api to file.
    stub(token)

    # reads data from file to list.
    list_of_mmsi = json.loads(deserialization.read_file_to_string_area())
    boat_data_json_response = barentswatch.get_data_from_mmsi(token, list_of_mmsi)

    # writes data from list to database.
    firestore.write_to_firestore(boat_data_json_response)

    # collects data from database.
    list_of_boat_data = firestore.read_from_firestore()

    # gets coords from data.
    list_of_coords = get_coordinates_from_list_of_dicts(list_of_boat_data)

    # adds markers to map based on latitude/longitude data.
    m = folium.Map(location=[63.486112, 10.3980667], zoom_start=11, tiles="cartodb positron", control_scale=True)
    m = add_markers(m, list_of_coords)
    m.save("map.html")


# initiates flask for use of routes.
app = Flask(__name__)


# route for website.
@app.route('/coordinates', methods=['GET'])
def get_coordinates():
    coordinates = [63.486112, 10.3980667]
    return jsonify({'coordinates': coordinates})


# function that enables looping.
def update_map():
    while True:
        regenerate_map()
        print("Map updated. Next update in a few minutes...")
        time.sleep(30)


# main method.
if __name__ == "__main__":
    t = threading.Thread(target=update_map)
    t.start()
    app.run(debug=False)
