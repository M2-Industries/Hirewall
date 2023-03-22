// import React, { useState, ChangeEvent } from 'react';
// import { DataGrid, GridColDef } from '@mui/x-data-grid';
// const SIZE = 10;

// interface Row {
//   id: number;
//   Date: string;
//   Action: string;
//   Notes?: string;
// }
// const columns: GridColDef[] = [
//   { field: 'id', headerName: 'ID', width: 90 },
//   {
//     field: 'Date',
//     headerName: 'Date',
//     width: 150,
//     editable: true,
//   },
//   {
//     field: 'Action',
//     headerName: 'Action',
//     width: 150,
//     editable: true,
//   },
//   {
//     field: 'Notes',
//     headerName: 'Notes',
//     width: 250,
//     editable: true,
//   },
// ];

// const defaultRows: Row[] = [
//   {
//     id: 1,
//     Date: '2/4/22',
//     Action: 'Applied',
//     Notes: '',
//   },
//   {
//     id: 2,
//     Date: '2/15/22',
//     Action: 'Sent Follow Up',
//     Notes: '',
//   },
//   {
//     id: 3,
//     Date: '2/20/22',
//     Action: 'Interview',
//     Notes: 'Phone Interview',
//   },
//   {
//     id: 4,
//     Date: '2/23/22',
//     Action: 'Interview',
//     Notes: 'Interview 1',
//   },
//   {
//     id: 5,
//     Date: '2/26/22',
//     Action: 'Interview',
//     Notes: 'Interview 2',
//   },
//   {
//     id: 6,
//     Date: '3/1/22',
//     Action: 'Offer',
//     Notes: 'Offered $250,000 w/ $50k sign-up bonus',
//   },
// ];
// // <Box sx={{ height: SIZE * 2 + 'rem', width: '100%' }}>
// //
// export default function Details() {
//   const [rows, setRows] = useState(defaultRows);
//   const [newRow, setNewRow] = useState<Row>({
//     id: 0,
//     Date: '',
//     Action: '',
//     Notes: '',
//   });

//   const handleAddRow = () => {
//     const newId = rows.length + 1;
//     setRows([...rows, { ...newRow, id: newId }]);
//     setNewRow({ id: 0, Date: '', Action: '', Notes: '' });
//   };
//   return (
//     <div className="details">
//       <DataGrid
//         rows={rows}
//         columns={columns}
//         initialState={{
//           pagination: {
//             paginationModel: {
//               pageSize: SIZE,
//             },
//           },
//         }}
//         pageSizeOptions={[5]}
//         checkboxSelection
//         disableRowSelectionOnClick
//         components={{
//           Footer: () => (
//             <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
//               <input
//                 type="text"
//                 placeholder="Enter Date"
//                 value={newRow.Date}
//                 onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                   setNewRow({ ...newRow, Date: e.target.value })
//                 }
//               />
//               <input
//                 type="text"
//                 placeholder="Enter Action"
//                 value={newRow.Action}
//                 onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                   setNewRow({ ...newRow, Action: e.target.value })
//                 }
//               />
//               <input
//                 type="text"
//                 placeholder="Enter Notes"
//                 value={newRow.Notes}
//                 onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                   setNewRow({ ...newRow, Notes: e.target.value })
//                 }
//               />
//               <button onClick={handleAddRow}>Save</button>
//             </div>
//           ),
//         }}
//       />
//     </div>
//   );
// }
