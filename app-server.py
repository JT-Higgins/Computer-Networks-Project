import eventlet
eventlet.monkey_patch()

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room
import random
import os
import sys

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

lobbies = {}
custom_questions = [[[]]]

@app.route('/create_game', methods=['POST'])
def create_game():
    pin = str(random.randint(1000, 9999))
    lobbies[pin] = {  # Updated lobbies to allow for score tracking
        "players": [],
        "started": False,
        "scores": {}
    }
    print('New game created with pin:', pin)
    return jsonify({"pin": pin})

@app.route('/join_game', methods=['POST'])
def join_game():
    pin = request.json.get('pin')
    username = request.json.get('username')
    if pin in lobbies and not lobbies[pin]["started"]:
        if username not in lobbies[pin]["players"]:
            lobbies[pin]["players"].append(username)
            print(f'{username} has joined the lobby for game {pin}')
        socketio.emit('update_player_list', {'players': lobbies[pin]["players"]}, room=pin)
        return jsonify({"message": f"{username} joined the game.", "players": lobbies[pin]["players"]})
    return jsonify({"error": "Invalid PIN or game already started"}), 400


@socketio.on('update_score')
def update_score(data):
    pin = data['pin']
    username = data['username']
    points = data['points']
    if pin in lobbies:
        lobbies[pin]["scores"].setdefault(username, 0)
        lobbies[pin]["scores"][username] += points
        socketio.emit('update_scores', {'scores': lobbies[pin]["scores"]}, room=pin)

@socketio.on('game_over')
def handle_game_over(data):
    pin = data['pin']
    if pin in lobbies:
        final_scores = [{"name": name, "score": score} for name, score in lobbies[pin]["scores"].items()]
        socketio.emit('game_over', final_scores, room=pin)

@socketio.on('leave_game')
def handle_leave_game(data):
    pin = data['pin']
    username = data['username']

    room_members = socketio.server.manager.get_participants('/', pin)
    print(f"Room members before removal: {list(room_members)}")

    if pin in lobbies:
        if username in lobbies[pin]["players"]:
            lobbies[pin]["players"].remove(username)

        if username in lobbies[pin]["scores"]:
            del lobbies[pin]["scores"][username]

        print(f"Updated player list for PIN {pin}: {lobbies[pin]['players']}")

        socketio.emit('update_player_list', {'players': lobbies[pin]["players"]}, room=pin)

        print(f"{username} left the game with PIN: {pin}")

@app.route('/start_game_with_premade_questions', methods=['POST'])
def start_game_with_premade_questions():
    pin = request.json.get('pin')
    if pin in lobbies:
        lobbies[pin]["started"] = True

        random_file = f"{random.randint(1, 10)}.csv"
        lobbies[pin]["question_file"] = random_file
        print(f"Selected file for game {pin}: {random_file}")
        socketio.emit('game_started', {'file': random_file}, room=pin)
        return jsonify({"message": "Game started with pre-made questions", "file": random_file})
    return jsonify({"error": "Lobby not found"}), 404


@app.route('/questions/<filename>', methods=['GET'])
def get_question_file(filename):
    questions_dir = os.path.join(os.path.dirname(__file__), 'questions')
    # print(f"Serving files from directory: {questions_dir}")
    file_path = os.path.join(questions_dir, filename)

    if os.path.exists(file_path):
        return send_from_directory(questions_dir, filename)
    else:
        print(f"File not found: {file_path}")
        return "File not found", 404


@socketio.on('host_quit')
def handle_host_quit(data):
    pin = data['pin']

    if pin in lobbies:
        socketio.emit('host_left', {'message': 'The host has left the game.'}, room=pin)
        # eventlet.sleep(0.1)
        del lobbies[pin]
        print(f"Lobby with PIN {pin} has been closed because the host quit.")



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
    questions_length = data.get('questionsLength')
    if current_question_index >= questions_length:
        emit('game_over', {'message': 'No more questions!'}, room=pin)
        handle_game_over({'pin': pin})  # Trigger game over
    else:
        emit('update_question_index', {'currentQuestionIndex': current_question_index}, room=pin)
        
# @socketio.on('start_game_with_custom_question')
# def show_custom_questions(data):
#     pin = data['pin']
#     custom_questions = data[question]
#     if pin in lobbies:
#         socketio.emit('start_game_with_custom_questions', {'questions': custom_questions}, room=pin)

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
    