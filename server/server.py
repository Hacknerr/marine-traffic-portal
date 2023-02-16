import json
import pprint

from stub import deserialization, serialization
from database import firestore
from api import barentswatch, authentication

from flask import Flask
from flask_socketio import SocketIO
from flask_cors import CORS

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
socketio = SocketIO(app, cors_allowed_origins="*")


# Collects the MMSI values of all ships in a specific area from the Barentswatch API.
# The parameter token is required to access the Barentswatch API.
def stub(token):
    # Collects the MMSI values of all ships in a specific area from the API.
    collected_data = barentswatch.data_request_of_area(token)

    # If the collected data is not empty.
    if len(collected_data) != 0:
        # Writes the collected MMSI values to a JSON file temporarily
        serialization.json_to_file_area(collected_data)


# Regenerates the map by updating the data displayed on it.
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

    # Creates an empty list to hold relevant data from each boat.
    relevant_data = []
    # Loops through each boat in the list of boat data.
    for boat in list_of_boat_data:
        # Gets the values for each relevant field from the boat, and use an empty string if the field is missing.
        mmsi = boat.get("mmsi", "")
        latitude = boat.get("latitude", "")
        longitude = boat.get("longitude", "")
        name = boat.get("name", "")
        ship_type = boat.get("shipType", "")
        speed_over_ground = boat.get("speedOverGround", "")
        true_heading = boat.get("trueHeading", "")
        course_over_ground = boat.get("courseOverGround", "")

        # Adds a dictionary with the relevant data to the list of relevant data.
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


# Event listener for client connecting to the server.
@socketio.event
def connect():
    print("Client connected to the server!")


# Event listener for client disconnecting from the server.
@socketio.event
def disconnect():
    print('Client disconnected from the server!')


# Event listener for connection errors.
@socketio.event
def connect_error():
    print("Client unable to establish a connection to the server!")


# Event listener for data request from client.
@socketio.on('data_request')
def send_ship_data():
    print("executing data_request method")

    # Generates relevant data and converts to JSON.
    payload = json.dumps(regenerate_map())

    # Sends relevant data to client.
    pprint.pprint(payload)
    socketio.emit('data', payload)


# Event listener for client connection.
@socketio.on('user_connected')
def on_user_connected():
    while True:
        print("executing user_connected method")

        # Sends updated data to client.
        send_ship_data()

        # Waits 30 seconds before sending updates again.
        print("Sleeping...")
        socketio.sleep(30)


# Main method to run the server
if __name__ == "__main__":
    # Starts the server and listens for connections.
    socketio.run(app, debug=True, host='127.0.0.1')
