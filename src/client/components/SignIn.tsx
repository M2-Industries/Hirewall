import React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';

export default function SignIn() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const requestData = {
      email: data.get('email'),
      password: data.get('password'),
    };
    fetch('/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });
  };

  return (
    <Container maxWidth='xs'>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h1>Sign In</h1>
        <Box component='form' onSubmit={handleSubmit} noValidate>
          <TextField
            variant='standard'
            margin='dense'
            required
            fullWidth
            id='email'
            label='Email'
            name='email'
            type='text'
            autoFocus
          />
          <TextField
            variant='standard'
            margin='dense'
            required
            fullWidth
            id='password'
            label='Password'
            name='password'
            type='password'
          />
          <Button type='submit' variant='contained' sx={{ mt: 4, mb: 4 }}>
            Sign In
          </Button>
        </Box>
        <Link href='#/signup'>{'New to Hirewall? Create an account'}</Link>
      </Box>
    </Container>
  );
}
