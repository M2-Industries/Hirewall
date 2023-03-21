import { Search } from '@mui/icons-material';
import React from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import SearchBar from './components/SearchBar';
import Table from './components/Table';
import FilterButton from './components/FilterButton';
function App() {
  return (
    <div id='mainApp'>
      <NavBar />
      <SearchBar />
      <FilterButton />
      <Table />
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
