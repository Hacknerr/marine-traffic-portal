# Imports the necessary modules for Firebase integration
import firebase_admin
import json
import datetime
import time

from firebase_admin import credentials
from firebase_admin import firestore

from sty import fg, bg, ef, rs
from sty import Style, RgbFg

# Upgrade firebase-admin if necessary.
# !pip install --upgrade firebase-admin

# Initializes the use of a service account.
cred = credentials.Certificate('database/key.json')
firebase_admin.initialize_app(cred)

# Creates a Firestore client for interacting with the Firebase database.
db = firestore.client()


# Writes a list of JSON objects to Firestore database.
def write_new_data_to_firestore(data):
    print(fg.li_green + 'Writing new data to database...')

    # Iterates through the list of JSON objects.
    for item in data:
        # Uses the MMSI value of the JSON object as the collection name.
        collection_name = str(list(item.values())[8])
        timestamp = list(item.values())[9]

        # Writes the JSON object to the Firestore database.
        db.collection(collection_name).document(timestamp).set(item)
        doc_ref_id = db.collection(collection_name).document(timestamp)

        print(f"FIRESTORE: Writing document {doc_ref_id.id} to collection {collection_name}.")
    print(fg.li_green + 'FIRESTORE: All collections successfully written to the database.')


# Deletes all collections and their associated documents from Firestore.
def delete_collections():
    print(fg.li_green + 'FIRESTORE: Deleting all collections from the database...')

    # Gets a list of all collections in the Firestore database.
    collections = db.collections()

    # Iterates over the collections and deletes each one.
    for collection in collections:
        # Gets a stream of all documents within the current collection.
        docs = collection.stream()

        # Deletes each document within the collection.
        for doc in docs:
            doc.reference.delete()
        print(f"FIRESTORE: Deleting collection {collection.id}.")
    print(fg.li_green + 'FIRESTORE: All collections successfully deleted from the database.')


# Retrieves all collections and their associated documents from Firestore
# and returns them as a list of dictionaries.
def read_latest_data_from_database():
    print(fg.li_green + 'FIRESTORE: Reading latests data from database...')

    documents = []

    # Retrieves a list of all collections in Firestore.
    collections = db.collections()

    # Iterates through the collections and retrieves the document with the most recent datetime.
    for collection in collections:
        # Gets a stream of all documents within the current collection, sorted by "msgtime" field in descending order.
        docs = collection.order_by("msgtime", direction=firestore.Query.DESCENDING).limit(1).stream()

        # Iterates through the documents and add them to the `documents` list.
        for doc in docs:
            data = doc.to_dict()
            documents.append(data)
            print(f"FIRESTORE: Reading collection {collection.id}, document {doc.id} with msgtime {data['msgtime']}.")
        if not docs:
            print(f"FIRESTORE: Collection {collection.id} is empty.")
    print(fg.li_green + 'FIRESTORE: All collections successfully read from the database.')

    json_with_boat_data = json.dumps(documents)
    return json_with_boat_data
