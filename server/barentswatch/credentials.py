"""
This module reads API credentials from a file and creates
a configuration dictionary for connecting to the AIS API.
"""

import os

print(os.getcwd())  # Print current working directory

# Configuration dictionary for connecting to AIS API
config = {}

# Read credentials from file
with open(os.path.join(os.path.dirname(__file__), 'credentials.txt'), 'r') as f:
    for line in f:
        key, value = line.strip().split('=')
        config[key] = value

# Ensure all required keys are present in the config dictionary
required_keys = ['client_id', 'client_secret', 'token_url', 'api_base_url', 'api_historic_base_url']
for key in required_keys:
    if key not in config:
        raise ValueError(f"Missing required key {key} in credentials file")
