import { createSlice } from '@reduxjs/toolkit';

export type HireWallState = {
  isLoggedIn: boolean;
  userRecord: { _id: number; name: string; email: string }; // mimics the DB structure
  selectedView: 'Card' | 'Table' | 'Graph';
  selectedFilter: FilterType;
  searchTerm: string;
  applicationRecords?: { [key: number]: ApplicationRecord };
  actionRecords?: {
    [key: number]: ActionRecord[];
  };
};

export type ApplicationRecord = {
  _id: number;
  user_id?: number;
  company: string;
  location: string;
  job_title: string;
  salary: string; //number[]; // will need to parse to a number assume USD
  comments: string;
  last_action_id_fk: number | null; // points to ActionRecords[_id].[lastActionId]
};

export type ActionRecord = {
  _id: number;
  date: string;
  action_type: ActionType;
  // can be Applied -> [Rejected, Sent Follow Up -> [No Response, Interview, Rejected], Interview -> [Interview, Offer -> [Accepted, Declined], No Offer, Withdrawn]
  notes: string;
  application_id_fk?: number;
};
export type ActionType =
  | 'Created'
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

export type FilterType = 'Active' | 'Inactive' | 'All';

const initialState: HireWallState = {
  isLoggedIn: false,
  userRecord: { _id: 0, name: '', email: '' }, // mimics the DB structure
  selectedView: 'Card', // can be 'Card', 'Table', 'Graph' (growth)
  selectedFilter: 'All', // can be Active or All
  searchTerm: '',
  applicationRecords: {
    0: {
      _id: 0,
      company: 'M2-Industries',
      location: 'New York, NY',
      job_title: 'Sr. Software Engineer',
      salary: '$200,000', //[90000, 220000], // will need to parse to a number assume USD
      comments: 'Some String',
      last_action_id_fk: 2, // points to ActionRecords[_id].[lastActionId]
    },
    1: {
      _id: 1,
      company: 'Amazon',
      location: 'New York, NY',
      job_title: 'Sr. Software Engineer',
      salary: '$250,000', //[90000, 220000], // will need to parse to a number assume USD
      comments: 'Used resume version 4 with Cover Letter',
      last_action_id_fk: 5, // points to ActionRecords[_id].[lastActionId]
    },
    2: {
      _id: 2,
      company: 'Bloomberg',
      location: 'Jersey City, NJ',
      job_title: 'Software Engineer',
      salary: '$350,000', //[90000, 220000], // will need to parse to a number assume USD
      comments: 'Used resume version 5 with Cover Letter',
      last_action_id_fk: 10, // points to ActionRecords[_id].[lastActionId]
    },
    3: {
      _id: 3,
      company: 'Acme',
      location: 'Sun City, CA',
      job_title: 'Software Engineer',
      salary: '$180,000', //[90000, 220000], // will need to parse to a number assume USD
      comments: 'Used resume version 6 with Cover Letter',
      last_action_id_fk: 15, // points to ActionRecords[_id].[lastActionId]
    },
  },
  actionRecords: {
    0: [
      // maps to applicationRecord element in the table by id
      {
        _id: 0,
        date: '12/22/21',
        action_type: 'Created', // can be Applied -> [Rejected, Sent Follow Up -> [No Response, Interview, Rejected], Interview -> [Interview, Offer -> [Accepted, Declined], No Offer, Withdrawn]
        notes: 'applied today hoping for the best!',
      },
      {
        _id: 1,
        date: '12/22/21',
        action_type: 'Applied', // can be Applied -> [Rejected, Sent Follow Up -> [No Response, Interview, Rejected], Interview -> [Interview, Offer -> [Accepted, Declined], No Offer, Withdrawn]
        notes: 'applied today hoping for the best!',
      },
      {
        _id: 2,
        date: '12/23/21',
        action_type: 'Sent Follow Up', // can be Applied -> [Rejected, Sent Follow Up -> [No Response, Interview, Rejected], Interview -> [Interview, Offer -> [Accepted, Declined], No Offer, Withdrawn]
        notes: 'Checked in with Evelyn, sent her peaches.',
      },
      {
        _id: 2,
        date: '2/23/22',
        action_type: 'Interview', // can be Applied -> [Rejected, Sent Follow Up -> [No Response, Interview, Rejected], Interview -> [Interview, Offer -> [Accepted, Declined], No Offer, Withdrawn]
        notes: 'Checked in with Evelyn, sent her peaches.',
      },
    ],
    1: [
      // maps to applicationRecord element in the table by id
      {
        _id: 3,
        date: '3/22/21',
        action_type: 'Created', // can be Applied -> [Rejected, Sent Follow Up -> [No Response, Interview, Rejected], Interview -> [Interview, Offer -> [Accepted, Declined], No Offer, Withdrawn]
        notes: 'applied today hoping for the best!',
      },
      {
        _id: 4,
        date: '3/22/21',
        action_type: 'Applied', // can be Applied -> [Rejected, Sent Follow Up -> [No Response, Interview, Rejected], Interview -> [Interview, Offer -> [Accepted, Declined], No Offer, Withdrawn]
        notes: 'applied today hoping for the best!',
      },
      {
        _id: 5,
        date: '4/23/23',
        action_type: 'Rejected', // can be Applied -> [Rejected, Sent Follow Up -> [No Response, Interview, Rejected], Interview -> [Interview, Offer -> [Accepted, Declined], No Offer, Withdrawn]
        notes: 'They wanted 100 years experience',
      },
    ],
    2: [
      // maps to applicationRecord element in the table by id
      {
        _id: 6,
        date: '3/22/21',
        action_type: 'Created', // can be Applied -> [Rejected, Sent Follow Up -> [No Response, Interview, Rejected], Interview -> [Interview, Offer -> [Accepted, Declined], No Offer, Withdrawn]
        notes: 'applied today hoping for the best!',
      },
      {
        _id: 7,
        date: '3/22/21',
        action_type: 'Applied', // can be Applied -> [Rejected, Sent Follow Up -> [No Response, Interview, Rejected], Interview -> [Interview, Offer -> [Accepted, Declined], No Offer, Withdrawn]
        notes: 'applied today hoping for the best!',
      },
      {
        _id: 8,
        date: '4/23/23',
        action_type: 'Interview', // can be Applied -> [Rejected, Sent Follow Up -> [No Response, Interview, Rejected], Interview -> [Interview, Offer -> [Accepted, Declined], No Offer, Withdrawn]
        notes: 'They wanted 100 years experience',
      },
      {
        _id: 9,
        date: '4/23/23',
        action_type: 'Offer', // can be Applied -> [Rejected, Sent Follow Up -> [No Response, Interview, Rejected], Interview -> [Interview, Offer -> [Accepted, Declined], No Offer, Withdrawn]
        notes: 'They wanted 100 years experience',
      },
      {
        _id: 10,
        date: '4/23/23',
        action_type: 'Accepted', // can be Applied -> [Rejected, Sent Follow Up -> [No Response, Interview, Rejected], Interview -> [Interview, Offer -> [Accepted, Declined], No Offer, Withdrawn]
        notes: 'They wanted 100 years experience',
      },
    ],
    3: [
      // maps to applicationRecord element in the table by id
      {
        _id: 11,
        date: '3/22/21',
        action_type: 'Created', // can be Applied -> [Rejected, Sent Follow Up -> [No Response, Interview, Rejected], Interview -> [Interview, Offer -> [Accepted, Declined], No Offer, Withdrawn]
        notes: 'applied today hoping for the best!',
      },
      {
        _id: 12,
        date: '3/22/21',
        action_type: 'Applied', // can be Applied -> [Rejected, Sent Follow Up -> [No Response, Interview, Rejected], Interview -> [Interview, Offer -> [Accepted, Declined], No Offer, Withdrawn]
        notes: 'applied today hoping for the best!',
      },
      {
        _id: 13,
        date: '4/23/23',
        action_type: 'Interview', // can be Applied -> [Rejected, Sent Follow Up -> [No Response, Interview, Rejected], Interview -> [Interview, Offer -> [Accepted, Declined], No Offer, Withdrawn]
        notes: 'They wanted 100 years experience',
      },
      {
        _id: 14,
        date: '4/23/23',
        action_type: 'Offer', // can be Applied -> [Rejected, Sent Follow Up -> [No Response, Interview, Rejected], Interview -> [Interview, Offer -> [Accepted, Declined], No Offer, Withdrawn]
        notes: 'They wanted 100 years experience',
      },
      {
        _id: 15,
        date: '4/23/23',
        action_type: 'Declined', // can be Applied -> [Rejected, Sent Follow Up -> [No Response, Interview, Rejected], Interview -> [Interview, Offer -> [Accepted, Declined], No Offer, Withdrawn]
        notes: 'They wanted 100 years experience',
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
      // const { _id, name, email } = action.payload; // assumes that the structure is in the DB
      state.userRecord = { _id: 0, name: '', email: action.payload };
    },
    setSelectedView: (state, action) => {
      switch (action.payload) {
        case 'Table':
          state.selectedView = 'Table';
          break;
        case 'Graph':
          state.selectedView = 'Graph';
          break;
        default:
          state.selectedView = 'Card';
      }
    },
    setSelectedFilter: (state, action) => {
      switch (action.payload) {
        case 'Active':
          state.selectedFilter = 'Active';
          break;
        case 'Inactive':
          state.selectedFilter = 'Inactive';
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
          user_id,
          company,
          location,
          job_title,
          salary,
          comments,
          last_action_id_fk,
        } = record; // assumes that the structure is in the DB
        results = {
          ...results,
          _id: {
            _id,
            company,
            location,
            job_title,
            salary,
            comments,
            last_action_id_fk,
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
          action_type: parseActionType(actionType),
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
            state.applicationRecords[app_id].last_action_id_fk = _id;
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
          state.applicationRecords[app_id].last_action_id_fk = null; //signify the link is brokern
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
          state.applicationRecords[app_id].last_action_id_fk = action_id;
        }
      }
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
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

export const {
  setIsLoggedIn,
  setUserRecord,
  setSelectedView,
  setSelectedFilter,
  setApplicationRecords,
  deleteApplicationRecord,
  setActionRecords,
  deleteActionRecord,
  deleteActionRecordElem,
  setSearchTerm,
} = hwSlice.actions;

export default hwSlice.reducer;
