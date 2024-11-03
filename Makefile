.PHONY: all server client clean

# Define the host and port variables
HOST = localhost
PORT = 8080

# Default target
all: server

# Run the server
server:
	python3 app-server.py $(HOST) $(PORT)

# Run the client
client:
	python3 app-client.py $(HOST) $(PORT)

# Clean up (if needed)
clean:
	@echo "Nothing to clean."
