"""
This module provides a web server that interacts with a MongoDB database and
various APIs to provide real-time data to the frontend. It uses Flask,
Flask-SocketIO, and Flask-CORS for handling web requests and WebSocket
communication, and it manages tasks with the help of the threading module.
"""

import time
import threading

from requests import RequestException
from database import mongodb
from barentswatch import data_request, authentication
from flask import Flask, stream_with_context, Response
from flask_cors import CORS
from sty import fg
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


# ¤-------------------------Reading data-------------------------¤ #

def polling(num_iterations=None, sleep_time=600):
    """
    Continuously polls data from the BarentsWatch API, writes the data to MongoDB,
    and removes old documents. The function runs in an infinite loop and sleeps
    for 600 seconds between iterations.
    """
    iterations = 0
    while num_iterations is None or iterations < num_iterations:
        print(fg.orange + 'SERVER: Executing polling...(requesting data from API, writing to DB)')

        # Collects authentication token for BarentsWatch API.
        token = authentication.get_token()
        print(token)

        # Requests a list of MMSI numbers for boats in a certain area from the API.
        try:
            list_of_mmsi = data_request.data_request_of_area(token)
        except RequestException as error:
            # If an error occurs, prints an error message and returns an empty list.
            print(f"SERVER: Error occurred while requesting MMSI data from the API: {error}")
            list_of_mmsi = []

        # Uses the list of MMSI numbers to fetch boat data from the API.
        try:
            json_response_with_data = data_request.get_data_from_mmsi(token, list_of_mmsi)
        except RequestException as error:
            # If an error occurs, prints an error message and returns an empty list.
            print(f"SERVER: Error occurred while requesting boat data from the API: {error}")
            json_response_with_data = []

        # Writes the JSON response with data to the database.
        mongodb.write_new_data_to_mongodb(json_response_with_data)

        # Deletes document from any collection if the "msgtime"
        # field of the document is older than 7 days.
        mongodb.delete_old_documents()

        print(fg.blue + 'SERVER: Polling successfully completed... Sleeping for 600 seconds...')
        time.sleep(sleep_time)
        iterations += 1


@app.route('/sse')
def send_data_to_frontend():
    """
    Streams data from the MongoDB database to the frontend using server-sent events (SSE).
    The function generates and sends the data in a continuous loop, sleeping for 30 seconds
    between each iteration.

    Returns:
        Response: A Flask Response object with the streaming
        data and content type set to 'text/event-stream'.
    """
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

    # Returns a Flask Response object that uses the generator
    # function to stream data to the frontend.
    return Response(stream_with_context(generate()), content_type='text/event-stream')


# ¤-------------------------Startup-------------------------¤ #

# The main function that starts the application
if __name__ == "__main__":
    # Remove these lines of code when development is finished.
    mongodb.delete_all_collections()

    # Create a thread for polling
    polling_thread = threading.Thread(target=polling, args=(None, 600))

    # Start the polling thread
    polling_thread.start()

    # Start the Waitress server in the main thread
    serve(app, host='0.0.0.0', port=5000, threads=4)
