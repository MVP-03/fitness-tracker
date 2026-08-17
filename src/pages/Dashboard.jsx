import { useEffect, useState } from 'react'
import MacroRing from '../components/MacroRing.jsx'
import WeeklyTracker from '../components/WeeklyTracker.jsx'
import { ChevronLeft, ChevronRight, Close } from '../components/Icons.jsx'
import { formatNice, shiftDate } from '../lib/date.js'
import { MICRO_TARGETS } from '../lib/goals.js'
import { api } from '../lib/api.js'

const DEFAULT_GOALS = { calories: 2200, protein: 150, carbs: 220, fat: 70, ...MICRO_TARGETS }

const MICRO_LABELS = {
  fiber: 'Fiber (g)', sugar: 'Sugar (g)', sodium: 'Sodium (mg)',
  potassium: 'Potassium (mg)', calcium: 'Calcium (mg)', iron: 'Iron (mg)', vitamin_c: 'Vitamin C (mg)',
}

export default function Dashboard({ date, setDate }) {
  const [summary, setSummary] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 })
  const [entries, setEntries] = useState([])
  const [goals, setGoals] = useState(DEFAULT_GOALS)
  const [editingGoals, setEditingGoals] = useState(false)

  async function refresh() {
    const [s, e] = await Promise.all([
      api.meals.summary(date),
      api.meals.list(date),
    ])
    setSummary(s)
    setEntries(e)
  }

  useEffect(() => { refresh() }, [date])

  useEffect(() => {
    (async () => {
      const stored = await api.settings.get('goals')
      if (stored) setGoals(g => ({ ...g, ...JSON.parse(stored) }))
    })()
  }, [])

  async function saveGoals(next) {
    setGoals(next)
    await api.settings.set('goals', JSON.stringify(next))
  }

  async function removeEntry(id) {
    await api.meals.delete(id)
    refresh()
  }

  return (
    <div className="page">
      <div className="date-nav">
        <button onClick={() => setDate(shiftDate(date, -1))} aria-label="Previous day"><ChevronLeft /></button>
        <div className="date-label">{formatNice(date)}</div>
        <button onClick={() => setDate(shiftDate(date, 1))} aria-label="Next day"><ChevronRight /></button>
      </div>

      <div className="rings-row">
        <MacroRing value={summary.calories} goal={goals.calories} label="Calories" color="var(--accent)" />
        <MacroRing value={summary.protein} goal={goals.protein} label="Protein (g)" color="var(--accent-deep)" />
        <MacroRing value={summary.carbs} goal={goals.carbs} label="Carbs (g)" color="var(--carb)" />
        <MacroRing value={summary.fat} goal={goals.fat} label="Fat (g)" color="var(--fat)" />
      </div>

      <WeeklyTracker goalCalories={goals.calories} />

      <div className="section-header">
        <h3>Today's entries</h3>
        <button className="link-btn" onClick={() => setEditingGoals(v => !v)}>
          {editingGoals ? 'Close' : 'Edit goals'}
        </button>
      </div>

      {editingGoals && (
        <GoalsForm goals={goals} onSave={(g) => { saveGoals(g); setEditingGoals(false) }} />
      )}

      {entries.length === 0 ? (
        <p className="empty">No food logged yet. Add something from the Food tab.</p>
      ) : (
        <ul className="entry-list">
          {entries.map(e => (
            <li key={e.id} className="entry-row">
              <div className="row-avatar">{e.food_name.trim().charAt(0) || '?'}</div>
              <div className="entry-info">
                <div className="entry-name">{e.food_name}</div>
                <div className="entry-meta">{e.meal_type} · x{e.quantity}</div>
              </div>
              <div className="entry-macros">
                <span>{Math.round(e.calories)} kcal</span>
                <span>{Math.round(e.protein)}p / {Math.round(e.carbs)}c / {Math.round(e.fat)}f</span>
              </div>
              <button className="icon-btn" onClick={() => removeEntry(e.id)} aria-label="Remove entry"><Close /></button>
            </li>
          ))}
        </ul>
      )}

      <div className="section-header"><h3>Micronutrients</h3></div>
      <div className="micro-grid">
        {Object.keys(MICRO_LABELS).map(key => (
          <MicroBar key={key} label={MICRO_LABELS[key]} value={summary[key] || 0} goal={goals[key]} />
        ))}
      </div>
    </div>
  )
}

function MicroBar({ label, value, goal }) {
  const pct = goal > 0 ? Math.min(value / goal, 1) : 0
  return (
    <div className="micro-bar">
      <div className="micro-bar-head">
        <span>{label}</span>
        <span>{Math.round(value)} / {goal}</span>
      </div>
      <div className="micro-bar-track">
        <div className="micro-bar-fill" style={{ transform: `scaleX(${pct})` }} />
      </div>
    </div>
  )
}

function GoalsForm({ goals, onSave }) {
  const [form, setForm] = useState(goals)
  return (
    <form
      className="goals-form"
      onSubmit={(ev) => { ev.preventDefault(); onSave(form) }}
    >
      {['calories', 'protein', 'carbs', 'fat'].map(k => (
        <label key={k}>
          {k}
          <input
            type="number"
            value={form[k]}
            onChange={(e) => setForm(f => ({ ...f, [k]: Number(e.target.value) }))}
          />
        </label>
      ))}
      <button type="submit">Save goals</button>
    </form>
  )
}
