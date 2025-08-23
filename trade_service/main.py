# server app

import os
import requests
from dotenv import load_dotenv
from flask import Flask, redirect, request, render_template
from flask_cors import CORS

def create_flask_app():
    app = Flask(__name__)
    return app

app = create_flask_app()
CORS(app)

load_dotenv()
CLIENT_ID = os.getenv("APP_KEY")
REDIRECT_URI = os.getenv("APP_CALLBACK_URL")
AUTH_URL = os.getenv("APP_AUTH_URL")
TOKEN_URL = os.getenv("APP_TOKEN_URL")

@app.route('/')
def home():
    return redirect(f"{AUTH_URL}?response_type=code&client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}")

"""https://api.schwabapi.com/v1/oauth/authorize?response_type=code&client_id=fnB6k1X6JSFlQHravRt6T9m86AZlkD04&scope=readonly&redirect_uri=https://developer.schwab.com/oauth2-redirect.html"""
"https://127.0.0.1:5000/callback?code=C0.b2F1dGgyLmJkYy5zY2h3YWIuY29t.ABqA0Ijg2o_2SrFTwHis_xaR4sgaf2tvSFFB4q5WLJU%40&session=0fee6b9a-fff2-4d81-a856-eb045399c1bc"

@app.route("/callback")
def callback():
    code = request.args.get("code")
    print("Auth Code: ", code)

    response = requests.post(
            TOKEN_URL,
            headers={"Content-Type": "application/x-www-from-urlencoded"},
            data={
                "grant_type": "authorization_code",
                "code": code,
                "client_id": CLIENT_ID,
                "redirect_uri": REDIRECT_URI
                }
            )

    token_data = response.json()
    print("Access Token Reponse: ", token_data)

    return "Authentication Complete, Check Console"

if __name__ == "__main__":
    print(f'Client: {CLIENT_ID}, Redirect: {REDIRECT_URI}, Auth: {AUTH_URL}, Token: {TOKEN_URL}')
    app.run(port=5000,debug=True)
