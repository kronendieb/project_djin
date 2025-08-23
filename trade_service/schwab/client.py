import requests

from .tokens import Tokens

class Client:
    def __init__(self, use_session=True):
        # The http request session, this will connect to the server to make requests.
        self.session = requests.Session() if use_session else requests
        self.token = Tokens()
