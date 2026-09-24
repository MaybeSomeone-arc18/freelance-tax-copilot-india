import {defineField, defineType} from 'sanity'

export const provision = defineType({
  name: 'provision',
  title: 'Provision (section)',
  type: 'document',
  description: 'One section of a statute. Links old-law sections to their new-law equivalent.',
  fields: [
    defineField({name: 'statute', type: 'reference', to: [{type: 'statute'}], validation: (r) => r.required()}),
    defineField({name: 'section', type: 'string', description: 'e.g. "58", "44ADA", "22(1)"', validation: (r) => r.required()}),
    defineField({name: 'heading', type: 'string'}),
    defineField({name: 'correspondsTo', title: 'Corresponds to (other statute)', type: 'array', of: [{type: 'reference', to: [{type: 'provision'}]}], description: 'e.g. ITA 2025 s.58 <-> ITA 1961 s.44AD/44ADA/44AE'}),
    defineField({name: 'excerpt', title: 'Verbatim excerpt', type: 'text', rows: 8}),
    defineField({name: 'plainEnglish', type: 'text', rows: 4}),
    defineField({name: 'source', type: 'reference', to: [{type: 'sourceDocument'}], validation: (r) => r.required()}),
    defineField({name: 'pinpoint', type: 'string', description: 'Page / table row, e.g. "Table, Sl. No. 3"'}),
  ],
  preview: {
    select: {section: 'section', heading: 'heading', law: 'statute.shortName'},
    prepare: ({section, heading, law}) => ({title: `${law ?? ''} s.${section}`, subtitle: heading}),
  },
})
