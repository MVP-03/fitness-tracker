import { useEffect, useState } from 'react'
import { todayISO, formatNice } from '../lib/date.js'
import { api } from '../lib/api.js'
import { Close } from '../components/Icons.jsx'

export default function Weight() {
  const [entries, setEntries] = useState([])
  const [date, setDate] = useState(todayISO())
  const [weight, setWeight] = useState('')

  async function refresh() {
    setEntries(await api.weight.list(120))
  }

  useEffect(() => { refresh() }, [])

  async function submit(ev) {
    ev.preventDefault()
    const w = Number(weight)
    if (!w) return
    await api.weight.upsert(date, w)
    setWeight('')
    refresh()
  }

  async function remove(id) {
    await api.weight.delete(id)
    refresh()
  }

  const chronological = [...entries].reverse()
  const latest = entries[0]
  const previous = entries[1]
  const delta = latest && previous ? latest.weight_kg - previous.weight_kg : null

  return (
    <div className="page">
      <div className="section-header">
        <h3>Weight</h3>
        {latest && (
          <div className="weight-current">
            {latest.weight_kg.toFixed(1)} kg
            {delta !== null && (
              <span className={delta <= 0 ? 'delta-down' : 'delta-up'}>
                {' '}({delta > 0 ? '+' : ''}{delta.toFixed(1)})
              </span>
            )}
          </div>
        )}
      </div>

      <form className="weight-form" onSubmit={submit}>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        <input
          type="number" step="0.1" placeholder="Weight (kg)"
          value={weight} onChange={e => setWeight(e.target.value)}
        />
        <button type="submit">Log weight</button>
      </form>

      {chronological.length > 1 && <WeightChart data={chronological} />}

      {entries.length === 0 ? (
        <p className="empty">No weight entries yet.</p>
      ) : (
        <ul className="entry-list">
          {entries.map(e => (
            <li key={e.id} className="entry-row">
              <div className="entry-name">{formatNice(e.date)}</div>
              <div className="entry-macros"><span>{e.weight_kg.toFixed(1)} kg</span></div>
              <button className="icon-btn" onClick={() => remove(e.id)} aria-label="Remove entry"><Close /></button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function WeightChart({ data }) {
  const w = 640, h = 160, pad = 20
  const values = data.map(d => d.weight_kg)
  const min = Math.min(...values) - 0.5
  const max = Math.max(...values) + 0.5
  const x = (i) => pad + (i / (data.length - 1)) * (w - pad * 2)
  const y = (v) => h - pad - ((v - min) / (max - min || 1)) * (h - pad * 2)
  const points = data.map((d, i) => `${x(i)},${y(d.weight_kg)}`).join(' ')

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} className="weight-chart">
      <polyline points={points} fill="none" className="chart-line" />
      {data.map((d, i) => (
        <circle key={d.id} cx={x(i)} cy={y(d.weight_kg)} r="3" className="chart-dot" />
      ))}
    </svg>
  )
}
