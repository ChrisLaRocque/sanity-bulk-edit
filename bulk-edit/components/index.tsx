import {useEffect, useCallback, useState} from 'react'
import {PublishIcon, UnpublishIcon} from '@sanity/icons'
import {useGridApiRef, type GridRowSelectionModel} from '@mui/x-data-grid'
import {Card, Container, Stack, Heading, Text, Flex, Button, useToast} from '@sanity/ui'
import DataTable from './table'
import {SanityDocument, useClient, useDataset, useProjectId, useSchema} from 'sanity'

// Perspective is 'raw' by default
// TODO fix any
function previewDrafts(docs: any[]) {
  // At this point I should just set up a non-useClient client with perspectives?
  const draftDocIds = docs.filter(({_id}) => _id.startsWith('drafts.')).map(({_id}) => _id.slice(7))
  const filteredDocs = docs.filter(({_id}) => !draftDocIds.includes(_id))
  return filteredDocs.map((doc) => {
    // Clear out "drafts." from IDs
    return {
      ...doc,
      id: removeDraftFromIds(doc.id),
      _id: removeDraftFromIds(doc._id),
    }
  })
}

function removeDraftFromIds(_id: string) {
  if (_id.startsWith('drafts.')) {
    return _id.slice(7)
  }
  return _id
}

// Format selected IDs for Sanity Publishing API
function format(arr: GridRowSelectionModel) {
  return arr.map((_id) => {
    return {
      documentId: _id,
    }
  })
}

export default function BulkEdit() {
  const [rows, setRows] = useState<SanityDocument[]>([])
  const [selected, setSelected] = useState<GridRowSelectionModel>([])
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  // Sanity toast for notifications
  const toast = useToast()

  // Modify table state
  const apiRef = useGridApiRef()

  // Get Sanity schema info
  const schema = useSchema()
  const schemaTypes = schema.getTypeNames()
  const pid = useProjectId()
  const dataset = useDataset()

  // Initialize Sanity client
  const client = useClient({apiVersion: '2024-04-21'})

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
      setRows(previewDrafts(res))
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
          body: format(selected),
        })
        .then((data) => {
          console.log(`${action} completed`, data)
          toast.push({
            status: 'success',
            title: 'Success',
          })
          setSelected([])
          // reset table
          fetchTable()
        })
        .catch((error) => {
          console.error('Error publish/unpublishing', error)
          toast.push({
            status: 'error',
            title: 'Error, please try again',
          })
        })
      // there has to be a better way
    },
    [dataset, pid, client, selected, fetchTable, toast],
  )

  // If no row data
  useEffect(() => {
    if (rows.length || error) return
    fetchTable()
  }, [fetchTable, rows, error])

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
              onClick={(e) => modifyDocuments('unpublish')}
              disabled={!selected.length || loading}
            />
            <Button
              text="Publish"
              icon={PublishIcon}
              onClick={(e) => modifyDocuments('publish')}
              disabled={!selected.length || loading}
            />
          </Flex>
        </Card>
        <Card>
          {error ? (
            <Text>
              No available schema types in <code>sanity.config</code> file
            </Text>
          ) : (
            <DataTable rows={rows} selected={selected} setSelected={setSelected} apiRef={apiRef} />
          )}
        </Card>
      </Stack>
    </Container>
  )
}
