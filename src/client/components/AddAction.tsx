// interface EditToolbarProps {
//   setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
//   setRowModesModel: (
//     newModel: (oldModel: GridRowModesModel) => GridRowModesModel
//   ) => void;
// }
// function EditToolbar(props: EditToolbarProps) {
//   const { setRows, setRowModesModel } = props;

//   const handleClick = () => {
//     const key = randomInteger();
//     setRows((oldRows) => [
//       ...oldRows,
//       { myUniqueKey: key, age: "1", isNew: true }
//     ]);

//     setRowModesModel((oldModel) => ({
//       ...oldModel,
//       [key]: { mode: GridRowModes.Edit, fieldToFocus: "name" }
//     }));
//   };

//   return (
//     <GridToolbarContainer>
//       <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
//         Add record
//       </Button>
//     </GridToolbarContainer>
//   );
// }
