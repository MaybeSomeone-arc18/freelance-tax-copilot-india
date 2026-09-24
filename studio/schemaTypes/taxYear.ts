import {defineField, defineType} from 'sanity'

export const taxYear = defineType({
  name: 'taxYear',
  title: 'Tax year',
  type: 'document',
  description: 'An Indian financial year (1 April - 31 March). Every rule is pinned to the years it applies to.',
  fields: [
    defineField({name: 'label', type: 'string', description: 'e.g. "FY 2026-27"', validation: (r) => r.required()}),
    defineField({name: 'code', type: 'string', description: 'Machine key, e.g. "2026-27"', validation: (r) => r.required().regex(/^\d{4}-\d{2}$/)}),
    defineField({name: 'startDate', type: 'date', validation: (r) => r.required()}),
    defineField({name: 'endDate', type: 'date', validation: (r) => r.required()}),
    defineField({
      name: 'incomeTaxLaw',
      title: 'Governing income-tax statute',
      type: 'reference',
      to: [{type: 'statute'}],
      description: 'FY 2025-26 and earlier: Income-tax Act, 1961. FY 2026-27 onward: Income-tax Act, 2025.',
    }),
    defineField({name: 'assessmentYearLabel', type: 'string', description: 'Old-law term, e.g. "AY 2026-27". The 2025 Act drops "assessment year" and uses "tax year".'}),
    defineField({name: 'notes', type: 'text', rows: 3}),
  ],
  orderings: [{title: 'Newest first', name: 'startDesc', by: [{field: 'startDate', direction: 'desc'}]}],
  preview: {select: {title: 'label', subtitle: 'assessmentYearLabel'}},
})
