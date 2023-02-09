# Imports the necessary modules for Firebase integration
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Upgrade firebase-admin if necessary.
# !pip install --upgrade firebase-admin

# Initializes the use of a service account.
cred = credentials.Certificate('database/key.json')
firebase_admin.initialize_app(cred)

# Creates a Firestore client for interacting with the Firebase database.
db = firestore.client()


# Writes a list of JSON objects to Firestore database.
def write_to_firestore(data):

    # Iterates through the list of JSON objects.
    for item in data:
        # Uses the MMSI value of the JSON object as the collection name.
        collection_name = str(list(item.values())[8])
        timestamp = list(item.values())[9]

        # Writes the JSON object to the Firestore database.
        db.collection(collection_name).document(timestamp).set(item)
        doc_ref_id = db.collection(collection_name).document(timestamp)

        print(f"Document {doc_ref_id.id} added to collection {collection_name}.")
    print("All collections successfully added to the database.")


# Deletes all collections and their associated documents from Firestore.
def delete_collections():

    # Gets a list of all collections in the Firestore database.
    collections = db.collections()

    # Iterates over the collections and deletes each one.
    for collection in collections:
        # Gets a stream of all documents within the current collection.
        docs = collection.stream()

        # Deletes each document within the collection.
        for doc in docs:
            doc.reference.delete()
        print(f"Collection {collection.id} deleted.")
    print("All collections successfully deleted from the database.")


# Retrieves all collections and their associated documents from Firestore
# and returns them as a list of dictionaries.
def read_from_firestore():

    documents = []

    # Retrieves a list of all collections in Firestore.
    collections = db.collections()

    # Iterates through the collections and retrieve the documents.
    for collection in collections:
        # Gets a stream of all documents within the current collection.
        docs = collection.stream()

        # Iterates through the documents and add them to the `documents` list.
        for doc in docs:
            data = doc.to_dict()
            documents.append(data)
    return documents
