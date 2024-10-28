from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/hello', methods=['GET'])
def hello_world():
        return jsonify(message="Hello, Azure Functions!")

if __name__ == "__main__":
        app.run()