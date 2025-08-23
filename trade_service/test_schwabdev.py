import schwabdev
import os
from dotenv import load_dotenv

load_dotenv()
CLIENT_ID = os.getenv("APP_KEY")
CLIENT_SECRET = os.getenv("APP_SECRET")
REDIRECT_URI = os.getenv("APP_CALLBACK_URL")
AUTH_URL = os.getenv("APP_AUTH_URL")
TOKEN_URL = os.getenv("APP_TOKEN_URL")


client = schwabdev.Client(CLIENT_ID, CLIENT_SECRET, callback_url=REDIRECT_URI)

print(client.account_linked().json)
