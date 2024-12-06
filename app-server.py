from flask import Flask, request, jsonify
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


@socketio.on('update_score')
def update_score(data):
    pin = data['pin']
    username = data['username']
    points = data['points']
    if pin in lobbies:
        lobbies[pin]["scores"].setdefault(username, 0)
        lobbies[pin]["scores"][username] += points
        socketio.emit('update_scores', {'scores': lobbies[pin]["scores"]}, room=pin)

@app.route('/start_game_with_premade_questions', methods=['POST'])
def start_game_with_premade_questions():
    pin = request.json.get('pin')
    if pin in lobbies:
        lobbies[pin]["started"] = True
        socketio.emit('game_started', {'message': 'Game started with pre-made questions'}, room=pin)
        return jsonify({"message": "Game started with pre-made questions"})
    return jsonify({"error": "Lobby not found"}), 404

@socketio.on('game_over')
def handle_game_over(data):
    pin = data['pin']
    if pin in lobbies:
        # Fetch scores and emit the game_over event with final scores
        final_scores = [{"name": name, "score": score} for name, score in lobbies[pin]["scores"].items()]
        socketio.emit('game_over', final_scores, room=pin)

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
        handle_game_over({'pin': pin})
    else:
        emit('update_question_index', {'currentQuestionIndex': current_question_index}, room=pin)
        
@socketio.on('start_game_with_custom_question')
def show_custom_questions(data):
    pin = data['pin']
    custom_questions = data['question']  # Need to reference question as: 'question'
    if pin in lobbies:
        # instead of lbbies[pin][questions], we need the quotation marks in there with questions. Had the right idea though
        lobbies[pin]["questions"] = custom_questions
        # We dont have to start in the gameroom, instead we can set start to true here since it is strored in the lobby dictionary
        lobbies[pin]["started"] = True
        # send the message to the clients that the game has started with the custome questions
        socketio.emit('game_started', {'message': 'Game started with custom questions'}, room=pin)
        # send the questions
        socketio.emit('start_game_with_custom_questions', {'questions': custom_questions}, room=pin)

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
    
