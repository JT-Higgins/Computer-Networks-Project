import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import { socket } from './GameRoom';
import { useNavigate } from 'react-router-dom';

const PlayerView = ({ question, gamePin, playerName }) => {
  const [feedback, setFeedback] = useState("");
  const [selected, setSelected] = useState(false);
  const [finalScores, setFinalScores] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setFeedback("");
    setSelected(false);
  }, [question]);

  const handleAnswer = (option) => {
    if (selected) return;
    setSelected(true);
    const isCorrect = option === question.correctAnswer;
    setFeedback(isCorrect ? "Correct!" : "Incorrect!");
    socket.emit('update_score', { pin: gamePin, username: playerName, points: isCorrect ? 10 : 0 });
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

    return () => {
      socket.off('game_over');
    };
  }, []);

  const handleLeaveGame = () => {
    socket.emit('leave_game', { pin: gamePin, username: playerName });
    navigate('/');
  };

  if (gameOver) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="h4" mb={3}>Game Over</Typography>
        <Typography variant="h6" mb={2}>Final Scores:</Typography>
        <Stack spacing={2}>
          {finalScores.map((player, index) => (
            <Typography key={index}>
              {player.name}: {player.score}
            </Typography>
          ))}
        </Stack>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/')}
          sx={{ mt: 3 }}
        >
          Back to Home
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '30px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: '12px',
        color: 'white',
        maxWidth: '600px',
        width: '90%',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography variant="h6" mb={3} textAlign="center">
        {question.question}
      </Typography>

      <Stack spacing={2} width="100%">
        {question.options.map((option, index) => (
          <Button
            key={index}
            variant="contained"
            onClick={() => handleAnswer(option)}
            disabled={selected}
          >
            {option}
          </Button>
        ))}
      </Stack>

      {feedback && (
        <Typography variant="h6" mt={3} textAlign="center">
          {feedback}
        </Typography>
      )}

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