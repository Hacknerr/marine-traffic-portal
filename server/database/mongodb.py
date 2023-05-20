"""
This module provides functions to read and write data from and to
a MongoDB database. The module uses the PyMongo driver to
interact with the MongoDB database.
"""

import json
import datetime
import pymongo

from sty import fg

# Initializes the connection to a local MongoDB instance.
client = pymongo.MongoClient("mongodb://mongodb:27017/", w='majority')
# client = pymongo.MongoClient("mongodb://localhost:27017/", w="majority")
db = client.get_database("mydatabase")


def write_new_data_to_mongodb(data):
    """
    This function writes a list of JSON objects to MongoDB by using the
    MMSI value of each JSON object as the collection name. If the
    collection does not exist, it creates it. Finally, it writes
    the JSON object to the MongoDB database.
    """
    print(fg.li_green + "Writing new data to database...")

    # Iterate through the list of JSON objects.
    for item in data:
        # Use the MMSI value of the JSON object as the collection name.
        collection_name = str(list(item.values())[8])

        # Get the collection object, creating it if it does not exist.
        collection = db.get_collection(collection_name)
        if collection is None:
            db.create_collection(collection_name)

        # Write the JSON object to the MongoDB database.
        collection = db[collection_name]
        collection.insert_one(item)

        print(f"MONGODB: Writing document to collection {collection_name}.")

    print(
        fg.li_green + "MONGODB: All collections successfully written to the database."
    )


def delete_all_collections():
    """
    This function deletes all collections from the MongoDB
    database by iterating over each collection and dropping it.
    """
    print(fg.li_green + "MONGODB: Deleting all collections from the database...")

    # Gets a list of all collections in the MongoDB database.
    collections = db.list_collection_names()

    # Iterates over the collections and deletes each one.
    for collection in collections:
        db[collection].drop()
        print(f"MONGODB: Deleting collection {collection}.")
    print(
        fg.li_green + "MONGODB: All collections successfully deleted from the database."
    )


def delete_old_documents():
    """
    Deletes documents that are older than 7 days from all collections in MongoDB.
    """
    print(fg.li_green + "MONGODB: Attempting to delete documents older than 7 days...")

    # Calculate the datetime that was 3 minutes ago
    three_minutes_ago = datetime.datetime.now() - datetime.timedelta(days=7)
    print(three_minutes_ago)

    # Iterate over all collections
    for collection_name in db.list_collection_names():
        collection = db[collection_name]

        # Find all documents where the msgtime field is older than 3 minutes
        documents_to_delete = collection.find(
            {"msgtime": {"$lt": three_minutes_ago.strftime("%Y-%m-%dT%H:%M:%S+00:00")}}
        )

        # Iterate over the documents and delete them
        for document in documents_to_delete:
            collection.delete_one({"_id": document["_id"]})
            print(
                f"MONGODB: Deleted document from collection {collection_name} with "
                f"msgtime {document['msgtime']}."
            )

        # Check if the collection is empty
        if collection.count_documents({}) == 0:
            db.drop_collection(collection_name)
            print(
                f"MONGODB: Deleted collection {collection_name} because it was empty."
            )

    print(fg.li_green + "MONGODB: Deleted old documents from all collections.")


def read_latest_data_from_database():
    """
    This function reads the latest data from the MongoDB database,
    removing the ObjectId field from each document, and returns
    the data as a JSON object.
    """
    print(fg.li_green + "MONGODB: Reading latests data from database...")

    documents = []

    # Retrieves a list of all collections in MongoDB.
    collections = db.list_collection_names()

    # Iterates through the collections and retrieves the document with the most recent datetime.
    for collection_name in collections:
        # Retrieves the most recent document from the collection, sorted by
        # "msgtime" in descending order.
        collection = db[collection_name]
        data = collection.find_one(sort=[("msgtime", pymongo.DESCENDING)])

        if data:
            # Remove the ObjectId field from the document
            data.pop("_id", None)
            documents.append(data)
            print(
                f"MONGODB: Reading collection {collection_name}, "
                f"document with msgtime {data['msgtime']}."
            )
        else:
            print(f"MONGODB: Collection {collection_name} is empty.")

    print(fg.li_green + "MONGODB: All collections successfully read from the database.")

    json_with_boat_data = json.dumps(documents)
    return json_with_boat_data
