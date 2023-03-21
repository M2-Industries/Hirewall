import React, { MouseEvent, MouseEventHandler } from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedFilter } from '../slice';
import type { FilterType, HireWallState } from '../slice';
import type { HWState } from '../store';

export default function FilterButton() {
  const [variant, setVariant] = useState<'text' | 'outlined'>('text');
  const dispatch = useDispatch();
  const filter = useSelector((state: HireWallState) => state.selectedFilter);
  function handleButtonClick(e: MouseEvent<HTMLElement>) {
    e.preventDefault();
    dispatch(setSelectedFilter(filter === 'All' ? 'Active' : 'All'));
  }
  const handleMouseOver: MouseEventHandler<HTMLElement> = (event) => {
    setVariant('outlined');
  };
  const handleMouseOut: MouseEventHandler<HTMLElement> = (event) => {
    setVariant('text');
  };
  return (
    <div className='filterButton'>
      <Button
        variant={variant}
        size='large'
        onClick={handleButtonClick}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        sx={{ minWidth: '10rem' }}
      >
        {filter === 'All' ? 'Active' : 'All'}
      </Button>
    </div>
  );
}
