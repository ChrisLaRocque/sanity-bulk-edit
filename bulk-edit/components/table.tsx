import {DataGrid, GridColDef} from '@mui/x-data-grid'
import {Dispatch, SetStateAction} from 'react'
import {SanityDocument} from 'sanity'

const columns: GridColDef[] = [
  {field: 'title', headerName: 'Title', width: 170},
  {field: '_updatedAt', headerName: 'Updated at', width: 260},
  {field: 'id', headerName: 'ID', width: 260},

  //   {
  //     field: 'fullName',
  //     headerName: 'Full name',
  //     description: 'This column has a value getter and is not sortable.',
  //     sortable: false,
  //     width: 160,
  //     valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
  //   },
]

export default function DataTable({
  rows,
  selected,
  setSelected,
}: {
  rows: SanityDocument[]
  selected: string[]
  setSelected: Dispatch<SetStateAction<string[] | never[]>>
}) {
  return (
    <div style={{height: 400, width: '100%'}}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {page: 0, pageSize: 5},
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        onCellClick={(p) => {
          const {field, row, value} = p
          // Return early for all fields but the checkbox
          if (field !== '__check__') return
          // The table returns 'false' if selected?
          // If selected, add row to selected
          if (!value) {
            return setSelected([...selected, row.id])
          }
          // If un-selected, return array w/o item
          const filteredSelected = selected.filter((id) => id !== row.id)
          return setSelected(filteredSelected)
        }}
      />
    </div>
  )
}
