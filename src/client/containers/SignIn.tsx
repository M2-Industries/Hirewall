import React, { ChangeEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import NavBar from '../components/NavBar';
import Button from '@mui/material/Button';
import { useDispatch } from 'react-redux';
import { setUserRecord } from '../slice';

export default function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
    }).then((response) => {
      console.log(response.status);
      if (response.status === 202) {
        navigate('/dashboard');
      }
    });
  };

  return (
    <div>
      <NavBar />
      <Container maxWidth='xs'>
        <Box
          sx={{
            mt: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component='h1' variant='h4' sx={{ mb: 3 }}>
            Sign In{' '}
          </Typography>
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
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                dispatch(setUserRecord(e.target.value))
              }
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
          <Link to='/signup'>{'New to Hirewall? Create an account'}</Link>
        </Box>
      </Container>
    </div>
  );
}
