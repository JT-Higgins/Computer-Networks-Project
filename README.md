# Trivia Crack 

This is a multiplayer Trivia Crack game implemented using Flask (Python) for the backend and React with Socket.IO for real-time communication on the frontend. This version includes a game lobby, real-time updates, and a host-controlled question sequence.

## How to play:
1. **Install the required libraries** Run `pip install -r requirements.txt` in your terminal (pip version 21.3.1 should work on requirements.txt, if running pip 9.0.3 like was installed on my ssh machine, consider using requirements_v2.txt. Versions of the modules in requirements.txt and requirements_v2.txt are dependent on pip version)
2. **Import npm modules:** npm install, npm install socket.io-client (do this inside of the kahoot-client directory)
2. **Start the server:** python3 app-server.py <port>
3. **Connect clients:** npm start <server_ip> <port>
4. **Play the game:** The server has the questions. The clients will answer the questions from the server.

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
