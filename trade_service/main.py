# server app

from flask import Flask
from flask_cors import CORS

def run():
    print("run")
    return 0

def create_flask_app():
    app = Flask(__name__)
    return app

app = create_flask_app()
CORS(app)

@app.route('/')
def home():
    return "<h1>Hello World</h1>"

if __name__ == "__main__":
    run()
    app.run(debug=True)
