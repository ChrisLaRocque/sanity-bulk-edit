# Sanity Bulk Edit example

An example of using [@mui/x-data-grid](https://mui.com/x/react-data-grid/) to manage content in Sanity.

## Usage

The contents of `/bulk-edit` can be copied into your project, then just add the exported tool to your Sanity config:

```typescript
import {defineConfig} from 'sanity'
import {bulkEdit} from './bulk-edit'

export default defineConfig({
  // ...rest of your config file
  tools: [bulkEdit()],
})
```

And install the needed dependencies

```bash
npm install @mui/x-data-grid @mui/material @emotion/react @emotion/styled
```

Check out the [@mui/x-data-grid installation guide](https://mui.com/x/react-data-grid/getting-started/#installation) for more info

## Example usage

![example of table in use](example.png)

## What it does

Right now it loads all documents in a Content Lake into a table that can be filtered/sorted. The documents can be selected for bulk publish/unpublish.

## Why not a plugin?

There's so much variation in what folks want out of a table, it would be tough to maintain a plugin like this that covers all use cases. Hopefully this can provide users a good starting point, which can then be expanded by wiring up additional parts of the @mui/x-data-grid APIs to Sanity's APIs.
