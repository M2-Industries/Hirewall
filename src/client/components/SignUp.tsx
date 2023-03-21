import React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';

export default function SignUp() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const requestData = {
      username: data.get('username'),
      password: data.get('password'),
    };
    fetch('/signup', { method: 'POST', body: JSON.stringify({ requestData }) });
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
        <h1>Sign Up</h1>
        <Box component='form' onSubmit={handleSubmit} noValidate>
          <TextField
            variant='standard'
            margin='dense'
            required
            fullWidth
            id='username'
            label='Username'
            name='username'
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
            Sign Up
          </Button>
        </Box>
        <Link href='#/signup'>{'New to Hirewall? Create an account'}</Link>
      </Box>
    </Container>
  );
}
