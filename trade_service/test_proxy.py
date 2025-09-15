import requests
import json
from flask import Flask, redirect, render_template, url_for, request, Response
from werkzeug.middleware.proxy_fix import ProxyFix
from datetime import datetime
import os
from dotenv import load_dotenv
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


load_dotenv()
CLIENT_ID = os.getenv("APP_KEY")
REDIRECT_URI = os.getenv("APP_CALLBACK_URL")
AUTH_URL = os.getenv("APP_AUTH_URL")
TOKEN_URL = os.getenv("APP_TOKEN_URL")


@app.route('/')
def home():
    code = request.args.get("code")
    session = request.args.get("session")
    if code and session:
        auth(code, session)

    print(f"Code:{code}, Session: {session}")
    return render_template("./index.html")

@app.route('/check-auth')
def check_auth():
    if not os.path.isfile("token.json"):
        res = Response()
        res.headers["HX-Redirect"] = f"{AUTH_URL}?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}" 
        return res
    return "File Exists"

@app.route('/auth')
def auth(code, session):
    code = request.args.get("code")
    print("Auth Code: ", code)

    response = requests.post(
            TOKEN_URL,
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            data={
                "grant_type": "authorization_code",
                "code": code,
                "client_id": CLIENT_ID,
                "redirect_uri": REDIRECT_URI
                }
            )

    token_data = response.json()
    print("Access Token Reponse: ", token_data)
    try:
        with open("token.json", "w") as f:
            json.dump(token_data, f)
    except Exception as e:
        return f"Failed to write file: {e}"
    return "Authenticated"



@app.route('/debug')
def debug():
    info = {
            "remote_addr":request.remote_addr,
            "host": request.host,                    # Host from request
        "url": request.url,                      # Full URL
        "scheme": request.scheme,                # http or https
        "forwarded_for": request.headers.get("X-Forwarded-For"),
        "forwarded_proto": request.headers.get("X-Forwarded-Proto")
            }
    return f"{info}"

@app.route("/fragment")
def fragment():
    return render_template("partial.html", time=datetime.now().strftime("%H:%M:%S"))

@app.route("/click_to_edit")
def click_to_edit():
    return render_template("click_to_edit.html")

@app.route('/callback')
def callback():
    return redirect(url_for("home", _external=True))


### Main Function, creates the app thread to listen for 
if __name__ == '__main__':
    print(f'Client: {CLIENT_ID}, Redirect: {REDIRECT_URI}, Auth: {AUTH_URL}, Token: {TOKEN_URL}')
    app.run(host='127.0.0.1', port=5000, debug=True)
    app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)
