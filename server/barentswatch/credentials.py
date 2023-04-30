import os


def get_secret_from_file(key, fallback=None):
    this_dir = os.path.dirname(os.path.abspath(__file__))
    secrets_file = os.path.join(this_dir, 'secrets.txt')
    if os.path.exists(secrets_file):
        with open(secrets_file) as f:
            secrets = dict(line.strip().split('=', 1) for line in f if line.strip())
        return secrets.get(key, fallback)
    return fallback


config = {
    'client_id': 'andrgart@stud.ntnu.no:ais-api-client',
    'client_secret': get_secret_from_file('client_secret', os.environ.get('CLIENT_SECRET')),
    'token_url': 'https://id.barentswatch.no/connect/token',
    'api_base_url': 'https://live.ais.barentswatch.no',
    'api_historic_base_url': 'https://historic.ais.barentswatch.no'
}
