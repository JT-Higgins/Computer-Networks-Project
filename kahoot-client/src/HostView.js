import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';

const HostView = ({ questions, currentQuestionIndex, onNext, onEnd }) => {
  const question = questions[currentQuestionIndex];

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
      <Typography variant="h5" mb={2} textAlign="center">
        Question {currentQuestionIndex + 1}
      </Typography>
      <Typography variant="body1" mb={3} textAlign="center">
        {question.question}
      </Typography>
      
      <Stack spacing={2} width="100%">
        {question.options.map((option, index) => (
          <Typography key={index} sx={{ textAlign: 'center', fontSize: '16px' }}>
            {option}
          </Typography>
        ))}
      </Stack>

      <Stack spacing={2} mt={3} width="100%">
        <Button variant="contained" color="primary" onClick={onNext}>
          Next Question
        </Button>
        <Button variant="contained" color="error" onClick={onEnd}>
          End Game
        </Button>
      </Stack>
    </Box>
  );
};

export default HostView;