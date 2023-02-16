import time
import json
import folium

from stub import deserialization, serialization
from database import firestore
from api import barentswatch, authentication

from flask import Flask, jsonify, request
from flask_socketio import SocketIO, emit, send
from flask_cors import CORS

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
socketio = SocketIO(app, cors_allowed_origins="*")


def stub(token):
    collected_data = barentswatch.data_request_of_area(token)

    if len(collected_data) != 0:
        serialization.json_to_file_area(collected_data)


def get_coordinates_from_list_of_dicts(dict_list):
    coordinates = []
    for dictionary in dict_list:
        if "latitude" in dictionary and "longitude" in dictionary:
            coordinates.append([dictionary["latitude"], dictionary["longitude"]])
    return coordinates


def add_markers(m, coordinates_list):
    for coord in coordinates_list:
        folium.Marker(coord,
                      icon=folium.Icon(color='darkpurple', icon="ship", prefix='fa')
                      ).add_to(m)
    return m


def regenerate_map():
    token = authentication.get_token()

    firestore.delete_collections()

    stub(token)

    list_of_mmsi = json.loads(deserialization.read_file_to_string_area())

    boat_data_json_response = barentswatch.get_data_from_mmsi(token, list_of_mmsi)

    firestore.write_to_firestore(boat_data_json_response)

    list_of_boat_data = firestore.read_from_firestore()

    relevant_data = []
    for boat in list_of_boat_data:
        mmsi = boat.get("mmsi", "")
        latitude = boat.get("latitude", "")
        longitude = boat.get("longitude", "")
        name = boat.get("name", "")
        ship_type = boat.get("shipType", "")
        speed_over_ground = boat.get("speedOverGround", "")
        true_heading = boat.get("trueHeading", "")
        course_over_ground = boat.get("courseOverGround", "")
        relevant_data.append({
            "mmsi": mmsi,
            "latitude": latitude,
            "longitude": longitude,
            "name": name,
            "shipType": ship_type,
            "speedOverGround": speed_over_ground,
            "trueHeading": true_heading,
            "courseOverGround": course_over_ground
        })

    print("Map updated. Next update in a few minutes...")
    return relevant_data


@socketio.event
def connect():
    print("I'm connected!")


@socketio.event
def connect_error():
    print("The connection failed!")


@socketio.event
def disconnect():
    print('Im disconnected!')


@socketio.on('data_request')
def send_ship_data():
    print("in data_request method")
    payload = json.dumps(regenerate_map())
    print(payload)
    socketio.emit('data', payload)


@socketio.on('user_connected')
def on_user_connected():
    while True:
        print("in user_connected method")
        send_ship_data()
        print("Sleeping...ZZzzzzz...")
        socketio.sleep(30)


# Main method
if __name__ == "__main__":
    socketio.run(app, debug=False, host='127.0.0.1')
