import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Box, Typography } from '@mui/material';
import axios from 'axios';
import BackgroundImage from './assets/Background-Image.jpg';

const Lobby = () => {
  const [pin, setPin] = useState('');
  const [username, setUsername] = useState('');
  const [gamePin, setGamePin] = useState(null);
  const navigate = useNavigate();

  const handleCreateGame = async () => {
    try {
      const response = await axios.post('http://localhost:5000/create_game');
      console.log(response)
      const gamePin = response.data.pin; 
      setGamePin(gamePin);
      navigate(`/game/${gamePin}`);
    } catch (error) {
      console.error("Error creating game:", error);
    }
  };

  const handleJoinGame = async () => {
    try {
      const response = await axios.post('http://localhost:5000/join_game', { pin, username });
      navigate(`/game/${pin}`);
    } catch (error) {
      alert('Error joining game: ' + error.response.data.error);
    }
  };

  return (
    <Box
      style={{
        backgroundImage: `url(${BackgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '300px',
          padding: '20px',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          borderRadius: '8px',
        }}
      >
        <Typography variant="h4" mb={3}>Kahoot Lobby</Typography>

        <TextField
          label="Enter Game PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          fullWidth
          margin="normal"
          variant="outlined"
          InputProps={{
            style: { color: 'white' },
          }}
          InputLabelProps={{
            style: { color: 'white' },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'white',
              },
              '&:hover fieldset': {
                borderColor: 'white',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'white',
              },
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        />

        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          margin="normal"
          variant="outlined"
          InputProps={{
            style: { color: 'white' },
          }}
          InputLabelProps={{
            style: { color: 'white' },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'white',
              },
              '&:hover fieldset': {
                borderColor: 'white',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'white',
              },
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        />

        <Button
          variant="contained"
          onClick={handleJoinGame}
          fullWidth
          sx={{ mt: 2 }}
        >
          Join Game
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateGame}
          fullWidth
          sx={{ mt: 2 }}
        >
          Create Game
        </Button>

        {gamePin && (
          <Typography variant="h6" sx={{ mt: 2 }}>
            Your game PIN: {gamePin}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Lobby;