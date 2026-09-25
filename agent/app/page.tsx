'use client'
import {useChat} from '@ai-sdk/react'
import {DefaultChatTransport} from 'ai'
import {useState} from 'react'

const transport = new DefaultChatTransport({api: '/api/chat'})

const EXAMPLES = [
  'I earn $40k/yr from a US client as a freelance dev. Can I use 44ADA for tax year 2026-27?',
  'Do I need GST registration if all my clients are abroad?',
  'When are advance tax instalments due and what if I use presumptive taxation?',
  'Is 194J still the TDS section for professional fees?',
]

function renderText(t: string) {
  const parts = t.split(/(\[[^\]]+\]\([^)]+\))/g)
  return parts.map((p, i) => {
    const m = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    return m ? <a key={i} href={m[2]} target="_blank" rel="noreferrer" style={{color: '#7cc4ff'}}>{m[1]}</a> : <span key={i}>{p}</span>
  })
}

export default function Page() {
  const [input, setInput] = useState('')
  const {messages, sendMessage, status, error} = useChat({transport})
  const send = (text: string) => { if (!text.trim()) return; sendMessage({text}); setInput('') }
  return (
    <main style={{maxWidth: 760, margin: '0 auto', padding: 24}}>
      <h1 style={{fontSize: 22}}>Freelance Tax Copilot - India</h1>
      <p style={{opacity: 0.7, fontSize: 14}}>Answers only from a structured, cited Sanity dataset: Income-tax Act 2025 (with old 1961 section mapping), CGST/IGST and CBIC circulars. Information, not advice.</p>
      {messages.length === 0 && (
        <div style={{display: 'grid', gap: 8, margin: '16px 0'}}>
          {EXAMPLES.map((e) => (<button key={e} onClick={() => send(e)} style={{textAlign: 'left', padding: 10, background: '#1a1d24', color: 'inherit', border: '1px solid #2a2f3a', borderRadius: 8, cursor: 'pointer'}}>{e}</button>))}
        </div>
      )}
      <div style={{display: 'grid', gap: 12, margin: '16px 0'}}>
        {messages.map((m) => (
          <div key={m.id} style={{padding: 12, borderRadius: 8, background: m.role === 'user' ? '#1f2a3a' : '#1a1d24', whiteSpace: 'pre-wrap', lineHeight: 1.5}}>
            {m.parts.map((part, i) => {
              if (part.type === 'text') return <div key={i}>{renderText(part.text)}</div>
              if (part.type.startsWith('tool-')) {
                const p = part as {type: string; input?: {query?: string}; state?: string}
                return <details key={i} style={{fontSize: 12, opacity: 0.6}}><summary>{p.type.replace('tool-', '')} {p.state === 'output-available' ? '✓' : '...'}</summary><code>{typeof p.input?.query === 'string' ? p.input.query : JSON.stringify(p.input ?? {})}</code></details>
              }
              return null
            })}
          </div>
        ))}
      </div>
      {status === 'submitted' || status === 'streaming' ? <p style={{opacity: 0.6, fontSize: 13}}>checking the sources...</p> : null}
      {error ? <p style={{color: '#ff8a8a', fontSize: 13}}>something went wrong: {error.message}</p> : null}
      <form onSubmit={(e) => { e.preventDefault(); send(input) }} style={{display: 'flex', gap: 8}}>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about ITA 2025 / GST as a freelancer..." style={{flex: 1, padding: 10, borderRadius: 8, border: '1px solid #2a2f3a', background: '#14171d', color: 'inherit'}} />
        <button disabled={status !== 'ready'} style={{padding: '10px 16px', borderRadius: 8}}>Ask</button>
      </form>
    </main>
  )
}
