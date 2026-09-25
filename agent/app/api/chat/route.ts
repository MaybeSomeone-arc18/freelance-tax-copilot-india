import {createMCPClient} from '@ai-sdk/mcp'
import {google} from '@ai-sdk/google'
import {convertToModelMessages, stepCountIs, streamText, type UIMessage} from 'ai'

export const maxDuration = 60

const MCP_URL = process.env.SANITY_CONTEXT_MCP_URL!
const TOKEN = process.env.SANITY_API_TOKEN!
const KB_URL = process.env.SANITY_CONTEXT_KB_MCP_URL
const KB_TOKEN = process.env.SANITY_CONTEXT_TOKEN

let cachedContext: {text: string; at: number} | null = null
async function initialContext() {
  if (cachedContext && Date.now() - cachedContext.at < 10 * 60_000) return cachedContext.text
  const res = await fetch(`${MCP_URL}/initial-context`, {headers: {Authorization: `Bearer ${TOKEN}`}})
  const text = res.ok ? await res.text() : ''
  cachedContext = {text, at: Date.now()}
  return text
}

const BASE_PROMPT = `You are a tax copilot for Indian freelancers (developers, designers, consultants), many with foreign clients.

Hard rules:
- Answer ONLY from content you retrieve from the Sanity dataset with groq_query. Never answer tax law from memory.
- Every factual claim needs a citation: the provision (statute shortName + section) and its sourceDocument title + url. Put citations inline like [ITA 2025 s.58](url).
- Always resolve the tax year first. The Income-tax Act, 2025 applies from 1 April 2026 (tax year 2026-27). For FY 2025-26 and earlier, the Income-tax Act, 1961 applies. When a user uses an old section number (e.g. 44ADA, 44AB, 194J), map it with provision.replaces / statute.replacedBy and show both numbers.
- Before answering, query *[_type=="conflict"] for the topic. If a conflict exists (old vs new numbering, GST rules before/after a date), say so plainly and explain which rule wins and why, citing winningRule.
- Check *[_type=="deadline"] when the question involves filing or payment dates.
- If the dataset does not cover something, say "I don't have a verified source for that" and suggest checking with a CA. Do not guess.
- Only use URLs that appear verbatim in a tool result. Never make up or guess a URL. Knowledge base entries list sources as numbers; for a web source use its URL, for a "Dataset" source run groq_query on sourceDocument (e.g. *[_type=="rule" && title match $t]{sources[]->{title,url}}) to get the real url. If you can't find a URL, cite the section and title without a link. Never output bare [1]-style markers.
- For precise figures (rates, thresholds, dates) prefer the structured dataset (groq_query); use knowledge_base_read for context and explanations.
- Never assume exchange rates or other numbers the user didn't give. If a threshold depends on a rupee amount, say what to compare against (e.g. "your gross receipts in rupees at the rate you actually received").
- End with a one-line "Sources:" list of the links you used.
- This is information, not professional advice. Keep answers short and plain.`

export async function POST(req: Request) {
  const {messages}: {messages: UIMessage[]} = await req.json()
  const [mcp, kb, ctx] = await Promise.all([
    createMCPClient({transport: {type: 'http', url: MCP_URL, headers: {Authorization: `Bearer ${TOKEN}`}}}),
    KB_URL && KB_TOKEN
      ? createMCPClient({transport: {type: 'http', url: KB_URL, headers: {Authorization: `Bearer ${KB_TOKEN}`}}})
      : Promise.resolve(null),
    initialContext(),
  ])
  const {initial_context: _ignored, ...datasetTools} = await mcp.tools()
  let kbTools = {}
  let kbOutline = ''
  if (kb) {
    const {initial_context: kbInit, ...rest} = await kb.tools()
    kbTools = rest
    const r = await fetch(`${KB_URL}/initial-context`, {headers: {Authorization: `Bearer ${KB_TOKEN}`}})
    kbOutline = r.ok ? await r.text() : ''
  }
  const tools = {...datasetTools, ...kbTools}
  const closeAll = async () => { await mcp.close(); if (kb) await kb.close() }
  const result = streamText({
    model: google(process.env.GEMINI_MODEL || 'gemini-2.5-flash'),
    system: `${BASE_PROMPT}\n\n## Dataset schema and context\n${ctx}${kbOutline ? `\n\n## Knowledge base (prose entries built from official Acts, CBIC circulars and the dataset; use knowledge_base_read for explanations, groq_query for exact structured facts)\n${kbOutline}` : ''}`,
    messages: await convertToModelMessages(messages),
    tools,
    stopWhen: stepCountIs(8),
    onFinish: closeAll,
    onError: closeAll,
  })
  return result.toUIMessageStreamResponse()
}
