import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import SearchBar from '../components/SearchBar';
import FilterButton from '../components/FilterButton';
import ViewButton from '../components/ViewButton';
import { Outlet } from 'react-router-dom';

function Display() {
  return (
    <div id="display">
      <NavBar />
      <SearchBar />
      <div className="selectorButtons">
        <FilterButton />
        <ViewButton />
      </div>
      <Outlet />
    </div>
  );
}

export default Display;
