import requests
from api.credentials import config


# retrieves an access token from a token URL using client credentials.
def get_token():
    if not config['client_id']:
        raise ValueError('client_id must be set in credentials.py')

    if not config['client_secret']:
        raise ValueError('client_secret must be set in credentials.py')

    # makes the request
    req = requests.post(config['token_url'],
                        data={
                            'grant_type': 'client_credentials',
                            'client_id': config['client_id'],
                            'client_secret': config['client_secret'],
                            'scope': 'ais'
                        },
                        headers={'content-type': 'application/x-www-form-urlencoded'})

    req.raise_for_status()
    print('Token request successful')
    return req.json()


# main method for validation testing the authentication
if __name__ == "__main__":
    print(f"Requesting token from {config['token_url']}, using client_id {config['client_id']}.")
    token = get_token()
    print(token)
