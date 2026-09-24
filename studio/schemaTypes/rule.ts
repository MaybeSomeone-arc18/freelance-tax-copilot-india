import {defineArrayMember, defineField, defineType} from 'sanity'

export const TOPICS = [
  {title: 'Presumptive taxation', value: 'presumptive'},
  {title: 'Income-tax slabs & rebate', value: 'slabs'},
  {title: 'Advance tax', value: 'advance-tax'},
  {title: 'TDS on professional fees', value: 'tds'},
  {title: 'Tax audit & books', value: 'audit'},
  {title: 'GST registration', value: 'gst-registration'},
  {title: 'GST on export of services', value: 'gst-export'},
  {title: 'Filing & deadlines', value: 'filing'},
]

export const rule = defineType({
  name: 'rule',
  title: 'Rule',
  type: 'document',
  description: 'A single, checkable tax rule: who it applies to, from when, the numbers, and the law behind it.',
  groups: [
    {name: 'what', title: 'What', default: true},
    {name: 'when', title: 'When'},
    {name: 'numbers', title: 'Numbers'},
    {name: 'proof', title: 'Proof'},
  ],
  fields: [
    defineField({name: 'title', type: 'string', group: 'what', validation: (r) => r.required()}),
    defineField({name: 'topic', type: 'string', group: 'what', options: {list: TOPICS}, validation: (r) => r.required()}),
    defineField({name: 'appliesTo', type: 'array', group: 'what', of: [{type: 'string'}], options: {list: ['resident-individual', 'freelance-professional', 'business', 'service-exporter', 'any-person']}}),
    defineField({name: 'statement', title: 'Rule in one paragraph', type: 'text', rows: 4, group: 'what', validation: (r) => r.required()}),
    defineField({
      name: 'conditions',
      type: 'array',
      group: 'what',
      description: 'Every condition must hold for the rule to apply.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'condition',
          fields: [
            defineField({name: 'fact', type: 'string', description: 'e.g. grossReceipts, cashReceiptsShare, taxRegime, supplyType'}),
            defineField({name: 'operator', type: 'string', options: {list: ['<=', '<', '>=', '>', '==', '!=', 'in']}}),
            defineField({name: 'value', type: 'string'}),
            defineField({name: 'explain', type: 'string'}),
          ],
          preview: {select: {f: 'fact', o: 'operator', v: 'value'}, prepare: ({f, o, v}) => ({title: `${f} ${o} ${v}`})},
        }),
      ],
    }),
    defineField({name: 'validFrom', type: 'reference', to: [{type: 'taxYear'}], group: 'when', validation: (r) => r.required()}),
    defineField({name: 'validUntil', type: 'reference', to: [{type: 'taxYear'}], group: 'when', description: 'Last tax year the rule applies. Empty = still current.'}),
    defineField({name: 'supersedes', type: 'reference', to: [{type: 'rule'}], group: 'when'}),
    defineField({
      name: 'amounts',
      type: 'array',
      group: 'numbers',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'amount',
          fields: [
            defineField({name: 'label', type: 'string'}),
            defineField({name: 'inr', title: 'Amount (INR)', type: 'number'}),
            defineField({name: 'percent', type: 'number'}),
          ],
          preview: {select: {title: 'label', inr: 'inr', p: 'percent'}, prepare: ({title, inr, p}) => ({title, subtitle: inr != null ? `₹${inr.toLocaleString('en-IN')}` : p != null ? `${p}%` : ''})},
        }),
      ],
    }),
    defineField({name: 'provisions', type: 'array', group: 'proof', of: [{type: 'reference', to: [{type: 'provision'}]}], validation: (r) => r.min(1)}),
    defineField({name: 'sources', type: 'array', group: 'proof', of: [{type: 'reference', to: [{type: 'sourceDocument'}]}], validation: (r) => r.min(1)}),
    defineField({name: 'gotchas', type: 'array', group: 'proof', of: [{type: 'string'}], description: 'Common mistakes people make with this rule'}),
  ],
  preview: {select: {title: 'title', topic: 'topic', from: 'validFrom.label'}, prepare: ({title, topic, from}) => ({title, subtitle: `${topic} · from ${from ?? '?'}`})},
})
