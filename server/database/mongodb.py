import json
import datetime
import time
import pymongo

from sty import fg, bg, ef, rs
from sty import Style, RgbFg

# Initializes the connection to a local MongoDB instance.
client = pymongo.MongoClient("mongodb://localhost:27017/", w='majority')
db = client.get_database("mydatabase")


# Writes a list of JSON objects to MongoDB database.
def write_new_data_to_mongodb(data):
    print(fg.li_green + 'Writing new data to database...')

    # Iterates through the list of JSON objects.
    for item in data:
        # Uses the MMSI value of the JSON object as the collection name.
        collection_name = str(list(item.values())[8])
        timestamp = list(item.values())[9]

        # Get the collection object, creating it if it does not exist.
        collection = db[collection_name]
        if collection.count_documents({}) == 0:
            db.create_collection(collection_name)

        # Writes the JSON object to the MongoDB database.
        collection = db[collection_name]
        collection.insert_one(item)

        print(f"MONGODB: Writing document to collection {collection_name}.")
    print(fg.li_green + 'MONGODB: All collections successfully written to the database.')


# Deletes all collections and their associated documents from MongoDB.
def delete_collections():
    print(fg.li_green + 'MONGODB: Deleting all collections from the database...')

    # Gets a list of all collections in the MongoDB database.
    collections = db.list_collection_names()

    # Iterates over the collections and deletes each one.
    for collection in collections:
        db[collection].drop()
        print(f"MONGODB: Deleting collection {collection}.")
    print(fg.li_green + 'MONGODB: All collections successfully deleted from the database.')


# Retrieves all collections and their associated documents from MongoDB
# and returns them as a list of dictionaries.
def read_latest_data_from_database():
    print(fg.li_green + 'MONGODB: Reading latests data from database...')

    documents = []

    # Retrieves a list of all collections in MongoDB.
    collections = db.list_collection_names()

    # Iterates through the collections and retrieves the document with the most recent datetime.
    for collection_name in collections:
        # Gets the most recent document from the collection, sorted by "msgtime" field in descending order.
        collection = db[collection_name]
        data = collection.find_one(sort=[("msgtime", pymongo.DESCENDING)])

        if data:
            # Remove the ObjectId field from the document
            data.pop("_id", None)
            documents.append(data)
            print(f"MONGODB: Reading collection {collection_name}, document with msgtime {data['msgtime']}.")
        else:
            print(f"MONGODB: Collection {collection_name} is empty.")

    print(fg.li_green + 'MONGODB: All collections successfully read from the database.')

    json_with_boat_data = json.dumps(documents)
    return json_with_boat_data

