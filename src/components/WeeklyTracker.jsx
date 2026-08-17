import { useEffect, useState } from 'react'
import { lastNDates, formatShort, todayISO } from '../lib/date.js'
import { api } from '../lib/api.js'
import { Check, Close } from './Icons.jsx'

// A day "hits" the goal when logged calories land within 10% of the target —
// close enough to count as on-plan without demanding an exact number.
const TOLERANCE = 0.1

export default function WeeklyTracker({ goalCalories }) {
  const [days, setDays] = useState([])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const dates = lastNDates(7)
      const summaries = await Promise.all(dates.map(d => api.meals.summary(d)))
      if (cancelled) return
      const today = todayISO()
      setDays(dates.map((date, i) => {
        const calories = summaries[i]?.calories || 0
        const logged = calories > 0
        const hit = logged && Math.abs(calories - goalCalories) <= goalCalories * TOLERANCE
        return { date, logged, hit, isToday: date === today }
      }))
    })()
    return () => { cancelled = true }
  }, [goalCalories])

  if (days.length === 0) return null

  return (
    <div className="weekly-tracker">
      <div className="section-header"><h3>This week</h3></div>
      <div className="weekly-tracker-row">
        {days.map(d => (
          <div key={d.date} className={`weekly-day ${d.isToday ? 'is-today' : ''}`}>
            <div className={`weekly-day-dot ${d.logged ? (d.hit ? 'hit' : 'miss') : 'empty'}`}>
              {d.logged ? (d.hit ? <Check size={12} /> : <Close size={12} />) : null}
            </div>
            <div className="weekly-day-label">{formatShort(d.date)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
