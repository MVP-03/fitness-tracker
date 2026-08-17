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
  const [profile, setProfile] = useState(null)
  const [nameInput, setNameInput] = useState('')
  const [nameSaved, setNameSaved] = useState(false)
  const [nameError, setNameError] = useState('')

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
      if (stored) {
        const parsed = JSON.parse(stored)
        setProfile(parsed)
        setNameInput(parsed.name || '')
      }
    })()
  }, [])

  async function save(ev) {
    ev.preventDefault()
    await window.api.settings.set('groq_api_key', groqKey.trim())
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function saveName(ev) {
    ev.preventDefault()
    const trimmed = nameInput.trim()
    if (!trimmed || !profile) return
    setNameError('')
    const next = { ...profile, name: trimmed }
    try {
      await api.settings.set('profile', JSON.stringify(next))
      setProfile(next)
      setNameSaved(true)
      setTimeout(() => setNameSaved(false), 2000)
    } catch (err) {
      setNameError(err.message || 'Could not save name')
    }
  }

  return (
    <div className="page">
      <div className="section-header"><h3>Settings</h3></div>

      {isElectron && (
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
      )}

      {profile && (
        <div className="settings-block">
          <h4>Display name</h4>
          <p className="hint">The name shown on your profile chip and in the app.</p>
          <form className="settings-form" onSubmit={saveName}>
            <input
              type="text"
              placeholder="Your name"
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
            />
            <button type="submit">{nameSaved ? 'Saved ✓' : 'Save name'}</button>
          </form>
          {nameError && <div className="form-error">{nameError}</div>}
        </div>
      )}

      {isCloudConfigured && session && (
        <div className="settings-block">
          <h4>Account</h4>
          <p className="hint">
            Signed in as {profile?.name ? `${profile.name} (${session.user.email})` : session.user.email}.
          </p>
          <button className="danger-btn" onClick={signOut} disabled={signingOut}>
            {signingOut ? 'Signing out…' : 'Log out'}
          </button>
        </div>
      )}
    </div>
  )
}
