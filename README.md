# freelance tax copilot (india)

an agent that answers tax questions for indian freelancers (devs, designers, consultants, often with foreign clients) - only from structured, cited content in sanity.

built for the DEV x Sanity challenge (path 1: agent that queries real content).

## why

the income-tax act, 2025 replaced the 1961 act from 1 april 2026 and renumbered everything. most guides online still say "44ADA", "194J", "44AB". gst rules for export of services also changed in oct 2023. so a lot of what freelancers read is stale or mixed up. this agent resolves the tax year first, maps old section numbers to new ones, and says out loud when two rules conflict.

## how it works

- `studio/` - sanity studio. schema: `taxYear`, `statute`, `provision` (with old->new mapping), `rule`, `conflict`, `deadline`, `sourceDocument`. every rule points to provisions and official sources.
- `seed/` - the structured dataset (project `7i4i5k0j`, dataset `production`, public).
- sanity context knowledge base built from the dataset plus official pages/PDFs (income tax dept, cbic).
- `agent/` - next.js + vercel ai sdk. connects to the sanity context MCP endpoint (`groq_query`, `schema_explorer`), injects initial context into the prompt, and answers with inline citations. if the dataset doesn't cover something, it says so.
- `research/facts.md` - extracted facts with source urls.

## run

```
cd agent && cp .env.example .env.local   # fill in a sanity viewer token + gemini key
npm install && npm run dev
```

not tax advice. check with a CA for your case.
