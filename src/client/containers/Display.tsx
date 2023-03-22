import React from 'react';
import NavBar from '../components/NavBar';
import SearchBar from '../components/SearchBar';
import Table from '../components/Table';
import Cards from '../components/Cards';
import FilterButton from '../components/FilterButton';
import ViewButton from '../components/ViewButton';
import { useSelector } from 'react-redux';
import type { HireWallState } from '../slice';

function Display() {
  const view = useSelector((state: HireWallState) => state.selectedView);
  return (
    <div id='display'>
      <NavBar />
      <SearchBar />
      <div className='selectorButtons'>
        <FilterButton />
        <ViewButton />
      </div>
      {view === 'Table' ? <Table /> : <Cards />}
    </div>
  );
}

export default Display;
