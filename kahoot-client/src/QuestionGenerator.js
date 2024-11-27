import React, { useState } from 'react';
import axios from 'axios';
import { Box, TextField, Button } from '@mui/material';

const QuestionGenerator = () => ({ questions, currentQuestionIndex, onNext,pin,username }) => {
    const question = questions[currentQuestionIndex];
    const [q, setQuestion] = useState('');
    const [option1, setOption1] = useState('');
    const [option2, setOption2] = useState('');
    const [option3, setOption3] = useState('');
    const [option4, setOption4] = useState('');

    const createQuestion = async () =>{
      try {
        const response = await axios.post('http://localhost:5000/join_game', {pin, username,});
  
        // Assuming the server response contains the necessary fields
        const { q, option1, option2, option3, option4 } = response.data;
  
        // Update the state with the new question and options
        setQuestion(q);
        setOption1(option1);
        setOption2(option2);
        setOption3(option3);
        setOption4(option4);
      } catch (error) {
        console.error('Error creating game:', error);
      }
    };

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
          <TextField
          label="Enter Question"
          value={q}
          onChange={(e) => setQuestion(e.target.value)}
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
          label="Enter correct answer"
          value={option1}
          onChange={(e) => setOption1(e.target.value)}
          fullWidthReact
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
          label="Enter wrong answer"
          value={option2}
          onChange={(e) => setOption2(e.target.value)}
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
          label="Enter wrong answe"
          value={option3}
          onChange={(e) => setOption3(e.target.value)}
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
          label="EEnter wrong answe"
          value={option4}
          onChange={(e) => setOption4(e.target.value)}
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
            color="primary"
            onClick={onNext}
            fullWidth
            sx={{ mt: 2 }}
          >
            Next Question
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={{ mt: 2 }}
            fullWidth
            sx={{ mt: 2 }}
          >
            End Game
            </Button>
        </Box>
      );
};

export default QuestionGenerator;