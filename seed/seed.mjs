import {createClient} from '@sanity/client'
import {docs} from './data.mjs'
const client = createClient({projectId: '7i4i5k0j', dataset: 'production', apiVersion: '2025-02-19', token: process.env.SANITY_TOKEN, useCdn: false})
const clean = (o) => JSON.parse(JSON.stringify(o))
let tx = client.transaction()
for (const d of docs) tx = tx.createOrReplace(clean(d))
const res = await tx.commit()
console.log('committed', res.results.length, 'docs')
