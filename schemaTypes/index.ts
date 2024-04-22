import {defineType, defineField} from 'sanity'

export const schemaTypes = [
  defineType({
    name: 'blogPost',
    type: 'document',
    fields: [
      defineField({
        name: 'title',
        type: 'string',
      }),
    ],
  }),
  defineType({
    name: 'page',
    type: 'document',
    fields: [
      defineField({
        name: 'title',
        type: 'string',
      }),
    ],
  }),
]
