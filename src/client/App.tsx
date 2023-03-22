import { Search } from '@mui/icons-material';
import React from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import SearchBar from './components/SearchBar';
import Table from './components/Table';
import Cards from './components/Cards';
import FilterButton from './components/FilterButton';
import ViewButton from './components/ViewButton';
import { useSelector } from 'react-redux';
import type { HireWallState } from './slice';

function App() {
  const view = useSelector((state: HireWallState) => state.selectedView);

  return (
    <div id='mainApp'>
      <NavBar />
      <SearchBar />
      <div className='selectorButtons'>
        <FilterButton />
        <ViewButton />
      </div>
      {view === 'Table' ? <Table /> : <Cards />}
      {/* <Routes>
        <Route path="/Display/*" element={<Display />} />
        <Route path="/" element={<Setup />} />
        <Route
          path="/Display"
          element={<Navigate to="Display/Overview" />}
        />{' '}
        // removed exact from path
      </Routes> */}
    </div>
  );
}

export default App;
