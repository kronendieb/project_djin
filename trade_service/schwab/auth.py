from dotenv import load_dotenv
import os

class Authorization:

    def __init__(self) -> None:
        pass

    def get_refresh_token(self):
        # Get the new access and refresh tokens using the authorization code

        load_dotenv()

        api_key = os.getenv("APP_KEY")
        redirect_url = os.getenv("APP_CALLBACK_URL")

        auth_url = f'https://api.schwabapi.com/v1/oauth/authorize?client_id={api_key}&redirect_uri={redirect_url}'
        print(f'Schwab Auth, open to authenticate: {auth_url}')

        response_url = input("Schwab Auth, paste the url to obtain keys: ")
        key_code = f"{response_url[response_url.index('code=') + 5:response_url.index('%40')]}@"
        
