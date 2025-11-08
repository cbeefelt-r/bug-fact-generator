import React, { useState, useMemo } from 'react'
import './App.css'
import FACTS from './facts.json'

export default function App() {
  // Copy of facts for session state so we can mark used ones
  const facts = useMemo(() => [...FACTS], [])
  const [current, setCurrent] = useState('')
  const [used, setUsed] = useState(new Set())
  const [history, setHistory] = useState([] as string[])

  function pickRandom() {
    const available = facts.filter((f) => !used.has(f))
    if (available.length === 0) return
    const choice = available[Math.floor(Math.random() * available.length)]
    setCurrent(choice)
    setUsed((s) => new Set(s).add(choice))
    setHistory((h) => [choice, ...h])
  }

  return (
    <main className="widget">
      <div className="display" aria-live="polite">
        {current ? (
          <p className="current">{current}</p>
        ) : (
          <p className="current muted">Press the button for a bug fact</p>
        )}
      </div>

      <div className="controls">
        <button className="primary" onClick={pickRandom} aria-label="Get a bug fact">
          Bug Fact!
        </button>
      </div>

      <section className="history">
        <h2 className="sr-only">Fact history</h2>
        {history.length > 0 ? (
          <ol>
            {history.map((h, i) => (
              <li key={i} className="history-item">
                {h}
              </li>
            ))}
          </ol>
        ) : (
          <p className="muted">No facts generated in this session yet.</p>
        )}
      </section>
    </main>
  )
}
