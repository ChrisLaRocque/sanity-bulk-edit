import {
  DataGrid,
  GridColDef,
  GridInputRowSelectionModel,
  GridRowSelectionModel,
} from '@mui/x-data-grid'
// import {GridApiCommunity} from '@mui/x-data-grid/internals'
import {Dispatch, MutableRefObject, SetStateAction} from 'react'
import {SanityDocument} from 'sanity'

// Column config
const columns: GridColDef[] = [
  {field: 'title', headerName: 'Title', width: 170},
  {field: '_type', headerName: 'Type', width: 170},
  {field: '_updatedAt', headerName: 'Updated at', width: 260},
  {field: 'id', headerName: 'ID', width: 260},
]
type PaginationModel = {pageSize: number; page: number}

export default function DataTable(data: {
  rows: SanityDocument[]
  rowSelectionModel: GridInputRowSelectionModel
  setRowSelectionModel: Dispatch<SetStateAction<GridRowSelectionModel>>
  // apiRef: MutableRefObject<GridApiCommunity>
  paginationModel: PaginationModel
  setPaginationModel: Dispatch<SetStateAction<PaginationModel>>
}) {
  const {setRowSelectionModel, setPaginationModel} = data
  return (
    <div style={{height: `75vh`, width: '100%'}}>
      <DataGrid
        {...data}
        columns={columns}
        pageSizeOptions={[10, 25, 50]}
        checkboxSelection
        onPaginationModelChange={setPaginationModel}
        onRowSelectionModelChange={(newRowSelectionModel) => {
          setRowSelectionModel(newRowSelectionModel)
        }}
      />
    </div>
  )
}
