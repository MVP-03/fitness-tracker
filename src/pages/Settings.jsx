import { useEffect, useState } from 'react'
import { isCloudConfigured, supabase } from '../lib/supabaseClient.js'
import { useAuth } from '../lib/AuthContext.jsx'
import { api } from '../lib/api.js'

const isElectron = Boolean(window.api)

export default function Settings() {
  const [groqKey, setGroqKey] = useState('')
  const [saved, setSaved] = useState(false)
  const { session } = useAuth()
  const [signingOut, setSigningOut] = useState(false)
  const [profileName, setProfileName] = useState('')

  async function signOut() {
    setSigningOut(true)
    await supabase.auth.signOut()
  }

  useEffect(() => {
    if (!isElectron) return
    (async () => {
      const stored = await window.api.settings.get('groq_api_key')
      if (stored) setGroqKey(stored)
    })()
  }, [])

  useEffect(() => {
    (async () => {
      const stored = await api.settings.get('profile')
      if (stored) setProfileName(JSON.parse(stored).name || '')
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

      {isElectron ? (
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
      ) : (
        <div className="settings-block">
          <h4>Groq API key</h4>
          <p className="hint">
            "Estimate with AI" on the Food tab is powered by a shared server key
            on the web version — nothing to configure here.
          </p>
        </div>
      )}

      <div className="settings-block">
        <h4>Shared cloud database</h4>
        <p className="hint">
          {isCloudConfigured
            ? 'Connected — food, weight and workout data sync to Supabase and each person signs in separately.'
            : 'Not connected yet. Once a Supabase project is ready, its URL and anon key go here so this app can log in each person separately and sync their food, weight and workout data to one shared backend.'}
        </p>
      </div>

      {isCloudConfigured && session && (
        <div className="settings-block">
          <h4>Account</h4>
          <p className="hint">
            Signed in as {profileName ? `${profileName} (${session.user.email})` : session.user.email}.
          </p>
          <button className="danger-btn" onClick={signOut} disabled={signingOut}>
            {signingOut ? 'Signing out…' : 'Log out'}
          </button>
        </div>
      )}
    </div>
  )
}
