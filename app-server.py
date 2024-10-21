import sys
import socket
import selectors

sel = selectors.DefaultSelector()
lobby = {}

def accept_connection(sock):
    conn, addr = sock.accept()
    print(f"Accepted connection from {addr}")
    conn.setblocking(False)
    sel.register(conn, selectors.EVENT_READ, data=addr)

def handle_client(conn, addr):
    try:
        data = conn.recv(1024).decode('utf-8')
        if data:
            if addr not in lobby:
                lobby[addr] = data.strip()
                print(f"{lobby[addr]} has joined the lobby.")
                conn.sendall(f"----- Lobby -----\n".encode('utf-8'))
                conn.sendall(f"Welcome {lobby[addr]}!\n".encode('utf-8'))
                conn.sendall("Press 's' to start the game.\n".encode('utf-8'))
                conn.sendall("Press 'q' to quit.\n".encode('utf-8'))
            else:
                if data.strip().lower() == 's':
                    print(f"{lobby[addr]} has started the game.")
                    conn.sendall("Game started!\n".encode('utf-8'))
                    game_in_progress(conn, addr)
                elif data.strip().lower() == 'q':
                    print(f"{lobby[addr]} has quit.")
                    sel.unregister(conn)
                    conn.close()
                    del lobby[addr]
                else:
                    print(f"Message from {lobby[addr]}: {data.strip()}")
                    conn.sendall(f"Server received: {data.strip()}\n".encode('utf-8'))
        else:
            disconnect_client(conn, addr)
    except Exception as e:
        print(f"Error: {e}")
        disconnect_client(conn, addr)

def game_in_progress(conn, addr):
    try:
        while True:
            data = conn.recv(1024).decode('utf-8')
            if data:
                print(f"Game message from {lobby[addr]}: {data.strip()}")
                conn.sendall(f"Server: {data.strip()}\n".encode('utf-8'))
            else:
                break
    except Exception as e:
        print(f"Game error: {e}")
    finally:
        disconnect_client(conn, addr)

def disconnect_client(conn, addr):
    print(f"Closing connection to {addr}")
    sel.unregister(conn)
    conn.close()
    if addr in lobby:
        print(f"{lobby[addr]} has left the lobby.")
        del lobby[addr]

if len(sys.argv) != 3:
    print("Usage:", sys.argv[0], "<host> <port>")
    sys.exit(1)

host, port = sys.argv[1], int(sys.argv[2])
lsock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
lsock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
lsock.bind((host, port))
lsock.listen()
print(f"Listening on {host}:{port}")
lsock.setblocking(False)
sel.register(lsock, selectors.EVENT_READ, data=None)

try:
    while True:
        events = sel.select(timeout=None)
        for key, mask in events:
            if key.data is None:
                accept_connection(key.fileobj)
            else:
                handle_client(key.fileobj, key.data)
except KeyboardInterrupt:
    print("Caught keyboard interrupt, exiting")
finally:
    sel.close()
