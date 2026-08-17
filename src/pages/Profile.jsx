import { useEffect, useState } from 'react'
import { calculateGoals, ACTIVITY_MULTIPLIERS } from '../lib/goals.js'
import { calculateAge, formatBirthday } from '../lib/date.js'
import { api } from '../lib/api.js'

const emptyProfile = {
  sex: 'male',
  date_of_birth: '',
  height_cm: '',
  current_weight_kg: '',
  target_weight_kg: '',
  activity_level: 'moderate',
  weekly_rate_kg: 0.5,
}

export default function Profile({ onGoalsApplied }) {
  const [profile, setProfile] = useState(emptyProfile)
  const [locked, setLocked] = useState(false)
  const [applied, setApplied] = useState(false)

  useEffect(() => {
    (async () => {
      const stored = await api.settings.get('profile')
      if (stored) {
        setProfile(JSON.parse(stored))
        setLocked(true)
      }
    })()
  }, [])

  const numericProfile = {
    ...profile,
    age: calculateAge(profile.date_of_birth),
    height_cm: Number(profile.height_cm),
    current_weight_kg: Number(profile.current_weight_kg),
    target_weight_kg: profile.target_weight_kg ? Number(profile.target_weight_kg) : null,
    weekly_rate_kg: Number(profile.weekly_rate_kg) || 0.5,
  }

  const goals = calculateGoals(numericProfile)

  async function apply() {
    const confirmed = window.confirm(
      'Apply these goals? This replaces your current daily calorie and macro targets on the Today dashboard.'
    )
    if (!confirmed) return
    await api.settings.set('profile', JSON.stringify(profile))
    await api.settings.set('goals', JSON.stringify(goals))
    setLocked(true)
    setApplied(true)
    onGoalsApplied?.(goals)
    setTimeout(() => setApplied(false), 2000)
  }

  const weightDelta = numericProfile.target_weight_kg
    ? numericProfile.target_weight_kg - numericProfile.current_weight_kg
    : 0

  return (
    <div className="page">
      <div className="section-header"><h3>Profile & goal calculator</h3></div>
      <p className="hint">
        {locked
          ? "Sex, birthday and height are locked in from setup — they rarely change and keep your calorie math consistent over time. Weight, target and activity level stay editable."
          : 'Set your stats and target weight — daily calorie, protein, carb and fat targets are calculated to move you toward that goal at a safe pace.'}
      </p>

      <form className="profile-form" onSubmit={(e) => e.preventDefault()}>
        {locked ? (
          <>
            <LockedField label="Sex" value={profile.sex === 'female' ? 'Female' : 'Male'} />
            <LockedField label="Birthday" value={profile.date_of_birth ? `${formatBirthday(profile.date_of_birth)} (${numericProfile.age})` : '—'} />
            <LockedField label="Height (cm)" value={profile.height_cm} />
          </>
        ) : (
          <>
            <label>Sex
              <select value={profile.sex} onChange={e => setProfile(p => ({ ...p, sex: e.target.value }))}>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </label>
            <label>Birthday
              <input type="date" value={profile.date_of_birth}
                onChange={e => setProfile(p => ({ ...p, date_of_birth: e.target.value }))} />
            </label>
            <label>Height (cm)
              <input type="number" value={profile.height_cm}
                onChange={e => setProfile(p => ({ ...p, height_cm: e.target.value }))} />
            </label>
          </>
        )}
        <label>Current weight (kg)
          <input type="number" step="0.1" value={profile.current_weight_kg}
            onChange={e => setProfile(p => ({ ...p, current_weight_kg: e.target.value }))} />
        </label>
        <label>Target weight (kg)
          <input type="number" step="0.1" value={profile.target_weight_kg}
            onChange={e => setProfile(p => ({ ...p, target_weight_kg: e.target.value }))} />
        </label>
        <label>Activity level
          <select value={profile.activity_level} onChange={e => setProfile(p => ({ ...p, activity_level: e.target.value }))}>
            {Object.keys(ACTIVITY_MULTIPLIERS).map(k => (
              <option key={k} value={k}>{k.replace('_', ' ')}</option>
            ))}
          </select>
        </label>
        <label>Target rate (kg/week)
          <input type="number" step="0.1" min="0.1" max="1" value={profile.weekly_rate_kg}
            onChange={e => setProfile(p => ({ ...p, weekly_rate_kg: e.target.value }))} />
        </label>
      </form>

      {goals && (
        <div className="goal-preview">
          <div className="section-header"><h3>Calculated daily targets</h3></div>
          <div className="goal-grid">
            <Stat label="BMR" value={`${goals.bmr} kcal`} />
            <Stat label="Maintenance (TDEE)" value={`${goals.tdee} kcal`} />
            <Stat label="Calorie target" value={`${goals.calories} kcal`} />
            <Stat label="Protein" value={`${goals.protein} g`} />
            <Stat label="Carbs" value={`${goals.carbs} g`} />
            <Stat label="Fat" value={`${goals.fat} g`} />
          </div>
          {weightDelta !== 0 && (
            <p className="hint">
              {weightDelta < 0 ? 'Cutting' : 'Bulking'} at ~{Math.abs(numericProfile.weekly_rate_kg)} kg/week
              {' '}({weightDelta < 0 ? 'deficit' : 'surplus'} of ~{Math.abs(goals.tdee - goals.calories)} kcal/day).
            </p>
          )}
          <button className="add-btn" onClick={apply}>
            {applied ? 'Applied ✓' : 'Apply to Today goals'}
          </button>
        </div>
      )}
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="goal-stat">
      <div className="goal-stat-value">{value}</div>
      <div className="goal-stat-label">{label}</div>
    </div>
  )
}

function LockedField({ label, value }) {
  return (
    <div className="locked-field">
      <span className="locked-field-label">{label}</span>
      <span className="locked-field-value">{value}</span>
    </div>
  )
}
