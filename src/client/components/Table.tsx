import * as React from 'react';
import { Box } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import type { ApplicationRecord, ActionRecord, ActionType } from '../slice';
type propType = {
  appRecords?: { [key: number]: ApplicationRecord };
  actionRecords?: {
    [key: number]: ActionRecord[];
  };
};
const SIZE = 10;
const VISIBLE_FIELDS = [
  'Company',
  'Location',
  'Title',
  'Salary',
  'Status',
  'Last Action',
  'Comments',
];

type rowObject = {
  id: number;
  company: string;
  location: string;
  job_title: string;
  salary: string;
  status: 'Active' | 'Inactive' | 'Unknown';
  last_action: ActionType | '';
  comments: string;
};

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'company',
    headerName: 'Company',
    width: 150,
    editable: true,
  },
  {
    field: 'location',
    headerName: 'Location',
    width: 150,
    editable: true,
  },
  {
    field: 'job_title',
    headerName: 'Title',
    width: 150,
    editable: true,
  },
  {
    field: 'salary',
    headerName: 'Salary',
    width: 150,
    editable: true,
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 100,
    editable: true,
  },
  {
    field: 'last_action',
    headerName: 'Last Action',
    width: 100,
    editable: true,
  },
  {
    field: 'comments',
    headerName: 'Comments',
    width: 200,
    editable: true,
  },
];

// const rows = [
//   {
//     id: 1,
//     Company: 'Amazon',
//     Location: 'New York, NY',
//     Title: 'Sr SW Eng',
//     Salary: '100k - 200k',
//     Status: 'Active',
//     lastAction: 'Applied',
//     Comments: 'Used resume version 4 with Cover Letter',
//   },
//   {
//     id: 2,
//     Company: 'Bloomberg',
//     Location: 'Jersey City, NJ',
//     Title: 'Sr SW Eng',
//     Salary: '100k - 200k',
//     Status: 'Active',
//     lastAction: 'Applied',
//     Comments: 'Used resume version 4 with Cover Letter',
//   },
//   {
//     id: 3,
//     Company: 'Google',
//     Location: 'Los Angeles, CA',
//     Title: 'Jr SW Eng',
//     Salary: '100k - 200k',
//     Status: 'Active',
//     lastAction: 'Applied',
//     Comments: 'Used resume version 4 with Cover Letter',
//   },
//   {
//     id: 4,
//     Company: 'Investopedia',
//     Location: 'Philadephia, PA',
//     Title: 'Staff Eng',
//     Salary: '100k - 200k',
//     Status: 'Active',
//     lastAction: 'Applied',
//     Comments: 'Used resume version 4 with Cover Letter',
//   },
//   {
//     id: 5,
//     Company: 'HP',
//     Location: 'Atlanta, GA',
//     Title: 'Lead SW Eng',
//     Salary: '100k - 200k',
//     Status: 'Active',
//     lastAction: 'Applied',
//     Comments: 'Used resume version 4 with Cover Letter',
//   },
//   {
//     id: 6,
//     Company: 'Apple',
//     Location: 'Remote',
//     Title: 'Operations',
//     Salary: '100k - 200k',
//     Status: 'Active',
//     lastAction: 'Applied',
//     Comments: 'Used resume version 4 with Cover Letter',
//   },
//   {
//     id: 7,
//     Company: 'Microsoft',
//     Location: 'Remote',
//     Title: 'Intern',
//     Salary: '100k - 200k',
//     Status: 'Active',
//     lastAction: 'Applied',
//     Comments: 'Used resume version 4 with Cover Letter',
//   },
//   {
//     id: 8,
//     Company: 'Google',
//     Location: 'Remote',
//     Title: 'Lead SW Eng',
//     Salary: '100k - 200k',
//     Status: 'Active',
//     lastAction: 'Applied',
//     Comments: 'Used resume version 4 with Cover Letter',
//   },
//   {
//     id: 9,
//     Company: 'Tesla',
//     Location: 'Austin, TX',
//     Title: 'SW Eng',
//     Salary: '100k - 200k',
//     Status: 'Active',
//     lastAction: 'Applied',
//     Comments: 'Used resume version 4 with Cover Letter',
//   },
// ];
// <Box sx={{ height: SIZE * 2 + 'rem', width: '100%' }}>
//
export default function Table(props: propType) {
  const { appRecords, actionRecords } = props;
  const rows: rowObject[] = [];
  for (const key in appRecords) {
    const {
      _id,
      company,
      location,
      job_title,
      salary,
      comments,
      last_action_id_fk,
    } = appRecords[Number(key)];
    const last_action =
      actionRecords !== undefined
        ? actionRecords[_id].at(-1)?.action_type
        : undefined;
    const status = getStatus(last_action);
    rows.push({
      id: _id,
      company,
      location,
      job_title,
      salary,
      status,
      last_action: last_action !== undefined ? last_action : '',
      comments,
    });
  }
  return (
    <div className='table'>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: SIZE,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </div>
  );
}

function getStatus(action?: ActionType): 'Inactive' | 'Unknown' | 'Active' {
  switch (action) {
    case 'Accepted':
    case 'Rejected':
    case 'Declined':
    case 'No Offer':
    case 'Withdrawn':
      return 'Inactive';
    case undefined:
      return 'Unknown'; //initial state
    default:
      return 'Active';
  }
}
