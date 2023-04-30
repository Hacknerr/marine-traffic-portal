"""
This module provides a function for retrieving secrets from a file and a configuration dictionary.
"""
import os


def get_secret_from_file(key, fallback=None):
    """
    This function retrieves a secret value from a file named 'secrets.txt'
    located in the same directory as the calling module.
    """
    this_dir = os.path.dirname(os.path.abspath(__file__))
    secrets_file = os.path.join(this_dir, 'secrets.txt')
    if os.path.exists(secrets_file):
        with open(secrets_file) as file_handle:
            secrets = dict(line.strip().split('=', 1) for line in file_handle if line.strip())
        return secrets.get(key, fallback)
    return fallback


config = {
    'client_id': 'andrgart@stud.ntnu.no:ais-api-client',
    'client_secret': get_secret_from_file('client_secret', os.environ.get('CLIENT_SECRET')),
    'token_url': 'https://id.barentswatch.no/connect/token',
    'api_base_url': 'https://live.ais.barentswatch.no',
    'api_historic_base_url': 'https://historic.ais.barentswatch.no'
}
