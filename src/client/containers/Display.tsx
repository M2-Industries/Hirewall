import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import NavBar from '../components/NavBar';
import SearchBar from '../components/SearchBar';
import Table from '../components/Table';
import Actions from '../components/Actions';
import Cards from '../components/Cards';
import Graph from '../components/Graph';
import FilterButton from '../components/FilterButton';
import ViewButton from '../components/ViewButton';
import { useSelector, useDispatch } from 'react-redux';
import type { HireWallState, ApplicationRecord } from '../slice';
import { setApplicationRecords, setActionRecords } from '../slice';

function Display() {
  const [allowList, setAllowList] = useState<Set<number>>(new Set());
  const dispatch = useDispatch();
  const view = useSelector((state: HireWallState) => state.selectedView);
  const filter = useSelector((state: HireWallState) => state.selectedFilter);
  const searchTerm = useSelector((state: HireWallState) => state.searchTerm);
  const appRecords = useSelector(
    (state: HireWallState) => state.applicationRecords
  );
  const actionRecords = useSelector(
    (state: HireWallState) => state.actionRecords
  );
  const user = useSelector((state: HireWallState) => state.userRecord);
  useEffect(() => {
    const ids = searchApps(searchTerm, appRecords);
    if (ids !== undefined) {
      setAllowList(new Set(ids));
    }
  }, [searchTerm]);

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
    <div id="display">
      <NavBar />
      <SearchBar />
      <div className="selectorButtons">
        <FilterButton />
        <ViewButton />
      </div>
      {view === 'Table' ? (
        <Table
          allowList={allowList}
          filter={filter}
          appRecords={appRecords}
          actionRecords={actionRecords}
        />
      ) : view === 'Graph' ? (
        <Graph
          allowList={allowList}
          filter={filter}
          appRecords={appRecords}
          actionRecords={actionRecords}
        />
      ) : (
        <Routes>
          <Route
            path="/dashboard/cards"
            element={
              <Cards
                allowList={allowList}
                filter={filter}
                appRecords={appRecords}
                actionRecords={actionRecords}
              />
            }
          />
          <Route path="/dashboard/details" element={<Actions />} />
        </Routes>
      )}
    </div>
  );
}

function searchApps(
  term: string,
  appRecords?: { [key: number]: ApplicationRecord }
): number[] {
  const results: number[] = [];
  if (term === '') return results; // search term is not set
  term = term.toLowerCase();
  for (const id in appRecords) {
    const elem = appRecords[Number(id)];
    for (const val of Object.values(elem)) {
      if (String(val).toLowerCase().search(term) !== -1) {
        results.push(Number(id));
        break;
      }
    }
  }
  // return an array of ids that match the terms
  return results;
}

export default Display;
{
  /* <Routes>
<Route
  path="/table"
  element={
    <Table appRecords={appRecords} actionRecords={actionRecords} />
  }
/>
<Route
  path="/card"
  element={
    <Cards appRecords={appRecords} actionRecords={actionRecords} />
  }
/>
</Routes> */
}
