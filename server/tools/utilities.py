"""
This module contains functions that handle datetime conversions and a stopwatch implementation.
"""
from datetime import datetime, timedelta
import pytz


def get_current_time():
    """
    This function returns the current date and time in Oslo, Norway timezone.
    """
    # Sets the timezone to Europe/Oslo.
    oslo_tz = pytz.timezone("Europe/Oslo")

    # Gets the current date and time in the specified timezone.
    current_datetime = datetime.now(tz=oslo_tz)

    # Converts the datetime object to UTC timezone.
    current_datetime_utc = current_datetime.astimezone(pytz.UTC)

    # Returns the current date and time.
    return format_datetime(current_datetime_utc)


def get_datetime_2_hours_ago():
    """
    This function calculates the datetime 2 hours ago from the current time.
    """
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


def format_datetime(date_time: datetime) -> str:
    """
    Formats a datetime object to a string in "YYYY-MM-DDTHH:MM:SS+00:00" format,
    which is commonly used in datetime strings for APIs, databases and other applications.
    """
    # Using the strftime method, the datetime object is formatted
    # according to the string pattern specified.
    return date_time.strftime("%Y-%m-%dT%H:%M:%S+00:00")
