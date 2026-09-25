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

function citationMatchesSource(label: string, url: string) {
  const is1961 = /(?:ITA|Income.tax Act)\s*1961/i.test(label)
  const is2025 = /(?:ITA|Income.tax Act)\s*2025/i.test(label)
  const isCGST = /\bCGST\b|Central Goods and Services Tax/i.test(label)
  const isIGST = /\bIGST\b|Integrated Goods and Services Tax/i.test(label)
  const path = decodeURIComponent(url).toLowerCase()
  if (is1961 && /income[_-]?tax[_-]?act[_-]?2025|ita[_-]?2025/.test(path)) return false
  if (is2025 && /income[_-]?tax[_-]?act[_-]?1961|ita[_-]?1961/.test(path)) return false
  if (isCGST && /igst[-_]?act|2017_igst_act/.test(path)) return false
  if (isIGST && /cgst[-_]?act|2017_cgst_act/.test(path)) return false
  return true
}

function isSafeUrl(url: string) {
  try { return /^https?:$/.test(new URL(url).protocol) } catch { return false }
}

function Inline({text}: {text: string}) {
  const tokens = text.split(/(\[[^\]]+\]\(https?:\/\/[^\s)]+\)|https?:\/\/[^\s<>]+|\*\*[^*]+\*\*)/g)
  return <>{tokens.map((token, i) => {
    const markdown = token.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/)
    if (markdown && isSafeUrl(markdown[2]) && citationMatchesSource(markdown[1], markdown[2])) return <a key={i} href={markdown[2]} target="_blank" rel="noopener noreferrer">{markdown[1]}<span className="external" aria-hidden="true">↗</span></a>
    if (markdown) return <span key={i}>{markdown[1]}</span>
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
  const [progress, setProgress] = useState(0)
  const heroRef = useRef<HTMLElement>(null)
  useEffect(() => {
    const onScroll = () => setProgress(Math.min(100, window.scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight) * 100))
    onScroll(); addEventListener('scroll', onScroll, {passive: true})
    const io = new IntersectionObserver(entries => entries.forEach(entry => {if (entry.isIntersecting) {entry.target.classList.add('in-view'); io.unobserve(entry.target)}}), {threshold: .12})
    document.querySelectorAll('.reveal').forEach(el => io.observe(el))
    return () => {removeEventListener('scroll', onScroll); io.disconnect()}
  }, [])
  const {messages, sendMessage, status, error} = useChat({transport})
  const bottomRef = useRef<HTMLDivElement>(null)
  const busy = status === 'submitted' || status === 'streaming'
  useEffect(() => { if (messages.length) bottomRef.current?.scrollIntoView({behavior: 'smooth', block: 'end'}) }, [messages.length, status])
  const send = (text: string) => { if (!text.trim() || busy) return; sendMessage({text: text.trim()}); setInput('') }

  return <main className="shell">
    <div className="scroll-progress" style={{transform: `scaleX(${progress / 100})`}} aria-hidden="true" />
    <header className="topbar">
      <div className="brand"><span className="brand-mark">§</span><span>freelance<span className="brand-muted">/</span>tax</span></div>
      <div className="top-right"><span className="status-dot" /> SOURCED ANSWERS <span className="top-divider" /> INDIA</div>
    </header>

    <section className="hero" ref={heroRef} onPointerMove={e => {const b = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--mx', `${(e.clientX-b.left)/b.width*100}%`); e.currentTarget.style.setProperty('--my', `${(e.clientY-b.top)/b.height*100}%`)}}>
      <div className="hero-content"><div className="eyebrow"><span className="eyebrow-line" /> REAL LAW. REAL SOURCES. NO GUESSWORK.</div>
      <h1>The law moved.<br/><em>Get the right</em><br/>answer<span className="period">.</span></h1>
      <p>Ask about freelance tax in India. The agent checks which tax year you mean, retrieves the relevant provisions from Sanity, and shows where its answer came from. Old section numbers are mapped to the 2025 Act instead of silently reused.</p>
      <div className="hero-bottom"><a href="#try-it" className="hero-cta">TRY THE LIVE AGENT <span>↗</span></a><span className="hero-note">BUILT WITH SANITY CONTEXT · INDIA</span></div></div>
      <div className="hero-visual" aria-label="Example of an old tax section mapped to the 2025 Act"><div className="orbit orbit-a"/><div className="orbit orbit-b"/><div className="orbit orbit-c"/><div className="orbit-center"><span>THE SECTION SHIFT</span><div className="mapping"><span className="old-section">44ADA <small>1961 ACT</small></span><span className="mapping-arrow">→</span><span className="new-section">58 <small>2025 ACT</small></span></div><div className="mapping-line"/><p>Same question.<br/>A different law.</p></div><span className="orbit-label orbit-label-a">TAX YEAR / 2026-27</span><span className="orbit-label orbit-label-b">SOURCE VERIFIED ✳</span></div>
    </section>

    <div className="marquee" aria-hidden="true"><div className="marquee-track">SOURCE FIRST <i>✳</i> OLD LAW → NEW LAW <i>✳</i> VERIFIED SECTIONS <i>✳</i> SANITY CONTEXT <i>✳</i> SOURCE FIRST <i>✳</i> OLD LAW → NEW LAW <i>✳</i> VERIFIED SECTIONS <i>✳</i> SANITY CONTEXT <i>✳</i></div></div>
    <div className="section-intro reveal"><span>01 / LIVE AGENT</span><p>One question. A traceable answer.<br/><em>Try it below.</em></p></div>
    <section className="workspace reveal" id="try-it" aria-label="Tax copilot">
      <div className="workspace-head"><div><span className="workspace-kicker">THE COPILOT</span><h2>Ask, then inspect the source.</h2></div><span className="workspace-number">01 / LIVE DEMO</span></div>
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

    <section className="story reveal" aria-label="Why this agent exists">
      <div className="story-heading"><span className="eyebrow">02 / THE PROBLEM</span><h2>A familiar section number.<br/><em>A different Act.</em></h2><p>Search for freelance tax advice and you'll still see references to the 1961 Act. But for tax year 2026-27, the 2025 Act applies. A useful answer has to identify the year before it cites a section.</p></div>
      <div className="story-card"><div className="story-card-label">A CONCRETE EXAMPLE <span>↗</span></div><div className="story-row"><span>THEN / 1961 ACT</span><strong>44ADA</strong><p>Presumptive taxation for certain professions.</p></div><div className="story-divider">↓ <span>FOLLOW THE MAPPING, NOT THE MEMORY</span></div><div className="story-row new"><span>NOW / 2025 ACT</span><strong>Section 58</strong><p>The corresponding provision for tax year 2026-27. Eligibility still depends on the facts of your case.</p></div><a href="https://www.incometaxindia.gov.in/documents/d/guest/income_tax_act_2025_as_amended_by_fa_act_2026-pdf" target="_blank" rel="noopener noreferrer">Read the official 2025 Act ↗</a></div>
    </section>
    <section className="method reveal" aria-label="How it works"><div className="method-title"><span className="eyebrow">03 / UNDER THE HOOD</span><h2>Not a chatbot<br/>with a <em>long prompt.</em></h2><p>Sanity is the working knowledge layer. The agent uses its content tools at question time, rather than answering tax law from model memory.</p></div><div className="method-steps"><div><span>01 / CONTENT MODEL</span><strong>Law as connected data</strong><p>Statutes, provisions, tax years, deadlines and source documents are linked in Sanity. Old-to-new section relationships are explicit.</p></div><div><span>02 / QUERY AT RUNTIME</span><strong>Look it up before answering</strong><p>The agent queries structured content through Sanity Context and checks for recorded conflicts when old and new rules diverge.</p></div><div><span>03 / SHOW THE RECEIPTS</span><strong>Read the underlying law</strong><p>The answer names the section and links to an official source when available. If the dataset lacks a verified answer, the agent should say so.</p></div></div></section>
    <div className="closing reveal"><div><span>THE BEST TEST IS YOUR OWN QUESTION.</span><h2>See what the<br/><em>source says.</em></h2></div><a href="#try-it">ASK THE AGENT <span>↗</span></a></div>
    <footer><span>FREELANCE / TAX · INDIA</span><span>An open-source Sanity Challenge project · Informational only</span><a href="https://github.com/MaybeSomeone-arc18/freelance-tax-copilot-india" target="_blank" rel="noopener noreferrer">View the code ↗</a></footer>
  </main>
}
