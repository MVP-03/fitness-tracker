import { useEffect, useState } from 'react'
import { todayISO, shiftDate, formatNice } from '../lib/date.js'
import { api } from '../lib/api.js'
import { calculateWaterGoalMl } from '../lib/goals.js'
import { ChevronLeft, ChevronRight, Close, Droplet } from '../components/Icons.jsx'

const QUICK_ADD_ML = [150, 250, 500]

export default function Water({ date, setDate }) {
  const [entries, setEntries] = useState([])
  const [goal, setGoal] = useState(2500)
  const [custom, setCustom] = useState('')
  const [error, setError] = useState('')

  async function refresh() {
    try {
      setEntries(await api.water.list(date))
      setError('')
    } catch (err) {
      setError(err?.message || 'Failed to load water log.')
    }
  }

  useEffect(() => { refresh() }, [date])

  useEffect(() => {
    (async () => {
      const stored = await api.settings.get('goals')
      if (stored) {
        const g = JSON.parse(stored)
        if (g.water_ml) setGoal(g.water_ml)
      } else {
        const profile = await api.settings.get('profile')
        if (profile) setGoal(calculateWaterGoalMl(JSON.parse(profile).current_weight_kg))
      }
    })()
  }, [])

  const total = entries.reduce((sum, e) => sum + e.amount_ml, 0)
  const pct = goal > 0 ? Math.min(total / goal, 1) : 0

  async function addAmount(amount_ml) {
    try {
      await api.water.add({ date, amount_ml })
      setError('')
      refresh()
    } catch (err) {
      setError(err?.message || 'Failed to add water entry.')
    }
  }

  async function submitCustom(ev) {
    ev.preventDefault()
    const amount = Number(custom)
    if (!amount) return
    await addAmount(amount)
    setCustom('')
  }

  async function remove(id) {
    try {
      await api.water.delete(id)
      setError('')
      refresh()
    } catch (err) {
      setError(err?.message || 'Failed to remove water entry.')
    }
  }

  return (
    <div className="page">
      <div className="date-nav">
        <button onClick={() => setDate(shiftDate(date, -1))} aria-label="Previous day"><ChevronLeft /></button>
        <div className="date-label">{formatNice(date)}</div>
        <button onClick={() => setDate(shiftDate(date, 1))} aria-label="Next day"><ChevronRight /></button>
      </div>

      <div className="water-summary">
        <div className="water-summary-head">
          <Droplet size={20} />
          <div>
            <div className="water-total">{Math.round(total)} <span>/ {goal} ml</span></div>
            <div className="hint water-hint">
              {pct >= 1 ? "Goal hit — nice." : `${Math.round((goal - total))} ml to go`}
            </div>
          </div>
        </div>
        <div className="micro-bar-track water-track">
          <div className="micro-bar-fill" style={{ transform: `scaleX(${pct})` }} />
        </div>
      </div>

      <div className="water-quick-add">
        {QUICK_ADD_ML.map(amount => (
          <button key={amount} className="add-btn" onClick={() => addAmount(amount)}>+{amount} ml</button>
        ))}
        <form className="water-custom-form" onSubmit={submitCustom}>
          <input
            type="number" min="1" placeholder="Custom ml"
            value={custom} onChange={e => setCustom(e.target.value)}
          />
          <button type="submit">Add</button>
        </form>
      </div>

      {error && <p className="hint error-hint">{error}</p>}

      <div className="section-header"><h3>Today's log</h3></div>
      {entries.length === 0 ? (
        <p className="empty">No water logged yet today.</p>
      ) : (
        <ul className="entry-list">
          {entries.map(e => (
            <li key={e.id} className="entry-row">
              <div className="row-avatar"><Droplet size={15} /></div>
              <div className="entry-info entry-name">{e.amount_ml} ml</div>
              <button className="icon-btn" onClick={() => remove(e.id)} aria-label="Remove entry"><Close /></button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
