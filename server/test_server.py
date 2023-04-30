"""
Test module for marine-traffic-portal application.

This module contains test cases for the server functionality, including
the polling function and the send_data_to_frontend function. It uses pytest
and MagicMock to mock external dependencies for testing purposes.
"""
from unittest.mock import MagicMock

import pytest

from barentswatch import data_request, authentication
from database import mongodb
from server import app, polling

# To mock external dependencies.
app.config["TESTING"] = True
client = app.test_client()


@pytest.fixture(autouse=True)
def mock_dependencies():
    """Mock dependencies for testing purposes."""
    mongodb.write_new_data_to_mongodb = MagicMock()
    mongodb.delete_old_documents = MagicMock()
    mongodb.delete_all_collections = MagicMock()
    mongodb.read_latest_data_from_database = MagicMock()
    data_request.data_request_of_area = MagicMock()
    data_request.get_data_from_mmsi = MagicMock()
    authentication.get_token = MagicMock()


@pytest.mark.usefixtures("mock_dependencies")
# pylint: disable=unused-argument
def test_polling():
    """Test the polling function with mocked dependencies."""
    polling(num_iterations=1, sleep_time=0.1)


@pytest.mark.usefixtures("mock_dependencies")
# pylint: disable=unused-argument
def test_send_data_to_frontend():
    """Test the send_data_to_frontend function with mocked dependencies."""
    response = client.get("/sse")
    assert response.status_code == 200
    assert response.content_type == "text/event-stream"
