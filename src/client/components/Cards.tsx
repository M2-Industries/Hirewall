import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import type { ActionType } from '../slice';
const bull = (
  <Box
    component='span'
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

const card = (
  <React.Fragment>
    <CardContent>
      <div className='topCard'>
        <Typography sx={{ fontSize: 14 }} color='text.secondary' gutterBottom>
          Active {/*status*/}
        </Typography>
        <Typography sx={{ fontSize: 14 }} color='text.secondary' gutterBottom>
          Applied {/*lastAction*/}
        </Typography>
      </div>
      <div className='bodyCard'>
        <Typography variant='h5' component='div'>
          Company {/*Company*/}
        </Typography>
      </div>
      <div className='bodyCard'>
        <Typography sx={{ mb: 1.5 }} color='text.secondary'>
          Title {/*jobTitle*/}
        </Typography>
      </div>
      <div className='bodyCard'>
        <Typography variant='body2'>
          Salary Range {/*salaryRange*/}
          <br />
          {'"comments..."'} {/**/}
        </Typography>
      </div>
    </CardContent>
    <CardActions className='bodyCard'>
      <Button size='small'>More Details</Button>
    </CardActions>
  </React.Fragment>
);

export default function Cards() {
  function setColor(action: ActionType): string {
    switch (action) {
      case 'Accepted':
      case 'Rejected':
      case 'Declined':
      case 'No Offer':
      case 'Withdrawn':
        return '#E8E8E8';
      default:
        return 'white';
    }
  }
  const cards: JSX.Element[] = [];
  for (let i = 0; i < 20; i++) {
    cards.push(
      <div id={`{i}`} className='cardDiv'>
        <Box
          sx={{
            minWidth: 275,
            maxWidth: '25rem',
          }}
        >
          <Card
            variant='outlined'
            sx={{
              borderColor: '#E8E8E8',
              backgroundColor: setColor('Applied'),
            }}
          >
            {card}
          </Card>
        </Box>
      </div>
    );
    cards.push(
      <div id={`{i}`} className='cardDiv'>
        <Box
          sx={{
            minWidth: 275,
            maxWidth: '25rem',
          }}
        >
          <Card
            variant='outlined'
            sx={{
              borderColor: '#E8E8E8',
              backgroundColor: setColor('Rejected'),
            }}
          >
            {card}
          </Card>
        </Box>
      </div>
    );
  }
  return <div className='cardSection'> {cards} </div>;
}
