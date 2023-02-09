import requests
from api.credentials import config


# Obtains an authentication token from the API using the client ID and client secret.
def get_token():

    # Validate the presence of client_id and client_secret in the configuration.
    if not config['client_id']:
        raise ValueError('client_id must be set in credentials.py')

    if not config['client_secret']:
        raise ValueError('client_secret must be set in credentials.py')

    # Makes the API request to retrieve the token.
    req = requests.post(config['token_url'],
                        data={
                            'grant_type': 'client_credentials',
                            'client_id': config['client_id'],
                            'client_secret': config['client_secret'],
                            'scope': 'ais'
                        },
                        headers={'content-type': 'application/x-www-form-urlencoded'})

    # Raises an error if the request was unsuccessful.
    req.raise_for_status()

    # Prints a success message and return the JSON response
    print('Token request successful')
    return req.json()


# # Main method for validation testing of the authentication.
if __name__ == "__main__":
    print(f"Requesting token from {config['token_url']}, using client_id {config['client_id']}.")
    token = get_token()
    print(token)
