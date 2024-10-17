import sys
import socket
import selectors

sel = selectors.DefaultSelector()

def start_connection(host, port):
    addr=(host,port)
    sock = socket.socket(socket.AF_INET,socket.SOCK_STREAM)
    sock.setblocking(False)
    sock.connect_ex(addr)
    events = selectors.EVENT_READ | selectors.EVENT_WRITE
    sel.register(sock, events, data={"addr": addr, "outgoing": None, "sent_username": False})

def close_connection():
    sock.close()
    sys.exit(1)

def game_action(input1):
    if input1.lower() == 'q':
        close_connection()
    elif input1.lower() == 's':
        print('starting game')
        sock.sendall(input1.encode('utf-8'))
    else:
        print('Re enter the your input')
        game_action(input("Client: ")) 
        
def handle_connection(sock, data, username):
    if not data["sent_username"]:
        sock.sendall(username.encode('utf-8'))
        data["sent_username"] = True
    else:
        try:
            response = sock.recv(1024).decode('utf-8')
            if response:
                print(response)
        except BlockingIOError:
            pass

if len(sys.argv) != 3:
    print("usage:", sys.argv[0], "<host> <port> ")
    sys.exit(1)

#sets up connection
host, port = sys.argv[1], int(sys.argv[2])
start_connection(host, port)

username = input("What do you want your username to be? ")

try:
    while True:
        events = sel.select(timeout=None)
        for key, mask in events:
            sock = key.fileobj
            data = key.data
            if mask & selectors.EVENT_WRITE:
                handle_connection(sock, data, username )
            if mask & selectors.EVENT_READ:
                handle_connection(sock, data, username)
                game_action(input("Client: "))
except KeyboardInterrupt:
    print("Caught keyboard interrupt, exiting")
finally:
    print('close')
    sel.close()