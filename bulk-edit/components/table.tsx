import {
  DataGrid,
  GridColDef,
  GridInputRowSelectionModel,
  GridRowSelectionModel,
} from '@mui/x-data-grid'
import {Dispatch, SetStateAction} from 'react'
import {SanityDocument} from 'sanity'

// Column config
const columns: GridColDef[] = [
  {field: 'title', headerName: 'Title', width: 170},
  {field: '_type', headerName: 'Type', width: 170},
  {field: '_updatedAt', headerName: 'Updated at', width: 260},
  {field: 'id', headerName: 'ID', width: 260},
]

export default function DataTable(data: {
  rows: SanityDocument[]
  rowSelectionModel: GridInputRowSelectionModel
  setRowSelectionModel: Dispatch<SetStateAction<GridRowSelectionModel>>
}) {
  const {setRowSelectionModel} = data
  return (
    <div style={{width: '100%'}}>
      <DataGrid
        {...data}
        columns={columns}
        initialState={{
          pagination: {paginationModel: {pageSize: 5}},
        }}
        pageSizeOptions={[5, 10, 25, 50]}
        checkboxSelection
        onRowSelectionModelChange={(newRowSelectionModel) => {
          setRowSelectionModel(newRowSelectionModel)
        }}
      />
    </div>
  )
}
