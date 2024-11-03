# Trivia Crack 

This is a multiplayer Trivia Crack game implemented using Flask (Python) for the backend and React with Socket.IO for real-time communication on the frontend. This version includes a game lobby, real-time updates, and a host-controlled question sequence.

## How to play:
1. **Start the server:** Run the `app-server.py` script.
2. **Connect clients:** In a seperate terminal, navigate to the src directoy and run the `npm install` and the `npm start`.
3. **Play the game:** The server has the questions. The clients will answer the questions from the server.
**How to play:**
1. **Start the server:** Run the `server.py` script.
2. **Connect clients:** Run the `client.py` script on two different machines or terminals.
3. **Clients prompted start:** Clients will be prompted with a username to join. After the username either have to click s to start or q to quit
4. **Client starts:** When the clicks s to start. They will be prompted with a question in which they have to enter a,b,c,d.
5. **Client incorrect or correct:** The client will be told whether they are incorrect or correct.
6. **Play the game:** The server has the questions. The clients will answer the questions from the server.

## Technologies used:

### Backend

**Flask:** Serves as the REST API for handling game logic and Socket.IO for real-time updates.

**Socket.IO:** Manages real-time communication between the server and clients for live question updates.

**Python Libraries:**
`flask`, `flask_socketio`, and `flask_cors`: Required for server functionality and cross-origin requests.

**csv:** Parses questions from a pre-made CSV file.

### Frontend

**React:** Used to create the client application, with individual views for the host and players.

**Socket.IO Client:** Handles real-time data updates from the server.

**Material-UI:** Provides pre-styled components for a clean and responsive user interface.

## Hardware:
**Server Requirements:** PC, laptop, or a Raspberry Pi to host the Flask server.

**Client Requirements:** Any device, such as a PC or laptop, with a web browser to connect to the React application.
  
## Software:
**Programming Languages**: Python (backend), JavaScript (frontend).

**Libraries**:
  - Flask (for REST API endpoints and game logic)
  - Flask-SocketIO (for real-time updates and WebSocket communication)
  - Flask-CORS (to allow cross-origin requests from frontend)
  - Socket.IO Client (for real-time data in the React frontend)
  - Material-UI (for UI components in React)
  - **Possibly**: `time` (for delays/timers if needed), `random` (for random question selection), `threading` (if managing multiple server tasks concurrently)
* **Version Control**: Git and GitHub for code management and version control.
* **Python Environment**: Ensure you have a Python environment to run the Flask server.
* **Operating Systems**: Cross-platform; can run on Windows, macOS, or Linux.

## Additional Resources:
* [Python Documentation](https://docs.python.org/3/)
* [Flask Documentation](https://flask.palletsprojects.com/)
* [Socket.IO Documentation](https://socket.io/docs/)
