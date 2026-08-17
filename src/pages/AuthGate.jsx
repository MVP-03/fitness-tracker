import { useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'
import PixelMark from '../components/PixelMark.jsx'
import ThemeToggle from '../components/ThemeToggle.jsx'

export default function AuthGate() {
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(ev) {
    ev.preventDefault()
    setError('')
    setInfo('')
    setBusy(true)
    try {
      if (mode === 'signin') {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password })
        if (err) throw err
      } else {
        const { error: err } = await supabase.auth.signUp({ email, password })
        if (err) throw err
        setInfo('Account created. If email confirmation is required, check your inbox, then sign in.')
      }
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-theme-toggle"><ThemeToggle compact /></div>
      <form className="auth-card" onSubmit={submit}>
        <div className="auth-brand"><PixelMark size={20} /> Fitness Tracker</div>
        <p className="hint">
          {mode === 'signin' ? 'Sign in to your shared tracker.' : 'Create an account to start tracking.'}
        </p>
        <input
          type="email" placeholder="Email" value={email} required
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password" placeholder="Password" value={password} required minLength={6}
          onChange={e => setPassword(e.target.value)}
        />
        {error && <div className="form-error">{error}</div>}
        {info && <div className="form-info">{info}</div>}
        <button type="submit" disabled={busy}>
          {busy ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Sign up'}
        </button>
        <button
          type="button" className="link-btn"
          onClick={() => { setMode(m => m === 'signin' ? 'signup' : 'signin'); setError(''); setInfo('') }}
        >
          {mode === 'signin' ? "Need an account? Sign up" : 'Already have an account? Sign in'}
        </button>
      </form>
    </div>
  )
}
