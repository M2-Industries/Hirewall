import * as React from 'react';
import { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { propType } from '../App';
import type { ActionType } from '../slice';

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

export default function Table(props: propType) {
  const [rows, setRows] = useState<rowObject[]>([]);
  const { appRecords, actionRecords, filter, allowList } = props;
  // const rows: rowObject[] = [];
  useEffect(() => {
    const newRows: rowObject[] = [];
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
      if (filter !== status && filter !== 'All') continue;
      if (allowList.size > 0 && !allowList.has(Number(key))) continue;
      newRows.push({
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
    setRows(newRows);
  }, [filter, allowList]);
  return (
    <div className="table">
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
