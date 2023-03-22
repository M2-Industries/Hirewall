import React, { MouseEvent, MouseEventHandler } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedView } from '../slice';
import type { HireWallState } from '../slice';

export default function ViewButton() {
  const [variant, setVariant] = useState<'text' | 'contained'>('text');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const view = useSelector((state: HireWallState) => state.selectedView);
  function handleButtonClick(e: MouseEvent<HTMLElement>) {
    e.preventDefault();
    dispatch(
      setSelectedView(
        view === 'Card' ? 'Table' : view === 'Table' ? 'Graph' : 'Card'
      )
    );
  }
  const handleMouseOver: MouseEventHandler<HTMLElement> = (event) => {
    setVariant('contained');
  };
  const handleMouseOut: MouseEventHandler<HTMLElement> = (event) => {
    setVariant('text');
  };
  return (
    <div className="filterButton">
      <Button
        variant={variant}
        size="large"
        onClick={handleButtonClick}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        sx={{ minWidth: '10rem' }}
      >
        {view === 'Card' ? 'Table' : view === 'Table' ? 'Graph' : 'Card'}
      </Button>
    </div>
  );
}
