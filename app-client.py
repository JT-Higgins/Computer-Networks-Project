import sys
import socket
import selectors
import traceback

sel = selectors.DefaultSelector()

#This is the code that starts the connection with server
def start_connection(host, port):
    addr=(host,port)
    sock = socket.socket(socket.AF_INET,socket.SOCK_STREAM)
    sock.setblocking(False)
    sock.connect_ex(addr)
    events = selectors.EVENT_READ | selectors.EVENT_WRITE
    sel.register(sock, events)

#This is error check to make sure there are two arguments going in the client request
if len(sys.argv) != 3:
    print("usage:", sys.argv[0], "<host> <port> ")
    sys.exit(1)

#sets up connection
host, port = sys.argv[1], int(sys.argv[2])
start_connection(host, port)

#instantly closes the connection cause we dont have arguments to pass back and forth
sel.close()