import React, { useState, ChangeEvent } from 'react';
import {
  DataGrid,
  GridColDef,
  GridRowId,
  GridRowModesModel,
  GridRowModes,
  GridToolbarContainer,
  GridEventListener,
  MuiEvent,
  GridRowParams,
  GridActionsCellItem,
  GridRowModel,
} from '@mui/x-data-grid';
import { IconButton, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const SIZE = 10;

interface Row {
  id: number;
  Date: string;
  Action: string;
  Notes?: string;
}
const defaultRows = [
  {
    id: 1,
    Date: '2/4/22',
    Action: 'Applied',
    Notes: '',
  },
  {
    id: 2,
    Date: '2/15/22',
    Action: 'Sent Follow Up',
    Notes: '',
  },
  {
    id: 3,
    Date: '2/20/22',
    Action: 'Interview',
    Notes: 'Phone Interview',
  },
  {
    id: 4,
    Date: '2/23/22',
    Action: 'Interview',
    Notes: 'Interview 1',
  },
  {
    id: 5,
    Date: '2/26/22',
    Action: 'Interview',
    Notes: 'Interview 2',
  },
  {
    id: 6,
    Date: '3/1/22',
    Action: 'Offer',
    Notes: 'Offered $250,000 w/ $50k sign-up bonus',
  },
];

// <Box sx={{ height: SIZE * 2 + 'rem', width: '100%' }}>
//
export default function Actions() {
  const [rows, setRows] = useState(defaultRows);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [editedRow, setEditedRow] = useState(null);
  //<Row | null>
  const handleRowEditStart = (
    params: GridRowParams,
    event: MuiEvent<React.SyntheticEvent>
  ) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (
    params,
    event
  ) => {
    event.defaultMuiPrevented = true;
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };
  const handleDeleteClick = (id: GridRowId) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id: GridRowId) => () => {
    if (rowModesModel[id]?.mode === GridRowModes.Edit) {
      setRows(rows.filter((row) => row.id !== id));
      setRowModesModel((oldModel) => {
        const { [id]: _, ...rest } = oldModel;
        return rest;
      });
    } else {
      setRowModesModel({
        ...rowModesModel,
        [id]: { mode: GridRowModes.View, ignoreModifications: true },
      });
    }
  };
  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = {
      id: newRow.id,
      Date: newRow.Date || '',
      Action: newRow.Action || '',
      Notes: newRow.Notes || '',
    };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return newRow;
  };
  const handleClick = () => {
    const key = rows.length + 1;
    const newRow = {
      id: key,
      Date: '',
      Action: '',
      Notes: '',
    };
    setRows((oldRows) => [...oldRows, newRow]);

    setRowModesModel((oldModel) => ({
      ...oldModel,
      [key]: { mode: GridRowModes.Edit, fieldToFocus: 'Date' },
    }));
  };
  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'Date',
      headerName: 'Date',
      width: 150,
      editable: true,
    },
    {
      field: 'Action',
      headerName: 'Action',
      width: 150,
      editable: true,
    },
    {
      field: 'Notes',
      headerName: 'Notes',
      width: 400,
      editable: true,
    },
    {
      field: 'Edit',
      type: 'actions',
      headerName: 'Edit',
      width: 150,
      getActions: ({ id }: any) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];
  const addAction = () => {
    return (
      <GridToolbarContainer>
        <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
          Add Action
        </Button>
      </GridToolbarContainer>
    );
  };
  return (
    <div className="actions">
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
        rowModesModel={rowModesModel}
        onRowEditStart={handleRowEditStart}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
        components={{
          Toolbar: addAction,
        }}
        // experimentalFeatures={{ newEditingApi: true }}
      />
    </div>
  );
}
