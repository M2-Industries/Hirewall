import { createSlice } from '@reduxjs/toolkit';

type HireWallState = {
  isLoggedIn: boolean;
  userRecord: { _id: number; name: string; email: string }; // mimics the DB structure
  selectedView: 'Card' | 'Table' | 'Graph';
  selectedFilter: 'All' | 'Active';
  applicationRecords?: { [key: number]: ApplicationRecord };
  actionRecords?: {
    [key: number]: ActionRecord[];
  };
};

type ApplicationRecord = {
  _id: number;
  Company: string;
  Location: string;
  JobTitle: string;
  Salary: number[]; // will need to parse to a number assume USD
  Comments: string;
  lastActionId: number | null; // points to ActionRecords[_id].[lastActionId]
};

type ActionRecord = {
  _id: number;
  date: string;
  actionType: ActionType;
  // can be Applied -> [Rejected, Sent Follow Up -> [No Response, Interview, Rejected], Interview -> [Interview, Offer -> [Accepted, Declined], No Offer, Withdrawn]
  notes: string;
};
type ActionType =
  | 'Applied'
  | 'Rejected'
  | 'Sent Follow Up'
  | 'No Response'
  | 'Interview'
  | 'Rejected'
  | 'Offer'
  | 'Accepted'
  | 'Declined'
  | 'No Offer'
  | 'Withdrawn';

const initialState: HireWallState = {
  isLoggedIn: false,
  userRecord: { _id: 0, name: '', email: '' }, // mimics the DB structure
  selectedView: 'Card', // can be 'Card', 'Table', 'Graph' (growth)
  selectedFilter: 'All', // can be Active or All
  applicationRecords: [
    {
      _id: 0,
      Company: 'M2-Industries',
      Location: 'New York, NY',
      JobTitle: 'Sr. Software Engineer',
      Salary: [90000, 220000], // will need to parse to a number assume USD
      Comments: 'Some String',
      lastActionId: 1, // points to ActionRecords[_id].[lastActionId]
    },
  ],
  actionRecords: {
    0: [
      // maps to applicationRecord element in the table by id
      {
        _id: 0,
        date: '12/22/21',
        actionType: 'Applied', // can be Applied -> [Rejected, Sent Follow Up -> [No Response, Interview, Rejected], Interview -> [Interview, Offer -> [Accepted, Declined], No Offer, Withdrawn]
        notes: 'applied today hoping for the best!',
      },
      {
        _id: 1,
        date: '12/23/21',
        actionType: 'Sent Follow Up', // can be Applied -> [Rejected, Sent Follow Up -> [No Response, Interview, Rejected], Interview -> [Interview, Offer -> [Accepted, Declined], No Offer, Withdrawn]
        notes: 'Checked in with Evelyn, sent her peaches.',
      },
    ],
  },
};

const hwSlice = createSlice({
  name: 'hw',
  initialState,
  reducers: {
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload === true; // must be a boolean
    },
    setUserRecord: (state, action) => {
      const { _id, name, email } = action.payload; // assumes that the structure is in the DB
      state.userRecord = { _id, name, email };
    },
    setSelectedView: (state, action) => {
      switch (action.payload.toLower()) {
        case 'table':
          state.selectedView = 'Table';
          break;
        case 'graph':
          state.selectedView = 'Graph';
          break;
        default:
          state.selectedView = 'Card';
      }
    },
    setSelectedFilter: (state, action) => {
      switch (action.payload.toLower()) {
        case 'active':
          state.selectedFilter = 'Active';
          break;
        default:
          state.selectedFilter = 'All';
      }
    },
    setApplicationRecords: (state, action) => {
      let results = {};
      for (const record of action.payload) {
        // assumes the payload is an array of records.
        const {
          _id,
          Company,
          Location,
          JobTitle,
          Salary,
          Comments,
          lastActionId,
        } = record; // assumes that the structure is in the DB
        results = {
          ...results,
          _id: {
            _id,
            Company,
            Location,
            JobTitle,
            Salary,
            Comments,
            lastActionId,
          },
        };
      }
      //update the app records with new changes
      state.applicationRecords = Object.assign(
        {},
        state.applicationRecords,
        results
      );
    },
    deleteApplicationRecord: (state, action) => {
      // expect an array of _id to remove
      if (state.applicationRecords === undefined) return;

      for (const _id of action.payload) {
        delete state.applicationRecords[_id];
      }
    },
    setActionRecords: (state, action) => {
      let results: { [key: number]: ActionRecord[] } = {};
      for (const record of action.payload) {
        // assumes the paylod is an array of action records.
        const { _id, date, actionType, notes, application_id_fk } = record; // assumes that the structure is in the DB
        const newObj = {
          _id: Number(_id),
          date: String(date),
          actionType: parseActionType(actionType),
          notes: String(notes),
        };

        const app_id: number = Number(application_id_fk);
        if (app_id !== undefined) {
          // update results per application_id key with new actionRecord object
          if (results[app_id] !== undefined) {
            results = { ...results, [app_id]: [newObj] };
          } else {
            results[app_id].push(newObj);
          }
          // update last action id
          if (
            state.applicationRecords !== undefined &&
            app_id in state.applicationRecords
          ) {
            state.applicationRecords[app_id].lastActionId = _id;
          }
        }
      }
      // augment the record
      state.actionRecords = Object.assign({}, state.actionRecords, results);
    },
    deleteActionRecord: (state, action) => {
      //deletes whole action record file
      // expect an array of _id to remove
      if (state.actionRecords === undefined) return;

      for (const app_id of action.payload) {
        delete state.actionRecords[app_id];
        // update last action id associated with action
        if (
          state.applicationRecords !== undefined &&
          app_id in state.applicationRecords
        ) {
          state.applicationRecords[app_id].lastActionId = null; //signify the link is brokern
        }
      }
    },
    deleteActionRecordElem: (state, action) => {
      // deletes a action record element by id
      // expect an object with app_id and row #
      if (state.actionRecords === undefined) return;
      const { app_id, row } = action.payload;

      if (
        state.actionRecords[app_id] !== undefined &&
        row < state.actionRecords[app_id].length
      ) {
        const len = state.actionRecords[app_id].length;
        // shift all the rows down
        for (let i = row; i < len - 1; i++) {
          state.actionRecords[app_id][i] = state.actionRecords[app_id][i + 1];
        }
        // remove last row
        state.actionRecords[app_id].pop();
        // update last action id associated with action
        const action_id = state.actionRecords[app_id][len - 2]._id;
        if (
          state.applicationRecords !== undefined &&
          app_id in state.applicationRecords
        ) {
          state.applicationRecords[app_id].lastActionId = action_id;
        }
      }
    },
  },
});

function parseActionType(action_type: string): ActionType {
  switch (action_type) {
    case 'Applied':
    case 'Rejected':
    case 'Sent Follow Up':
    case 'No Response':
    case 'Interview':
    case 'Offer':
    case 'Accepted':
    case 'Declined':
    case 'No Offer':
    case 'Withdrawn':
      return action_type;
    default:
      return 'Applied'; //assuming
  }
}

const {
  setIsLoggedIn,
  setUserRecord,
  setSelectedView,
  setSelectedFilter,
  setApplicationRecords,
  deleteApplicationRecord,
  setActionRecords,
  deleteActionRecord,
  deleteActionRecordElem,
} = hwSlice.actions;

export default hwSlice.reducer;
