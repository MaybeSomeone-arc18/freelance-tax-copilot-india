import {defineField, defineType} from 'sanity'

export const deadline = defineType({
  name: 'deadline',
  title: 'Deadline',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'taxYear', type: 'reference', to: [{type: 'taxYear'}], validation: (r) => r.required()}),
    defineField({name: 'dueDate', type: 'date', validation: (r) => r.required()}),
    defineField({name: 'whatIsDue', type: 'text', rows: 2}),
    defineField({name: 'cumulativePercent', type: 'number', description: 'For advance-tax instalments'}),
    defineField({name: 'appliesTo', type: 'array', of: [{type: 'string'}]}),
    defineField({name: 'rule', type: 'reference', to: [{type: 'rule'}]}),
    defineField({name: 'source', type: 'reference', to: [{type: 'sourceDocument'}]}),
  ],
  orderings: [{title: 'Due date', name: 'due', by: [{field: 'dueDate', direction: 'asc'}]}],
  preview: {select: {title: 'title', subtitle: 'dueDate'}},
})
