import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Box, Typography, Stack, Button, TextField, Modal, Checkbox, FormControl} from '@mui/material';
import io from 'socket.io-client';
import axios from 'axios';
import BackgroundImage from './assets/Background-Image.jpg';
import HostView from './HostView';
import PlayerView from './PlayerView';

//takes in the server and port from start.js and configures it with package.json
const SERVER_IP = process.env.REACT_APP_SERVER_IP;
const SERVER_PORT = process.env.REACT_APP_SERVER_PORT;
const BASE_URL = `http://${SERVER_IP}:${SERVER_PORT}`;

console.log(`Connecting to: ${BASE_URL}`);

const socket = io(`${BASE_URL}`, {
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
  const [openModal, setOpenModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newOptions, setNewOptions] = useState(['', '', '', '']);
  const [newCorrectAnswer, setNewCorrectAnswer] = useState([false,false,false,false]);
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
  useEffect(() => {
    socket.emit('join', { pin });

    const fetchPlayers = async () => {
      try {
        const response = await axios.post(`${BASE_URL}/join_game`, { pin, username });
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

  const createCustomQuestions = () => {
    setOpenModal(true);
  };


  const resetForm= () => {
    setNewQuestion('');
    setNewOptions(['','','','']);
    setNewCorrectAnswer([false,false,false,false]);
  };

  const customGameConnerCases= () => {
    if (!newQuestion || newOptions.some(opt => !opt)) {
      alert('Please fill in all fields.');
      return;
    }

    let counter = 0;
    let index2 = 0;
    for(let i = 0; i < newCorrectAnswer.length; i++){
      if(newCorrectAnswer[i]){
        counter = counter + 1;
        index2 = i;
      }
      if(counter > 1){
        alert('Only one correct answer can be selected')
        return;
      }
    }

    if(counter == 0){
      alert('Select one correct answer')
      return;
    }

    for(let i = 0; i < newOptions.length; i++){
      if(newOptions[index2] == newOptions[i]  && index2 != i){
        alert('Can\'t have the right answer written twice')
        return;
      }
    }
    return index2;
  };
  
  const anotherCustomQuestion = () =>{

    let index2 = customGameConnerCases();
    if(index2 == null){
      return;
    }

    const questionData = {
      question: newQuestion,
      options: [...newOptions],
      correctAnswer: newOptions[index2],
    };
    
    setQuestions([...questions, questionData]);
    console.log("Updated Questions State (custom):", [...questions, questionData]);
    socket.emit('add_question', { pin, question: questionData });

    resetForm();
    setOpenModal(true);
  };

  const saveCustomQuestion = () => {
    let index2 = customGameConnerCases();

    if(index2 == null){
      return;
    }
    const questionData = {
      question: newQuestion,
      options: [...newOptions],
      correctAnswer: newOptions[index2],
    };
  
    setQuestions([...questions, questionData]);
    console.log("Updated Questions State (custom):", [...questions, questionData]);
  
    setOpenModal(false);
  
    socket.emit('add_question', { pin, question: questionData });
  };

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
      const response = await axios.post(`${BASE_URL}/start_game_with_premade_questions`, { pin });
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

  const startGameWithCustomQuestions = () => {
    if (questions.length === 0) {
      alert("Please create at least one question before starting the game.");
      return;
    }

    socket.emit('start_game_with_custom_questions', { pin, questions });

    setGameStarted(true);
    setCurrentQuestionIndex(0);
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
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                sx={{ mb: 2 }}
                onClick={createCustomQuestions}
              >
                Create Questions
              </Button>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mb: 2}}
                onClick={startGameWithCustomQuestions}
              >
                 Start Custom Game
              </Button>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={startGameWithPremadeQuestions}
              >
                Use Pre-made Questions
              </Button>
            </Box>
          )}
  
          {gameStarted && questions.length > 0 ? (
            isCreator ? (
              <HostView
                questions={questions}
                currentQuestionIndex={currentQuestionIndex}
                onNext={handleNextQuestion}
              />
            ) : (
              <PlayerView question={questions[currentQuestionIndex]} />
            )
          ) : (
            <Typography variant="h6"></Typography>
          )}
        </Box>
  
        <Modal open={openModal} onClose={() => setOpenModal(false)}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              border: '2px solid #000',
              boxShadow: 24,
              p: 4,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography variant="h6" mb={2}>Create a Custom Question</Typography>
            <TextField
              label="Question"
              fullWidth
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              margin="normal"
            />
            <Typography variant="h6" mb={2}>Select the correctAnswer</Typography>
            {[0, 1, 2, 3].map((index) => (
              <div key={index}> 
              <Checkbox {...label}
              checked={newCorrectAnswer[index] || false}
              value={newCorrectAnswer[index]}
              onChange={(e) => {
                const updatedCorrectAnswer = [...newCorrectAnswer];
                updatedCorrectAnswer[index] = e.target.checked;
                setNewCorrectAnswer(updatedCorrectAnswer);
              }}
              />
              <TextField
                key={index}
                label={`Option ${index + 1}`}
                sx={{ m: 1, width: '30ch' }}
                value={newOptions[index]}
                onChange={(e) => {
                  const updatedOptions = [...newOptions];
                  updatedOptions[index] = e.target.value;
                  setNewOptions(updatedOptions);
                }}
                margin="normal"
              />
              </div>
            ))}
            <Button
              variant="contained"
              color="primary"
              onClick={saveCustomQuestion}
              sx={{ mt: 1 }}
            >
              Use Custom Questions
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={anotherCustomQuestion}
              sx={{ mt: 1 }}
            >
              Add another Question
            </Button>
          </Box>
        </Modal>
      </Box>
    );
  };
  
  export default GameRoom;