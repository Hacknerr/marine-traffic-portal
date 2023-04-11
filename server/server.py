import time
import threading

from database import mongodb
from api import barentswatch, authentication
from flask import Flask, stream_with_context, Response
from flask_socketio import SocketIO
from flask_cors import CORS

from sty import fg, bg, ef, rs
from sty import Style, RgbFg

from waitress import serve

fg.orange = Style(RgbFg(255, 150, 50))

# ¤-------------------------SocketIO-------------------------¤ #

# Creates a new Flask web application instance.
app = Flask(__name__)

# This is used to generate secure session cookies.
app.config['SECRET_KEY'] = 'secret!123456789!'

# Enables Cross-Origin Resource Sharing (CORS) for the Flask application.
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# Creates a new Socket.IO server that is integrated with the Flask application.
socketio = SocketIO(app, cors_allowed_origins="*")


# ¤-------------------------Reading data-------------------------¤ #

def polling():
    while True:
        print(fg.orange + 'SERVER: Executing polling...(requesting data from API, writing to DB)')

        # Collects authentication token for BarentsWatch API.
        token = authentication.get_token()
        print(token)

        # Requests a list of MMSI numbers for boats in a certain area from the API.
        try:
            list_of_mmsi = barentswatch.data_request_of_area(token)
        except Exception as e:
            # If an error occurs, prints an error message and returns an empty list.
            print(f"SERVER: Error occurred while requesting MMSI data from the API: {e}")
            list_of_mmsi = []

        # Uses the list of MMSI numbers to fetch boat data from the API.
        try:
            json_response_with_data = barentswatch.get_data_from_mmsi(token, list_of_mmsi)
        except Exception as e:
            # If an error occurs, prints an error message and returns an empty list.
            print(f"SERVER: Error occurred while requesting boat data from the API: {e}")
            json_response_with_data = []

        # Writes the JSON response with data to the database.
        mongodb.write_new_data_to_mongodb(json_response_with_data)

        # Delete documents from any collection if the "msgtime" field of the document is older than 7 days.
        mongodb.delete_old_documents()

        print(fg.blue + 'SERVER: Polling successfully completed... Sleeping for 600 seconds...')
        time.sleep(600)


# Defines a Flask route for server-sent events
@app.route('/sse')
def send_data_to_frontend():
    print(fg.orange + 'SERVER: Streaming data to frontend...')

    # Defines a generator function that will continually yield the latest data from the database
    def generate():
        while True:
            data = mongodb.read_latest_data_from_database()
            # Sends the data to the frontend as a server-sent event,
            # which consists of a data field followed by two newlines
            yield 'data: %s\n\n' % data
            print(fg.orange + 'SERVER: Data streamed to frontend successfully. Sleeping for 30 seconds...')
            time.sleep(30)

    # Returns a Flask Response object that uses the generator function to stream data to the frontend
    return Response(stream_with_context(generate()), content_type='text/event-stream')


# ¤-------------------------Startup-------------------------¤ #

# The main function that starts the application
if __name__ == "__main__":
    # Remove these lines of code when development is finished.
    mongodb.delete_all_collections()

    # Create a thread for polling
    polling_thread = threading.Thread(target=polling)

    # Start the polling thread
    polling_thread.start()

    # Start the Waitress server in the main thread
    serve(app, host='0.0.0.0', port=5000, channel_timeout=120)
