from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room
import random

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

lobbies = {}

@app.route('/create_game', methods=['POST'])
def create_game():
    pin = str(random.randint(1000, 9999))
    lobbies[pin] = {"players": [], "started": False}
    return jsonify({"pin": pin})

@app.route('/join_game', methods=['POST'])
def join_game():
    pin = request.json.get('pin')
    username = request.json.get('username')
    if pin in lobbies and not lobbies[pin]["started"]:
        lobbies[pin]["players"].append(username)
        socketio.emit('player_joined', {'players': lobbies[pin]["players"]}, room=pin)
        return jsonify({"message": f"{username} joined the game.", "players": lobbies[pin]["players"]})
    return jsonify({"error": "Invalid PIN or game already started"}), 400

@socketio.on('join')
def on_join(data):
    pin = data['pin']
    join_room(pin)

if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0", port=5000)