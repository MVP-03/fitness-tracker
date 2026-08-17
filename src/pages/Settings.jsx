import { useEffect, useState } from 'react'

export default function Settings() {
  const [groqKey, setGroqKey] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    (async () => {
      const stored = await window.api.settings.get('groq_api_key')
      if (stored) setGroqKey(stored)
    })()
  }, [])

  async function save(ev) {
    ev.preventDefault()
    await window.api.settings.set('groq_api_key', groqKey.trim())
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="page">
      <div className="section-header"><h3>Settings</h3></div>

      <div className="settings-block">
        <h4>Groq API key</h4>
        <p className="hint">
          Powers "Estimate with AI" on the Food tab — describe a meal in plain
          English and it fills in calories, macros and micros for you. Stored
          locally on this machine only.
        </p>
        <form className="settings-form" onSubmit={save}>
          <input
            type="password"
            placeholder="gsk_..."
            value={groqKey}
            onChange={e => setGroqKey(e.target.value)}
          />
          <button type="submit">{saved ? 'Saved ✓' : 'Save key'}</button>
        </form>
      </div>

      <div className="settings-block">
        <h4>Shared cloud database</h4>
        <p className="hint">
          Not connected yet. Once a Supabase project is ready, its URL and anon
          key go here so this app can log in each person separately and sync
          their food, weight and workout data to one shared backend.
        </p>
      </div>
    </div>
  )
}
