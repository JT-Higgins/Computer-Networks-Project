import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import { socket } from './GameRoom';
import { useNavigate } from 'react-router-dom';

const PlayerView = ({ question, gamePin, playerName }) => {
  const [feedback, setFeedback] = useState("")
  const [player, setPlayer] = useState({ name: playerName, score: 0 })
  const [gameOver, setGameOver] = useState(false)
  const [finalScores, setFinalScores] = useState([])
  const [selected, setSelected] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    setFeedback("")
    setSelected(false)
  }, [question]);

  const handleLeaveGame = () => {
    //console.log("Emitting leave_game with:", { pin: gamePin, username: playerName });
    socket.emit('leave_game', { pin: gamePin, username: playerName });
    navigate('/')
  };
  

  useEffect(() => {
    socket.on('game_over', (scores) => {
      if (Array.isArray(scores)) {
        setFinalScores(scores);
      } else {
        console.error('Invalid scores data:', scores);
      }
      setGameOver(true);
    });
  }, []);

  // Updates score on the server side
  const handleAnswer = (option) => {
    if (selected) return;
    setSelected(true);
    if (option === question.correctAnswer) {
      setFeedback("Correct!");
      socket.emit('update_score', { pin: gamePin, username: player.name, points: 10 });
    } else {
      setFeedback("Incorrect!");
      socket.emit('update_score', { pin: gamePin, username: player.name, points: 0 });
    }
  };

  if (!question) {
    return <Typography variant="h6" color="error">Loading question...</Typography>;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '300px',
        padding: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: '8px',
        color: 'white',
      }}
    >
      <Typography variant="h6" mb={3}>{question.question}</Typography>

      <Stack spacing={2} alignItems="center" width="100%">
        {question.options.map((option, index) => (
          <Button
            key={index}
            variant="contained"
            onClick={() => handleAnswer(option)}
            fullWidth
            disabled={selected}
          >
            {option}
          </Button>
        ))}
      </Stack>

      {feedback && <Typography variant="h6" sx={{ mt: 2 }}>{feedback}</Typography>}
      <Button
        variant="contained"
        color="error"
        onClick={handleLeaveGame}
        fullWidth
        sx={{ mt: 2 }}
      >
        Leave Game
      </Button>
    </Box>
  );
};

export default PlayerView;