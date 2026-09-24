import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {contextPlugin} from '@sanity/context/studio'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Freelance Tax Copilot',
  projectId: '7i4i5k0j',
  dataset: 'production',
  plugins: [structureTool(), visionTool(), contextPlugin()],
  schema: {types: schemaTypes},
})
