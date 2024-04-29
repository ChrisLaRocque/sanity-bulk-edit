import {useEffect, useCallback, useState} from 'react'
import {SanityDocument, useClient, useDataset, useProjectId, useSchema} from 'sanity'
import {Card, Container, Stack, Heading, Text, Flex, Button, useToast} from '@sanity/ui'
import {PublishIcon, UnpublishIcon} from '@sanity/icons'
import {type GridRowSelectionModel} from '@mui/x-data-grid'
import DataTable from './table'

// Format selected IDs for Sanity Publishing API
function format(arr: GridRowSelectionModel) {
  return arr.map((_id) => {
    return {
      documentId: _id,
    }
  })
}
// need to implement rowCount + sortOrder
// function paginationOffset(paginationModel: GridPaginationModel) {
//   const {page, pageSize} = paginationModel
//   // In GROQ offsets look like [index...numberOfItemsToFetch], if we wanted both to be an index we'd use 2 periods like [startIndex..endIndex]
//   if (page == 0) {
//     return `[${page}...${pageSize}]`
//   }
//   const index = page * pageSize - 1
//   return `[${index}...${pageSize}]`
// }

export default function BulkEdit() {
  // Table state
  const [rows, setRows] = useState<SanityDocument[]>([])
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]) // which table rows are selected

  // Data loading state
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
  const query = `*[_type in $schemaTypes] | order(_updatedAt desc){title, _id, _updatedAt, _type, "id": _id}`

  // const getDocumentStatus = useCallback(async () => {
  //   const documentStatus = {}
  //   await client
  //     .withConfig({perspective: 'raw'})
  //     .fetch(query, {schemaTypes})
  //     .then((res) => {
  //       const ids = res.map(({_id}) => _id)
  //       const drafts = ids.filter((_id) => _id.startsWith('drafts.'))
  //       const published = ids.filter((_id) => !drafts.includes(_id))
  //       published.map((_id) => {
  //         return (documentStatus[_id] = 'Published')
  //       })
  //       drafts.map((_id) => {
  //         const rawId = _id.substr(7)
  //         // If draft + published, changed
  //         if (ids.includes(rawId)) {
  //           return (documentStatus[rawId] = 'Changed')
  //         } else {
  //           return (documentStatus[rawId] = 'Draft')
  //         }
  //       })
  //     })
  //   console.log(documentStatus)
  // }, [client, query, schemaTypes])

  // Fetch data for table rows
  const fetchTable = useCallback(async () => {
    setLoading(true)
    try {
      const res = await client.fetch<SanityDocument[]>(query, {
        schemaTypes,
      })

      setRows(res)
    } catch (e) {
      console.error('Error fetching row data', e)
      toast.push({
        status: 'error',
        title: 'Error fetching table data, check console for more info.',
      })
    }
    setLoading(false)
  }, [client, schemaTypes, query, toast])

  // Modify document publish state
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
          setRowSelectionModel([]) // Clear selected rows
          fetchTable() // re-fetch table data
        })
        .catch((error) => {
          console.error('Error publish/unpublishing', error)
          toast.push({
            status: 'error',
            title: 'Error, please try again',
          })
        })
      setLoading(false)
    },
    [dataset, pid, client, rowSelectionModel, fetchTable, toast],
  )

  // If no row data
  useEffect(() => {
    if (rows.length || !schemaTypes.length) return
    fetchTable()
  }, [fetchTable, rows, schemaTypes])

  return (
    <Container>
      <Stack space={4} padding={4}>
        <Card>
          <Flex justify={'space-between'} align="center">
            <Heading>Bulk edit</Heading>
            <Flex justify={'flex-end'} align="center" gap={1}>
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
          </Flex>
        </Card>
        <Card>
          {!schemaTypes.length ? (
            <Text>
              No available schema types in <code>sanity.config</code> file
            </Text>
          ) : (
            <DataTable
              {...{
                rows,
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
