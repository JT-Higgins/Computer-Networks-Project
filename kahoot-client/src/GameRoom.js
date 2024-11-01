import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Box, Typography, Stack, Button } from '@mui/material';
import io from 'socket.io-client';
import axios from 'axios';
import BackgroundImage from './assets/Background-Image.jpg';
import HostView from './HostView';
import PlayerView from './PlayerView';

const socket = io('http://localhost:5000', {
  transports: ['websocket', 'polling'],
});

const GameRoom = () => {
  const { pin } = useParams();
  const location = useLocation();
  const { isCreator, username } = location.state || {};
  const [players, setPlayers] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    socket.emit('join', { pin });

    const fetchPlayers = async () => {
      try {
        const response = await axios.post('http://localhost:5000/join_game', { pin, username });
        setPlayers(response.data.players);
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };
    fetchPlayers();

    socket.on('update_player_list', (data) => {
      setPlayers(data.players);
    });

    socket.on('game_started', () => {
      setGameStarted(true);
      loadQuestions();
    });

    socket.on('update_question_index', (data) => {
      setCurrentQuestionIndex(data.currentQuestionIndex);
    });

    return () => {
      socket.off('update_player_list');
      socket.off('game_started');
      socket.off('update_question_index');
      socket.disconnect();
    };
  }, [pin, username]);

  const loadQuestions = async () => {
    try {
      const response = await fetch('/questions/example.csv');
      const csvData = await response.text();
  
      const parsedQuestions = csvData.split('\n').slice(1).map((line, index) => {
        const [question, option1, option2, option3, option4, correctAnswer] = line.split(',');
  
        return {
          question: String(question || "").replace(/^["\s]+|["\s]+$/g, ''),
          options: [
            String(option1 || "").replace(/^["\s]+|["\s]+$/g, ''),
            String(option2 || "").replace(/^["\s]+|["\s]+$/g, ''),
            String(option3 || "").replace(/^["\s]+|["\s]+$/g, ''),
            String(option4 || "").replace(/^["\s]+|["\s]+$/g, '')
          ],
          correctAnswer: String(correctAnswer || "").replace(/^["\s]+|["\s]+$/g, ''),
        };
      });
  
      console.log("Parsed Questions Array:", parsedQuestions);
      setQuestions(parsedQuestions);
    } catch (error) {
      console.error('Error loading questions:', error);
    }
  };   

  const startGameWithPremadeQuestions = async () => {
    try {
      const response = await axios.post('http://localhost:5000/start_game_with_premade_questions', { pin });
      console.log(response.data);
  
      setGameStarted(true);
      loadQuestions();
    } catch (error) {
      console.error("Error starting game with pre-made questions:", error);
    }
  };   

  const handleNextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex);
      socket.emit('next_question', { pin, currentQuestionIndex: nextIndex });
    } else {
      alert("No more questions!");
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
          justifyContent: 'center',
          width: '300px',
          padding: '20px',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          borderRadius: '8px',
          color: 'white',
        }}
      >
        <Typography variant="h4" mb={3}>Game PIN: {pin}</Typography>
        <Typography variant="h5" mb={3}>Players in the Lobby:</Typography>

        <Stack spacing={2} alignItems="center" width="100%">
          {players.length > 0 ? (
            players.map((player, index) => (
              <Typography key={index}>{player}</Typography>
            ))
          ) : (
            <Typography>No players yet...</Typography>
          )}
        </Stack>

        {isCreator && !gameStarted && (
          <Box mt={3} width="100%">
            <Button variant="contained" color="primary" fullWidth sx={{ mb: 2 }}>
              Start Game
            </Button>
            <Button variant="contained" color="secondary" fullWidth sx={{ mb: 2 }}>
              Create Questions
            </Button>
            <Button variant="contained" color="secondary" fullWidth onClick={startGameWithPremadeQuestions}>
              Use Pre-made Questions
            </Button>
          </Box>
        )}
      {gameStarted && questions.length > 0 ? (
        isCreator ? (
          <HostView questions={questions} currentQuestionIndex={currentQuestionIndex} onNext={handleNextQuestion} />
        ) : (
          <PlayerView question={questions[currentQuestionIndex]} />
        )
      ) : (
        <Typography variant="h6" color="error">Loading questions...</Typography>
      )}
      </Box>
    </Box>
  );
};

export default GameRoom;