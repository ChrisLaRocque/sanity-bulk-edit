import {useEffect, useCallback, useState} from 'react'
import {PublishIcon, UnpublishIcon} from '@sanity/icons'
import {type GridRowSelectionModel} from '@mui/x-data-grid'
import {Card, Container, Stack, Heading, Text, Flex, Button, useToast} from '@sanity/ui'
import DataTable from './table'
import {SanityDocument, useClient, useDataset, useProjectId, useSchema} from 'sanity'

// Format selected IDs for Sanity Publishing API
function format(arr: GridRowSelectionModel) {
  return arr.map((_id) => {
    return {
      documentId: _id,
    }
  })
}

export default function BulkEdit() {
  // Table state
  const [rows, setRows] = useState<SanityDocument[]>([])
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]) // which table rows are selected
  const [paginationModel, setPaginationModel] = useState<{pageSize: number; page: number}>({
    pageSize: 5,
    page: 0,
  }) // pagination info

  // Data loading state
  const [error, setError] = useState(false) // if there's an error with config or data fetches/manipulation
  const [loading, setLoading] = useState(true) // when fetching/manipulation is in progress

  // Sanity toast for notifications
  const toast = useToast()

  // Get Sanity project info
  const schema = useSchema()
  const schemaTypes = schema.getTypeNames()
  const pid = useProjectId()
  const dataset = useDataset()

  // Initialize Sanity client
  const client = useClient({apiVersion: '2024-04-21'}).withConfig({perspective: 'previewDrafts'})

  // Fetch data for table rows
  const fetchTable = useCallback(async () => {
    if (!schemaTypes?.length) return setError(true)
    try {
      const res = await client.fetch<SanityDocument[]>(
        `*[_type in $schemaTypes]{title, _id, _updatedAt, _type, "id": _id}`,
        {
          schemaTypes,
        },
      )
      setRows(res)
      setLoading(false)
    } catch (e) {
      console.error('Error fetching row data', error)
      setError(true)
    }
  }, [client, error, schemaTypes])

  // Modify documents
  const modifyDocuments = useCallback(
    async (action: 'publish' | 'unpublish') => {
      setLoading(true)
      await client
        .request({
          method: 'POST',
          uri: `/${action}/${pid}/${dataset}`,
          body: format(rowSelectionModel),
        })
        .then((data) => {
          console.log(`${action} completed`, data)
          toast.push({
            status: 'success',
            title: 'Success',
          })
          setRowSelectionModel([])
          fetchTable()
        })
        .catch((error) => {
          console.error('Error publish/unpublishing', error)
          toast.push({
            status: 'error',
            title: 'Error, please try again',
          })
        })
    },
    [dataset, pid, client, rowSelectionModel, fetchTable, toast],
  )

  // If no row data
  useEffect(() => {
    if (rows.length || error) return
    fetchTable()
  }, [fetchTable, rows, error])

  // Use this to fetch data per page
  useEffect(() => console.log('page', paginationModel), [paginationModel])
  return (
    <Container>
      <Stack space={4} padding={4}>
        <Card>
          <Heading>Bulk edit</Heading>
        </Card>
        <Card>
          <Flex justify={'flex-end'} gap={1}>
            <Button
              text="Unpublish"
              icon={UnpublishIcon}
              onClick={() => modifyDocuments('unpublish')}
              disabled={!rowSelectionModel.length || loading}
            />
            <Button
              text="Publish"
              icon={PublishIcon}
              onClick={() => modifyDocuments('publish')}
              disabled={!rowSelectionModel.length || loading}
            />
          </Flex>
        </Card>
        <Card>
          {error ? (
            <Text>
              No available schema types in <code>sanity.config</code> file
            </Text>
          ) : (
            <DataTable
              {...{
                rows,
                // apiRef,
                paginationModel,
                setPaginationModel,
                rowSelectionModel,
                setRowSelectionModel,
              }}
            />
          )}
        </Card>
      </Stack>
    </Container>
  )
}
