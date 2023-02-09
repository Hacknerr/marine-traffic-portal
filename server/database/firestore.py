import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# pip install --upgrade firebase-admin

# initializes use of a service account
cred = credentials.Certificate('database/key.json')
firebase_admin.initialize_app(cred)

# initializes use of a Firestore client
db = firestore.client()


# takes json objects as input and writes to database
def write_to_firestore(data):
    # iterates through the list of json objects
    for item in data:
        # uses the MMSI value of the json object as the collection name
        collection_name = str(list(item.values())[8])
        timestamp = list(item.values())[9]

        db.collection(collection_name).document(timestamp).set(item)
        doc_ref_id = db.collection(collection_name).document(timestamp)
        print(f"Document {doc_ref_id.id} added to collection {collection_name}.")
    print("All collections successfully added to the database.")


# this method deletes all collections and their associated documents from firestore.
def delete_collections():
    # grabs a list of all collections
    collections = db.collections()

    # Iterate through the collections and delete them
    for collection in collections:
        docs = collection.stream()
        for doc in docs:
            doc.reference.delete()
        print(f"Collection {collection.id} deleted.")
    print("All collections successfully deleted from the database.")


# this method reads all collections and their associated documents
# from Firestore and returns them as a list of dictionaries.
def read_from_firestore():
    a_list = []
    # Get a list of all collections
    collections = db.collections()

    # Iterate through the collections and add them
    for collection in collections:
        docs = collection.stream()
        for doc in docs:
            data = doc.to_dict()
            a_list.append(data)
    return a_list
