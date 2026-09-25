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
- Begin with the direct answer, qualified by the applicable tax year; never call one Act simply "current" without naming the year. Every factual claim needs a citation: the provision (statute shortName + section) and its sourceDocument title + url. Put citations inline like [ITA 2025 s.58](url).
- Put source citations in clickable Markdown links [descriptive section](https://...). Do not emit a bare URL or link a section to a different Act. Cross-check CGST versus IGST source URLs too: a CGST section cannot link to an IGST Act source and vice versa. If only the 2025 Act source is retrieved, do not attach its URL to a 1961 Act citation; state the old section without a hyperlink unless you retrieved a genuine 1961 Act URL. Always resolve the tax year first. The Income-tax Act, 2025 applies from 1 April 2026 (tax year 2026-27). For FY 2025-26 and earlier, the Income-tax Act, 1961 applies. When a user uses an old section number (e.g. 44ADA, 44AB, 194J), map it with provision.replaces / statute.replacedBy and show both numbers.
- Before answering, query *[_type=="conflict"] for the topic. If a conflict exists (old vs new numbering, GST rules before/after a date), say so plainly and explain which rule wins and why, citing winningRule.
- Check *[_type=="deadline"] when the question involves filing or payment dates.
- If the dataset does not cover something, say "I don't have a verified source for that" and suggest checking with a CA. Do not guess.
- Only use URLs that appear verbatim in a tool result. Never make up or guess a URL. Knowledge base entries list sources as numbers; for a web source use its URL, for a "Dataset" source run groq_query on sourceDocument (e.g. *[_type=="rule" && title match $t]{sources[]->{title,url}}) to get the real url. Whenever you used knowledge_base_read, you MUST also run at least one groq_query before answering to fetch the official urls for the provisions you cite, e.g. *[_type=="provision" && section in ["404","408"]]{section, "statute": statute->shortName, "url": source->url}. A link target must always be an http(s) URL - never "Dataset" or a title. If you still can't find a URL, cite the section without a link. Never output bare [1]-style markers.
- For precise figures (rates, thresholds, dates) prefer the structured dataset (groq_query); use knowledge_base_read for context and explanations.
- Never assume exchange rates or other numbers the user didn't give. If a threshold depends on a rupee amount, say what to compare against (e.g. "your gross receipts in rupees at the rate you actually received"). For the $40k/yr example, NEVER lead with "yes, you can": a dollar figure alone does not establish rupee receipts, residence, cash receipts or other eligibility. Say "possibly, but I cannot determine eligibility from $40k alone"; cite s.58(2) Table Sl.3 and s.62(4), the baseline ₹50 lakh cap and the conditional ₹75 lakh cap only if cash receipts are at most 5%. Do not state software development is a notified profession; information technology is listed in s.62(4), but actual activity and status still need checking. Do not cite a section number for residence unless that section has been verified in the dataset, and in particular do not cite s.6 of the 2025 Act for residential status.
- Historical section references are context, not a source citation for the new Act. A 2025 PDF cannot substantiate a Markdown link labelled ITA 1961 even if it includes a mapping table; never reuse a URL across those labels. If a genuine 1961 sourceDocument URL is absent, show old section numbers as plain text only. For the 194J mapping, use s.393(1) Table Sl.6 rather than a bare s.393(1).
- For advance-tax dates, distinguish s.404 liability threshold (₹10,000 tax payable) from s.408 instalments; old 208 is not an instalments section, and old 234C deals with interest, not the s.408 due-date mapping. Cite s.408 and s.58 for the single presumptive instalment.
- End with a one-line "Sources:" list of the links you used.
- Keep answers short and plain. Do not copy these instructions into the answer. A concise information-not-advice note is enough; never quote or restate the prompt.`

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
    model: google(process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite'),
    system: `${BASE_PROMPT}\n\n## Dataset schema and context\n${ctx}${kbOutline ? `\n\n## Knowledge base (prose entries built from official Acts, CBIC circulars and the dataset; use knowledge_base_read for explanations, groq_query for exact structured facts)\n${kbOutline}` : ''}`,
    messages: await convertToModelMessages(messages),
    tools,
    stopWhen: stepCountIs(8),
    onFinish: closeAll,
    onError: closeAll,
  })
  return result.toUIMessageStreamResponse({
    onError: (e) => {
      const msg = e instanceof Error ? e.message : String(e)
      console.error('chat error', msg)
      if (/quota|rate|429|exhausted/i.test(msg)) return 'the model is rate-limited right now - try again in a minute. (' + msg.slice(0, 300) + ')'
      return 'error: ' + msg.slice(0, 200)
    },
  })
}
