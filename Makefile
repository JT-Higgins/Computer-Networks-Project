.PHONY: all server client clean

# Run the server
server:
	@echo "Starting server..."
	python3 app-server.py

# Run the client
client:
	@echo "Starting client..."
	cd kahoot-client && [ -d node_modules ] || npm install && npm start

# Clean up (if needed)
clean:
	@echo "Nothing to clean."
