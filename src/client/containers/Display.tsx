import React, { useEffect } from 'react';
import NavBar from '../components/NavBar';
import SearchBar from '../components/SearchBar';
import Table from '../components/Table';
import Cards from '../components/Cards';
import FilterButton from '../components/FilterButton';
import ViewButton from '../components/ViewButton';
import { useSelector, useDispatch } from 'react-redux';
import type { HireWallState } from '../slice';
import { setApplicationRecords, setActionRecords } from '../slice';

function Display() {
  const dispatch = useDispatch();
  const view = useSelector((state: HireWallState) => state.selectedView);
  const appRecords = useSelector(
    (state: HireWallState) => state.applicationRecords
  );
  const actionRecords = useSelector(
    (state: HireWallState) => state.actionRecords
  );
  const user = useSelector((state: HireWallState) => state.userRecord);
  useEffect(() => {
    //insert fetch request to back end for app records
    // Assume that the user record has been setup by the LOGIN Page

    // need to POST with user_id
    fetch('/application', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: user._id }), //search by user id
    })
      .then((res) => res.json())
      .then((data) => {
        // set all app records for user
        dispatch(setApplicationRecords(data));
        // set all actions for each app record
        const cache = new Set();
        for (const record of data) {
          if (cache.has(data._id)) continue;
          cache.add(data._id);
          //insert fetch request to back end for app records
          fetch('/action', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ application_id: data._id }), //search by app id
          })
            .then((res) => res.json())
            .then((data) => {
              dispatch(setActionRecords(data));
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  }, [view]);
  return (
    <div id='display'>
      <NavBar />
      <SearchBar />
      <div className='selectorButtons'>
        <FilterButton />
        <ViewButton />
      </div>
      {view === 'Table' ? (
        <Table appRecords={appRecords} actionRecords={actionRecords} />
      ) : (
        <Cards appRecords={appRecords} actionRecords={actionRecords} />
      )}
    </div>
  );
}

export default Display;
