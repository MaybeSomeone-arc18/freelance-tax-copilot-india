import {defineField, defineType} from 'sanity'

export const conflict = defineType({
  name: 'conflict',
  title: 'Conflict',
  type: 'document',
  description: 'A place where sources disagree, and which one wins (with why).',
  fields: [
    defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'claim', title: 'The wrong / outdated claim', type: 'text', rows: 3}),
    defineField({name: 'claimSource', type: 'reference', to: [{type: 'sourceDocument'}]}),
    defineField({name: 'correct', title: 'What actually applies', type: 'text', rows: 3}),
    defineField({name: 'winningRule', type: 'reference', to: [{type: 'rule'}]}),
    defineField({name: 'why', type: 'text', rows: 3, description: 'e.g. "Statute beats blog", "newer tax year", "Act renumbered"'}),
    defineField({name: 'status', type: 'string', options: {list: ['resolved', 'open']}, initialValue: 'resolved'}),
  ],
})
