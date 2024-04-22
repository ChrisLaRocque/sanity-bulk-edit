import {useEffect, useCallback, useState} from 'react'
import {Card, Container, Stack, Heading, Text} from '@sanity/ui'
import DataTable from './table'
import {SanityDocument, useClient, useSchema} from 'sanity'
// function inferStatus(docs: SanityDocument[]) {
//   return previewDrafts(
//     docs.map((doc) => {
//       const {_id} = doc
//       const isDraft = _id.startsWith('drafts.')
//       return doc
//     }),
//   )
// }
function previewDrafts(docs: SanityDocument[]) {
  // At this point I should just set up a non-useClient client with perspectives?
  const draftDocIds = docs.filter(({_id}) => _id.startsWith('drafts.')).map(({_id}) => _id.slice(7))
  const filteredDocs = docs.filter(({_id}) => !draftDocIds.includes(_id))
  return filteredDocs
}
export default function BulkEdit() {
  const [rows, setRows] = useState<SanityDocument[]>([])
  const [selected, setSelected] = useState<SanityDocument[]>([])
  const [error, setError] = useState(false)

  // Get Sanity schema info
  const schema = useSchema()
  const schemaTypes = schema.getTypeNames()

  // Initialize Sanity client
  const client = useClient({apiVersion: '2024-04-21'})

  // unpublish document
  //   const unpublishDocument = async () => {}

  // Fetch data for table rows
  const fetchTable = useCallback(async () => {
    if (!schemaTypes?.length) return setError(true)
    try {
      const res = await client.fetch<SanityDocument[]>(
        `*[_type in $schemaTypes]{title, _id, _updatedAt, "id":_id}`,
        {
          schemaTypes,
        },
      )

      //   inferStatus(res)
      setRows(previewDrafts(res))
    } catch (e) {
      console.error('Error fetching row data', error)
      setError(true)
    }
  }, [client, error, schemaTypes])

  // If no row data
  useEffect(() => {
    if (rows.length || error) return
    fetchTable()
  }, [fetchTable, rows, error])

  // unpublishing:
  // if just _id (no draft. version) change _id to drafts._id
  // if _id && drafts._id => delete non-draft version
  return (
    <Container>
      <Stack space={4} padding={4}>
        <Card>
          <Heading>Bulk edit</Heading>
        </Card>
        <Card>
          {error ? (
            <Text>
              No available schema types in <code>sanity.config</code> file
            </Text>
          ) : (
            <DataTable rows={rows} selected={selected} setSelected={setSelected} />
          )}
        </Card>
      </Stack>
    </Container>
  )
}
