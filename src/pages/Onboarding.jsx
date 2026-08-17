import { useState } from 'react'
import PixelMark from '../components/PixelMark.jsx'
import { calculateGoals, ACTIVITY_MULTIPLIERS } from '../lib/goals.js'
import { calculateAge, todayISO } from '../lib/date.js'
import { api } from '../lib/api.js'

const empty = {
  sex: 'male',
  date_of_birth: '',
  height_cm: '',
  current_weight_kg: '',
  target_weight_kg: '',
  activity_level: 'moderate',
  weekly_rate_kg: 0.5,
}

export default function Onboarding({ onComplete }) {
  const [profile, setProfile] = useState(empty)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const age = calculateAge(profile.date_of_birth)
  const numericProfile = {
    ...profile,
    age,
    height_cm: Number(profile.height_cm),
    current_weight_kg: Number(profile.current_weight_kg),
    target_weight_kg: profile.target_weight_kg ? Number(profile.target_weight_kg) : null,
    weekly_rate_kg: Number(profile.weekly_rate_kg) || 0.5,
  }

  const ready = profile.date_of_birth && profile.height_cm && profile.current_weight_kg && age !== null
  const goals = ready ? calculateGoals(numericProfile) : null

  async function start() {
    if (!goals) return
    setSaving(true)
    setError('')
    try {
      await api.settings.set('profile', JSON.stringify(profile))
      await api.settings.set('goals', JSON.stringify(goals))
      onComplete(goals)
    } catch (err) {
      setError(err?.message || 'Failed to save your profile. Please try again.')
      setSaving(false)
    }
  }

  return (
    <div className="auth-screen onboarding-screen">
      <div className="auth-card onboarding-card">
        <div className="auth-brand">
          <PixelMark size={20} />
          <span>Welcome to Tracker</span>
        </div>
        <p className="hint">
          A one-time setup — your sex, birthday and height lock in once you start,
          since your calorie math depends on them staying consistent. Weight, target
          and activity level stay editable any time from the Profile tab.
        </p>

        <form className="profile-form onboarding-form" onSubmit={(e) => e.preventDefault()}>
          <label>Sex
            <select value={profile.sex} onChange={e => setProfile(p => ({ ...p, sex: e.target.value }))}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </label>
          <label>Birthday
            <input type="date" max={todayISO()} value={profile.date_of_birth}
              onChange={e => setProfile(p => ({ ...p, date_of_birth: e.target.value }))} />
          </label>
          <label>Height (cm)
            <input type="number" value={profile.height_cm}
              onChange={e => setProfile(p => ({ ...p, height_cm: e.target.value }))} />
          </label>
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
          <div className="goal-preview onboarding-preview">
            <div className="section-header"><h3>Your daily targets</h3></div>
            <div className="goal-grid">
              <Stat label="Age" value={`${age}`} />
              <Stat label="Calorie target" value={`${goals.calories} kcal`} />
              <Stat label="Protein" value={`${goals.protein} g`} />
              <Stat label="Carbs" value={`${goals.carbs} g`} />
              <Stat label="Fat" value={`${goals.fat} g`} />
              <Stat label="Water" value={`${goals.water_ml} ml`} />
            </div>
          </div>
        )}

        {error && <p className="hint error-hint">{error}</p>}

        <button className="add-btn" disabled={!ready || saving} onClick={start}>
          {saving ? 'Setting up…' : 'Start tracking'}
        </button>
      </div>
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
