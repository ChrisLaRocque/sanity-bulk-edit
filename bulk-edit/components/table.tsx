import {
  DataGrid,
  GridColDef,
  GridInputRowSelectionModel,
  GridRowSelectionModel,
} from '@mui/x-data-grid'
import {GridApiCommunity} from '@mui/x-data-grid/internals'
import {Dispatch, MutableRefObject, SetStateAction} from 'react'
import {SanityDocument} from 'sanity'

// Column config
const columns: GridColDef[] = [
  {field: 'title', headerName: 'Title', width: 170},
  {field: '_type', headerName: 'Type', width: 170},
  {field: '_updatedAt', headerName: 'Updated at', width: 260},
  {field: 'id', headerName: 'ID', width: 260},
]

export default function DataTable({
  rows,
  selected,
  setSelected,
  apiRef,
}: {
  rows: SanityDocument[]
  selected: GridInputRowSelectionModel
  setSelected: Dispatch<SetStateAction<GridRowSelectionModel>>
  apiRef: MutableRefObject<GridApiCommunity>
}) {
  return (
    <div style={{height: `75vh`, width: '100%'}}>
      <DataGrid
        ref={apiRef}
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {page: 0, pageSize: 10},
          },
        }}
        pageSizeOptions={[10, 25, 50]}
        checkboxSelection
        onRowSelectionModelChange={(newRowSelectionModel) => {
          setSelected(newRowSelectionModel)
        }}
        rowSelectionModel={selected}
      />
    </div>
  )
}
