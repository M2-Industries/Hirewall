import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import SearchBar from '../components/SearchBar';
import Table from '../components/Table';
import Cards from '../components/Cards';
import Graph from '../components/Graph';
import FilterButton from '../components/FilterButton';
import ViewButton from '../components/ViewButton';
import { useSelector, useDispatch } from 'react-redux';
import type { HireWallState, ApplicationRecord } from '../slice';
import {
  setApplicationRecords,
  setActionRecords,
  setIsLoggedIn,
} from '../slice';

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
    dispatch(setIsLoggedIn(true));
  }, []);

  useEffect(() => {
    //insert fetch request to back end for app records
    // Assume that the user record has been setup by the LOGIN Page
    // need to POST with user_id
    fetch(`/application/`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.status === 200) return res.json();
        else throw Error(`Error on get /application ${res.status}`);
      })
      .then((data) => {
        // set all app records for user
        dispatch(setApplicationRecords(data));
        // set all actions for each app record
        const cache = new Set();
        for (const record of data) {
          if (cache.has(record._id)) continue;
          cache.add(record._id);
          //insert fetch request to back end for app records
          fetch(`/action/${record._id}`, {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          })
            .then((res) => {
              if (res.status === 200) return res.json();
              else throw Error(`Error on get /application ${res.status}`);
            })
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
        <Cards
          allowList={allowList}
          filter={filter}
          appRecords={appRecords}
          actionRecords={actionRecords}
        />
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
