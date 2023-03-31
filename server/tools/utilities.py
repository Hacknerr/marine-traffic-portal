# Import the required modules
import pytz
import time
from datetime import datetime, timedelta


# This function returns the current date and time in Oslo, Norway timezone
def getCurrentTime():
    # Sets the timezone to Europe/Oslo
    oslo_tz = pytz.timezone("Europe/Oslo")

    # Gets the current date and time in the specified timezone
    current_datetime = datetime.now(tz=oslo_tz)

    # Convert the datetime object to UTC timezone
    current_datetime_utc = current_datetime.astimezone(pytz.UTC)

    # Returns the current date and time
    return format_datetime(current_datetime_utc)


# This function calculates the datetime 2 hours ago from the current time
def get_datetime_2_hours_ago():
    # Defines the local timezone as "Europe/Oslo"
    oslo_tz = pytz.timezone("Europe/Oslo")

    # Gets the current datetime in the specified timezone
    current_datetime_two = datetime.now(tz=oslo_tz)

    # Calculates the datetime 2 hours ago from the current time
    datetime_2_hours_ago = current_datetime_two - timedelta(hours=1)

    # Convert the datetime object to UTC timezone
    datetime_2_hours_ago_utc = datetime_2_hours_ago.astimezone(pytz.UTC)

    # Returns the calculated datetime
    return format_datetime(datetime_2_hours_ago_utc)


# This function takes in a datetime object and returns a string in the format "YYYY-MM-DDTHH:MM:SS+00:00"
# This format is commonly used in datetime strings for APIs, databases and other applications.
# The 'T' is a separator between the date and time, and the '+00:00' is the UTC timezone offset.
def format_datetime(dt: datetime) -> str:
    # Using the strftime method, the datetime object is formatted according to the string pattern specified.
    return dt.strftime("%Y-%m-%dT%H:%M:%S+00:00")


# This function implements a simple stopwatch that counts down the number of seconds specified.
def stopwatch(seconds):
    start = time.time()
    time.clock()
    elapsed = 0
    while elapsed < seconds:
        elapsed = time.time() - start
        print("loop cycle time: %f, seconds count: %02d" % (time.clock(), elapsed))
        time.sleep(1)
