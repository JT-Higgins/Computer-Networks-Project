import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';

const PlayerView = ({ question }) => {
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    setFeedback("");
  }, [question]);

  if (!question) {
    return <Typography variant="h6" color="error">Loading question...</Typography>;
  }

  const handleAnswer = (option) => {
    if (option === question.correctAnswer) {
      setFeedback("Correct!");
    } else {
      setFeedback("Incorrect!");
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
      <Typography variant="h6" mb={3}>{question.question}</Typography>
      
      <Stack spacing={2} alignItems="center" width="100%">
        {question.options.map((option, index) => (
          <Button
            key={index}
            variant="contained"
            onClick={() => handleAnswer(option)}
            fullWidth
          >
            {option}
          </Button>
        ))}
      </Stack>

      {feedback && <Typography variant="h6" sx={{ mt: 2 }}>{feedback}</Typography>}
    </Box>
  );
};

export default PlayerView;