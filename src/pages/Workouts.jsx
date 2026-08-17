import { useEffect, useState } from 'react'
import { formatNice, shiftDate } from '../lib/date.js'
import { api } from '../lib/api.js'
import { ChevronLeft, ChevronRight, Close, Plus } from '../components/Icons.jsx'

const empty = { name: '', sets: '', reps: '', weight_kg: '', duration_min: '', notes: '' }

export default function Workouts({ date, setDate }) {
  const [entries, setEntries] = useState([])
  const [form, setForm] = useState(empty)
  const [showForm, setShowForm] = useState(false)

  async function refresh() {
    setEntries(await api.workouts.list(date))
  }

  useEffect(() => { refresh() }, [date])

  async function submit(ev) {
    ev.preventDefault()
    if (!form.name.trim()) return
    await api.workouts.add({
      date,
      name: form.name.trim(),
      sets: form.sets ? Number(form.sets) : null,
      reps: form.reps ? Number(form.reps) : null,
      weight_kg: form.weight_kg ? Number(form.weight_kg) : null,
      duration_min: form.duration_min ? Number(form.duration_min) : null,
      notes: form.notes.trim() || null,
    })
    setForm(empty)
    setShowForm(false)
    refresh()
  }

  async function remove(id) {
    await api.workouts.delete(id)
    refresh()
  }

  return (
    <div className="page">
      <div className="date-nav">
        <button onClick={() => setDate(shiftDate(date, -1))} aria-label="Previous day"><ChevronLeft /></button>
        <div className="date-label">{formatNice(date)}</div>
        <button onClick={() => setDate(shiftDate(date, 1))} aria-label="Next day"><ChevronRight /></button>
      </div>

      <div className="section-header">
        <h3>Workout log</h3>
        <button className="link-btn" onClick={() => setShowForm(v => !v)}>
          {showForm ? <Close size={13} /> : <Plus size={13} />}
          {showForm ? 'Cancel' : 'Add exercise'}
        </button>
      </div>

      {showForm && (
        <form className="workout-form" onSubmit={submit}>
          <input placeholder="Exercise name" value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <input type="number" placeholder="Sets" value={form.sets}
            onChange={e => setForm(f => ({ ...f, sets: e.target.value }))} />
          <input type="number" placeholder="Reps" value={form.reps}
            onChange={e => setForm(f => ({ ...f, reps: e.target.value }))} />
          <input type="number" placeholder="Weight (kg)" value={form.weight_kg}
            onChange={e => setForm(f => ({ ...f, weight_kg: e.target.value }))} />
          <input type="number" placeholder="Duration (min)" value={form.duration_min}
            onChange={e => setForm(f => ({ ...f, duration_min: e.target.value }))} />
          <input placeholder="Notes" value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          <button type="submit">Save exercise</button>
        </form>
      )}

      {entries.length === 0 ? (
        <p className="empty">No exercises logged for this day.</p>
      ) : (
        <ul className="entry-list">
          {entries.map(w => (
            <li key={w.id} className="entry-row">
              <div className="row-avatar">{w.name.trim().charAt(0) || '?'}</div>
              <div className="entry-info">
                <div className="entry-name">{w.name}</div>
                <div className="entry-meta">
                  {[
                    w.sets && w.reps ? `${w.sets}x${w.reps}` : null,
                    w.weight_kg ? `${w.weight_kg}kg` : null,
                    w.duration_min ? `${w.duration_min}min` : null,
                    w.notes,
                  ].filter(Boolean).join(' · ')}
                </div>
              </div>
              <button className="icon-btn" onClick={() => remove(w.id)} aria-label="Remove exercise"><Close /></button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
