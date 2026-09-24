import {defineField, defineType} from 'sanity'

export const AUTHORITY = [
  {title: 'Statute (Act of Parliament)', value: 'statute'},
  {title: 'Rules / notification', value: 'notification'},
  {title: 'Circular / instruction', value: 'circular'},
  {title: 'Official FAQ / guide', value: 'official-guide'},
  {title: 'Secondary (blog, news, CA firm)', value: 'secondary'},
]

export const sourceDocument = defineType({
  name: 'sourceDocument',
  title: 'Source document',
  type: 'document',
  description: 'Where a fact comes from. Authority level decides who wins when sources disagree.',
  fields: [
    defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'issuer', type: 'string', description: 'e.g. Parliament, CBDT, CBIC, GST Council, a blog'}),
    defineField({name: 'authority', type: 'string', options: {list: AUTHORITY, layout: 'radio'}, validation: (r) => r.required()}),
    defineField({name: 'url', type: 'url'}),
    defineField({name: 'reference', type: 'string', description: 'Notification / circular number, e.g. "Notification 10/2017-Integrated Tax"'}),
    defineField({name: 'publishedOn', type: 'date'}),
    defineField({name: 'retrievedOn', type: 'date'}),
    defineField({name: 'file', type: 'file', description: 'Archived copy (PDF)'}),
    defineField({name: 'summary', type: 'text', rows: 4}),
  ],
  preview: {select: {title: 'title', subtitle: 'authority'}},
})
