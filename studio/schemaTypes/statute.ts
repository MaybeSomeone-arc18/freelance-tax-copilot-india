import {defineField, defineType} from 'sanity'

export const statute = defineType({
  name: 'statute',
  title: 'Statute',
  type: 'document',
  fields: [
    defineField({name: 'name', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'shortName', type: 'string', description: 'e.g. "ITA 2025", "CGST Act"'}),
    defineField({name: 'taxType', type: 'string', options: {list: ['income-tax', 'gst']}, validation: (r) => r.required()}),
    defineField({name: 'inForceFrom', type: 'date'}),
    defineField({name: 'inForceUntil', type: 'date', description: 'Leave empty if still in force'}),
    defineField({name: 'replacedBy', type: 'reference', to: [{type: 'statute'}]}),
    defineField({name: 'officialSource', type: 'reference', to: [{type: 'sourceDocument'}]}),
  ],
  preview: {select: {title: 'name', subtitle: 'shortName'}},
})
