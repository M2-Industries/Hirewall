import * as React from 'react';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import type { ActionType, FilterType } from '../slice';
import type { ApplicationRecord, ActionRecord } from '../slice';
import { useNavigate } from 'react-router-dom';
type propType = {
  allowList: Set<number>;
  appRecords?: { [key: number]: ApplicationRecord };
  actionRecords?: {
    [key: number]: ActionRecord[];
  };
  filter: FilterType;
};

type cardText = {
  _id: number;
  company: string;
  location: string;
  job_title: string;
  salary: string;
  status: 'Active' | 'Inactive' | 'Unknown';
  last_action: ActionType | '';
  comments: string;
};

function getStatus(action?: ActionType): 'Inactive' | 'Unknown' | 'Active' {
  switch (action) {
    case 'Accepted':
    case 'Rejected':
    case 'Declined':
    case 'No Offer':
    case 'Withdrawn':
      return 'Inactive';
    case undefined:
      return 'Unknown'; //initial state
    default:
      return 'Active';
  }
}
const handleClick = () => {
  const navigate = useNavigate();
  navigate(`/dashboard/details`);
};
const card = (text: cardText) => (
  <React.Fragment>
    <CardContent>
      <div className="topCard">
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {text.status}
        </Typography>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {text.last_action}
        </Typography>
      </div>
      <div className="bodyCard">
        <Typography variant="h5" component="div">
          {text.company}
        </Typography>
      </div>
      <div className="bodyCard">
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {text.job_title}
        </Typography>
      </div>
      <div className="bodyCard">
        <Typography variant="body2">{text.salary}</Typography>
      </div>
      <div className="bodyCard">
        <Typography variant="body2">{text.comments}</Typography>
      </div>
    </CardContent>
    <CardActions className="bodyCard">
      <Button size="small" onClick={() => handleClick()}>
        More Details
      </Button>
    </CardActions>
  </React.Fragment>
);

export default function Cards(props: propType) {
  const [cards, setCards] = useState<JSX.Element[]>([]);
  const { appRecords, actionRecords, filter, allowList } = props;
  function setColor(action?: ActionType): string {
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

  useEffect(() => {
    const newCards: JSX.Element[] = [];
    for (const key in appRecords) {
      const {
        _id,
        company,
        location,
        job_title,
        salary,
        comments,
        last_action_id_fk,
      } = appRecords[Number(key)];
      const last_action =
        actionRecords !== undefined
          ? actionRecords[_id].at(-1)?.action_type
          : undefined;
      const status = getStatus(last_action);
      if (filter !== status && filter !== 'All') continue;
      if (allowList.size > 0 && !allowList.has(Number(key))) continue;
      newCards.push(
        <div key={String(_id)} id={String(_id)} className="cardDiv">
          <Box
            sx={{
              minWidth: 275,
              maxWidth: '25rem',
            }}
          >
            <Card
              variant="outlined"
              sx={{
                borderColor: '#E8E8E8',
                backgroundColor: setColor(last_action),
              }}
            >
              {card({
                _id,
                company,
                location,
                job_title,
                salary,
                status,
                comments,
                last_action: last_action !== undefined ? last_action : '',
              })}
            </Card>
          </Box>
        </div>
      );
    }
    setCards(newCards);
  }, [filter, allowList]);

  return <div className="cardSection"> {cards} </div>;
}
