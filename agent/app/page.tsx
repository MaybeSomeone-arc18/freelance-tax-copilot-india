'use client'

import {useChat} from '@ai-sdk/react'
import {DefaultChatTransport} from 'ai'
import {useEffect, useRef, useState} from 'react'

const transport = new DefaultChatTransport({api: '/api/chat'})

const EXAMPLES = [
  {label: 'Old law, new section', question: 'I earn $40k/yr from a US client as a freelance dev. Can I use 44ADA for tax year 2026-27?', icon: '01'},
  {label: 'Export of services', question: 'Do I need GST registration if all my clients are abroad?', icon: '02'},
  {label: 'Payment dates', question: 'When are advance tax instalments due and what if I use presumptive taxation?', icon: '03'},
  {label: 'TDS renumbering', question: 'Is 194J still the TDS section for professional fees?', icon: '04'},
]

function isSafeUrl(url: string) {
  try { return /^https?:$/.test(new URL(url).protocol) } catch { return false }
}

function Inline({text}: {text: string}) {
  const tokens = text.split(/(\[[^\]]+\]\(https?:\/\/[^\s)]+\)|https?:\/\/[^\s<>]+|\*\*[^*]+\*\*)/g)
  return <>{tokens.map((token, i) => {
    const markdown = token.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/)
    if (markdown && isSafeUrl(markdown[2])) return <a key={i} href={markdown[2]} target="_blank" rel="noopener noreferrer">{markdown[1]}<span className="external" aria-hidden="true">↗</span></a>
    if (/^https?:\/\//.test(token)) {
      const clean = token.replace(/[.,;]+$/, '')
      if (isSafeUrl(clean)) return <span key={i}><a href={clean} target="_blank" rel="noopener noreferrer">{clean.replace(/^https?:\/\//, '')}<span className="external" aria-hidden="true">↗</span></a>{token.slice(clean.length)}</span>
    }
    if (token.startsWith('**') && token.endsWith('**')) return <strong key={i}>{token.slice(2, -2)}</strong>
    return <span key={i}>{token}</span>
  })}</>
}

function Answer({text}: {text: string}) {
  return <div className="answer-copy">{text.split('\n').map((line, i) => {
    if (!line.trim()) return <div className="paragraph-break" key={i} />
    const heading = line.match(/^#{1,4}\s+(.+)$/)
    if (heading) return <h3 key={i}><Inline text={heading[1]} /></h3>
    const item = line.match(/^\s*(?:[-*]|\d+\.)\s+(.+)$/)
    if (item) return <p className="answer-item" key={i}><span className="bullet">•</span><Inline text={item[1]} /></p>
    return <p key={i}><Inline text={line} /></p>
  })}</div>
}

export default function Page() {
  const [input, setInput] = useState('')
  const {messages, sendMessage, status, error} = useChat({transport})
  const bottomRef = useRef<HTMLDivElement>(null)
  const busy = status === 'submitted' || status === 'streaming'
  useEffect(() => { if (messages.length) bottomRef.current?.scrollIntoView({behavior: 'smooth', block: 'end'}) }, [messages.length, status])
  const send = (text: string) => { if (!text.trim() || busy) return; sendMessage({text: text.trim()}); setInput('') }

  return <main className="shell">
    <header className="topbar">
      <div className="brand"><span className="brand-mark">§</span><span>freelance<span className="brand-muted">/</span>tax</span></div>
      <div className="top-right"><span className="status-dot" /> SOURCED ANSWERS <span className="top-divider" /> INDIA</div>
    </header>

    <section className="hero">
      <div className="eyebrow"><span className="eyebrow-line" /> AN AGENT BUILT ON REAL TAX CONTENT</div>
      <h1>Tax answers that <em>show their work.</em></h1>
      <p>The 2025 Income-tax Act changed section numbers for tax year 2026-27. Old advice still points to the 1961 Act. This working agent checks the right year and queries real tax content in Sanity before answering, with links back to official sources.</p>
      <div className="hero-pills"><span>Income-tax Act, 2025</span><span>1961 → 2025 mapping</span><span>GST &amp; CBIC</span></div>
    </section>

    <section className="workspace" aria-label="Tax copilot">
      <div className="workspace-head"><div><span className="workspace-kicker">THE COPILOT</span><h2>Start with a real question</h2></div><span className="workspace-number">01 / LIVE DEMO</span></div>
      {messages.length === 0 && <div className="examples"><div className="examples-label">TRY A QUESTION <span>↘</span></div><div className="example-grid">{EXAMPLES.map(e => <button className="example" key={e.icon} type="button" disabled={busy} onClick={() => send(e.question)}><span className="example-top"><span className="example-number">{e.icon}</span><span className="example-arrow">↗</span></span><strong>{e.label}</strong><span className="example-question">{e.question}</span></button>)}</div></div>}
      {messages.length > 0 && <div className="conversation" aria-live="polite">{messages.map(m => <div key={m.id} className={`message ${m.role === 'user' ? 'question-message' : 'agent-message'}`}><div className="message-label">{m.role === 'user' ? 'YOUR QUESTION' : <><span className="answer-spark">✳</span> SOURCED ANSWER</>}</div>{m.parts.map((part, i) => {
        if (part.type === 'text') return m.role === 'user' ? <p className="question-copy" key={i}>{part.text}</p> : <Answer key={i} text={part.text}/>
        if (part.type.startsWith('tool-')) {
          const p = part as {type: string; input?: {query?: string}; state?: string}
          const name = p.type.replace('tool-', '')
          return <details className="source-check" key={i}><summary><span className="check-icon">{p.state === 'output-available' ? '✓' : '···'}</span>{name === 'groq_query' ? 'Checking structured law in Sanity' : name === 'knowledge_base_read' ? 'Reading source context' : 'Checking source data'}<span className="details-arrow">⌄</span></summary>{p.input?.query && <code>{p.input.query}</code>}</details>
        }
        return null
      })}</div>)}{busy && <div className="thinking"><span className="thinking-pulse" /> Checking the sources. This can take a moment.</div>}<div ref={bottomRef}/></div>}
      {error && <div className="error" role="alert">{error.message}</div>}
      <form className="ask-form" onSubmit={e => {e.preventDefault(); send(input)}}><label htmlFor="question" className="sr-only">Your tax question</label><input id="question" value={input} onChange={e => setInput(e.target.value)} placeholder="Ask about tax years, GST, TDS, deadlines..." maxLength={1000}/><button type="submit" disabled={busy || !input.trim()}>{busy ? 'Checking...' : 'Ask the copilot'} <span aria-hidden="true">↗</span></button></form>
      <p className="input-note">Built for questions, not filings. Verify important decisions with a qualified tax professional.</p>
    </section>

    <section className="method"><div className="method-title"><span className="eyebrow">BEHIND EACH ANSWER</span><h2>No mystery citations.</h2></div><div className="method-steps"><div><span>01 / RETRIEVE</span><strong>Query real content</strong><p>Structured provisions and source documents in Sanity, not a generic chatbot memory.</p></div><div><span>02 / RESOLVE</span><strong>Check what changed</strong><p>Tax year, old-to-new section mapping, and conflicting rules get checked before the answer.</p></div><div><span>03 / CITE</span><strong>Open the source</strong><p>Answers point to the statute section and official document where available.</p></div></div></section>
    <footer><span>FREELANCE / TAX · INDIA</span><span>An open-source Sanity Challenge project · Informational only</span><a href="https://github.com/MaybeSomeone-arc18/freelance-tax-copilot-india" target="_blank" rel="noopener noreferrer">View the code ↗</a></footer>
  </main>
}
