"""
This module retrieves an authentication token from the BarentsWatch API using
client ID and secret from the 'barentswatch.credentials' module. The token is
used for authenticating further API requests.
"""

import requests
from barentswatch import credentials


def get_token():
    """
    Obtain an authentication token from the BarentsWatch API using the client ID and client secret.
    """
    # Validate the presence of client_id and client_secret in the configuration.
    if not credentials.config['client_id']:
        raise ValueError('client_id must be set in credentials.py')

    if not credentials.config['client_secret']:
        raise ValueError('client_secret must be set in credentials.py')

    # Makes the API request to retrieve the token.
    req = requests.post(credentials.config['token_url'],
                        data={
                            'grant_type': 'client_credentials',
                            'client_id': credentials.config['client_id'],
                            'client_secret': credentials.config['client_secret'],
                            'scope': 'ais'
                        },
                        headers={'content-type': 'application/x-www-form-urlencoded'})

    # Raises an error if the request was unsuccessful.
    req.raise_for_status()

    return req.json()


# # Main method for validation testing of the authentication.
if __name__ == "__main__":
    print(f"Requesting token from {credentials.config['token_url']}, "
          f"using client_id {credentials.config['client_id']}.")

    token = get_token()
    print(token)
