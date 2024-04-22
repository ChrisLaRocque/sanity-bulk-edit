import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {myCustomTool} from './bulk-edit'

export default defineConfig({
  name: 'default',
  title: 'Bulk edit',

  projectId: import.meta.env.SANITY_STUDIO_PROJECT_ID,
  dataset: 'production',

  plugins: [structureTool(), visionTool()],
  tools: [myCustomTool()],

  schema: {
    types: schemaTypes,
  },
})
