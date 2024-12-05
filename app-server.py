from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room
import random
import os
import sys

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

lobbies = {}
questions = [[[]]]

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
        if username not in lobbies[pin]["players"]:
            lobbies[pin]["players"].append(username)
        socketio.emit('update_player_list', {'players': lobbies[pin]["players"]}, room=pin)
        return jsonify({"message": f"{username} joined the game.", "players": lobbies[pin]["players"]})
    return jsonify({"error": "Invalid PIN or game already started"}), 400

@app.route('/get_custom_questions', methods=['POST'])
def get_custom_questions():
    pin = request.json.get('pin')
    questions = request.json.get('questions')
    if pin in lobbies:
        lobbies[pin]["started"] = True
        socketio.emit('start_custom_game', {'questions': questions}, room=pin)
        return jsonify({"question": questions})
    return jsonify({"error": "Lobby not found"}), 404
    
@app.route('/start_game_with_premade_questions', methods=['POST'])
def start_game_with_premade_questions():
    pin = request.json.get('pin')
    if pin in lobbies:
        lobbies[pin]["started"] = True
        socketio.emit('game_started', {'message': 'Game started with pre-made questions'}, room=pin)
        return jsonify({"message": "Game started with pre-made questions"})
    return jsonify({"error": "Lobby not found"}), 404

@socketio.on('join')
def on_join(data):
    pin = data['pin']
    join_room(pin)
    if pin in lobbies:
        emit('update_player_list', {'players': lobbies[pin]["players"]}, room=pin)

@socketio.on('next_question')
def next_question(data):
    pin = data['pin']
    current_question_index = data['currentQuestionIndex']
    
    emit('update_question_index', {'currentQuestionIndex': current_question_index}, room=pin)

if __name__ == '__main__':
    port = 5000

    if len(sys.argv) < 2:
        print("Error: Port number is required. Usage: python3 server.py <port>")
        sys.exit(1)

    try:
        port = int(sys.argv[1])
        print('The port you entered:', port)
    except ValueError:
        print("Error: Invalid port number. Port must be an integer.")
        sys.exit(1)

    # Run the server
    socketio.run(app, host="0.0.0.0", port=port)
