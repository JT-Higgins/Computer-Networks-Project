import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import HostView from './HostView';
import PlayerView from './PlayerView';
import { Button, Box, Typography } from '@mui/material';
import { useParams, useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import BackgroundImage from './assets/Background-Image.jpg';

const socket = io('http://localhost:5000', {
  transports: ['websocket', 'polling'],
});

const Game = () => {
  const { pin } = useParams();
  const location = useLocation();
  const { isCreator, username } = location.state || {};
  const [players, setPlayers] = useState([]);
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

    const loadQuestions = async () => {
      try {
        const response = await fetch('/questions/example.csv');
        const reader = response.body.getReader();
        const result = await reader.read();
        const decoder = new TextDecoder('utf-8');
        const csvData = decoder.decode(result.value);

        Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            const parsedQuestions = result.data.map((row) => ({
              question: row.Question,
              options: [row.Option1, row.Option2, row.Option3, row.Option4],
              correctAnswer: row.CorrectAnswer,
            }));
            setQuestions(parsedQuestions);
          },
        });
      } catch (error) {
        console.error('Error loading or parsing the CSV file:', error);
      }
    };

    loadQuestions();

    socket.on('update_player_list', (data) => {
      setPlayers(data.players);
    });

    return () => {
      socket.off('update_player_list');
      socket.disconnect();
    };
  }, [pin, username]);

  const handleNextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex);
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

        {isCreator ? (
          <HostView
            questions={questions}
            onNext={handleNextQuestion}
          />
        ) : (
          <PlayerView question={questions[currentQuestionIndex]} />
        )}
      </Box>
    </Box>
  );
};

export default Game;