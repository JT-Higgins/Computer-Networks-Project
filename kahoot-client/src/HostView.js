import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';

const HostView = ({ questions, currentQuestionIndex, onNext }) => {
  const question = questions[currentQuestionIndex];

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
      <Typography variant="h5" mb={3}>Question {currentQuestionIndex + 1}</Typography>
      <Typography variant="h6" mb={3}>{question.question}</Typography>
      
      <Stack spacing={2} alignItems="center" width="100%">
        {question.options.map((option, index) => (
          <Typography key={index}>{option}</Typography>
        ))}
      </Stack>

      <Button
        variant="contained"
        color="primary"
        onClick={onNext}
        fullWidth
        sx={{ mt: 2 }}
      >
        Exit
      </Button>
    </Box>
  );
};

export default HostView;