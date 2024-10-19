import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:5000');  // Connect to the WebSocket server

const GameRoom = () => {
  const { pin } = useParams();  // Get the game PIN from the URL
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    // Join the game room (Socket.IO)
    socket.emit('join', { pin });

    // Fetch the initial list of players when the component loads
    const fetchPlayers = async () => {
      try {
        const response = await axios.post('http://localhost:5000/join_game', { pin });
        setPlayers(response.data.players);
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };
    fetchPlayers();

    // Listen for 'player_joined' events from the server
    socket.on('player_joined', (data) => {
      setPlayers(data.players);  // Update the list of players when someone joins
    });

    // Cleanup the socket connection when the component unmounts
    return () => {
      socket.off('player_joined');
      socket.disconnect();
    };
  }, [pin]);

  return (
    <Box textAlign="center" mt={5}>
      <Typography variant="h4">Game PIN: {pin}</Typography>
      <Typography variant="h5">Players in the Lobby:</Typography>
      {players.length > 0 ? (
        players.map((player, index) => (
          <Typography key={index}>{player}</Typography>
        ))
      ) : (
        <Typography>No players yet...</Typography>
      )}
    </Box>
  );
};

export default GameRoom;