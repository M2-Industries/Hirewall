import * as React from 'react';
import { Box } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

const VISIBLE_FIELDS = [
  'Company',
  'Location',
  'Title',
  'Salary',
  'Status',
  'Last Action',
  'Comments',
];
const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'Company',
    headerName: 'Company',
    width: 150,
    editable: true,
  },
  {
    field: 'Location',
    headerName: 'Location',
    width: 150,
    editable: true,
  },
  {
    field: 'Title',
    headerName: 'Title',
    width: 150,
    editable: true,
  },
  {
    field: 'Salary',
    headerName: 'Salary',
    width: 150,
    editable: true,
  },
  {
    field: 'Status',
    headerName: 'Status',
    width: 100,
    editable: true,
  },
  {
    field: 'lastAction',
    headerName: 'Last Action',
    width: 100,
    editable: true,
  },
  {
    field: 'Comments',
    headerName: 'Comments',
    width: 200,
    editable: true,
  },
];

const rows = [
  {
    id: 1,
    Company: 'Amazon',
    Location: 'New York, NY',
    Title: 'Sr SW Eng',
    Salary: '100k - 200k',
    Status: 'Active',
    lastAction: 'Applied',
    Comments: 'Used resume version 4 with Cover Letter',
  },
  {
    id: 2,
    Company: 'Bloomberg',
    Location: 'Jersey City, NJ',
    Title: 'Sr SW Eng',
    Salary: '100k - 200k',
    Status: 'Active',
    lastAction: 'Applied',
    Comments: 'Used resume version 4 with Cover Letter',
  },
  {
    id: 3,
    Company: 'Google',
    Location: 'Los Angeles, CA',
    Title: 'Jr SW Eng',
    Salary: '100k - 200k',
    Status: 'Active',
    lastAction: 'Applied',
    Comments: 'Used resume version 4 with Cover Letter',
  },
  {
    id: 4,
    Company: 'Investopedia',
    Location: 'Philadephia, PA',
    Title: 'Staff Eng',
    Salary: '100k - 200k',
    Status: 'Active',
    lastAction: 'Applied',
    Comments: 'Used resume version 4 with Cover Letter',
  },
  {
    id: 5,
    Company: 'HP',
    Location: 'Atlanta, GA',
    Title: 'Lead SW Eng',
    Salary: '100k - 200k',
    Status: 'Active',
    lastAction: 'Applied',
    Comments: 'Used resume version 4 with Cover Letter',
  },
  {
    id: 6,
    Company: 'Apple',
    Location: 'Remote',
    Title: 'Operations',
    Salary: '100k - 200k',
    Status: 'Active',
    lastAction: 'Applied',
    Comments: 'Used resume version 4 with Cover Letter',
  },
  {
    id: 7,
    Company: 'Microsoft',
    Location: 'Remote',
    Title: 'Intern',
    Salary: '100k - 200k',
    Status: 'Active',
    lastAction: 'Applied',
    Comments: 'Used resume version 4 with Cover Letter',
  },
  {
    id: 8,
    Company: 'Google',
    Location: 'Remote',
    Title: 'Lead SW Eng',
    Salary: '100k - 200k',
    Status: 'Active',
    lastAction: 'Applied',
    Comments: 'Used resume version 4 with Cover Letter',
  },
  {
    id: 9,
    Company: 'Tesla',
    Location: 'Austin, TX',
    Title: 'SW Eng',
    Salary: '100k - 200k',
    Status: 'Active',
    lastAction: 'Applied',
    Comments: 'Used resume version 4 with Cover Letter',
  },
];

export default function Table() {
  return (
    <Box sx={{ height: '50rem', width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}
