import sys
import socket
import selectors

sel = selectors.DefaultSelector()

def start_connection(host, port):
    addr = (host, port)
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.setblocking(False)
    sock.connect_ex(addr)
    sel.register(sock, selectors.EVENT_READ | selectors.EVENT_WRITE, data={"sent_username": False, "sent_start_game": False})
    return sock

def close_connection(sock):
    sel.unregister(sock)
    sock.close()
    sys.exit(1)

def wait_for_question(sock):
    question = sock.recv(1024).decode('utf-8')
    while(question[len(question)-7:len(question)-1] == "lobby."):
        if(question[len(question)-7:len(question)-1] == "lobby."):
            print(f"Sever: {question}")
        question = sock.recv(1024).decode('utf-8')
    return question


def game_action(sock, data):
    while True:
        if not data["sent_start_game"]:
            # Prompt for user input to start the game
            input1 = input("Client: ")
            if input1.lower() == 'q':
                print("Quitting game.")
                sock.sendall(input1.encode('utf-8'))
                False
                key.data = 1
                break
            elif input1.lower() == 's':
                print("Starting game")
                data["sent_start_game"] = True
                sock.sendall(input1.encode('utf-8'))
            else:
                print("Invalid input. Press 's' to start the game or 'q' to quit.")
        else:
            # Handle game communication
            while True:
                try:

                    question = wait_for_question(sock)
                    print(f"Sever: {question} ")  
                    input_msg = input("Player: ")
                    if input_msg == 'a' or input_msg == 'b' or input_msg == 'c' or input_msg == 'd':
                        sock.sendall(input_msg.encode('utf-8'))
                    elif input_msg == 'q':
                        print("Quitting Game!")
                        sock.sendall(input_msg.encode('utf-8'))
                        False
                        key.data = 1
                        break
                    else:
                        print("Invalid answer! Please enter a, b, c, d, or q to quit")
                        input_msg = input("Player: ")
                        sock.sendall(input_msg.encode('utf-8'))
                    response = wait_for_question(sock)
                    print(f"Sever: {response}")
                except BlockingIOError:
                    pass

def handle_connection(sock, data, username):
    if not data["sent_username"]:
        sock.sendall(username.encode('utf-8'))
        data["sent_username"] = True
    else:
        try:
            response = sock.recv(1024).decode('utf-8')
            if response:
                print(response.strip())
                if "Press 'q' to quit." in response:
                    game_action(sock, data)
        except BlockingIOError:
            pass

if len(sys.argv) != 3:
    print("Usage:", sys.argv[0], "<host> <port>")
    sys.exit(1)

host, port = sys.argv[1], int(sys.argv[2])
sock = start_connection(host, port)

username = input("Enter your username: ")

try:
    while True:
        events = sel.select(timeout=None)
        for key, mask in events:
            if key.data is not None:
                handle_connection(sock, key.data, username)
except KeyboardInterrupt:
    print("Caught keyboard interrupt, exiting")
finally:
    close_connection(sock)
