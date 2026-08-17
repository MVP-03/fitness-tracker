import { useEffect, useState } from 'react'
import NavBar from './components/NavBar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import FoodLog from './pages/FoodLog.jsx'
import Water from './pages/Water.jsx'
import Weight from './pages/Weight.jsx'
import Workouts from './pages/Workouts.jsx'
import Profile from './pages/Profile.jsx'
import Settings from './pages/Settings.jsx'
import AuthGate from './pages/AuthGate.jsx'
import Onboarding from './pages/Onboarding.jsx'
import { todayISO } from './lib/date.js'
import { useAuth } from './lib/AuthContext.jsx'
import { isCloudConfigured, supabase } from './lib/supabaseClient.js'
import { api } from './lib/api.js'

export default function App() {
  const [tab, setTab] = useState('dashboard')
  const [date, setDate] = useState(todayISO())
  const { session, loading } = useAuth()
  const [onboarded, setOnboarded] = useState(null)
  const [profileName, setProfileName] = useState('')

  useEffect(() => {
    if (isCloudConfigured && !session) return
    (async () => {
      const stored = await api.settings.get('profile')
      setOnboarded(Boolean(stored))
      if (stored) setProfileName(JSON.parse(stored).name || '')
    })()
  }, [session])

  if (isCloudConfigured) {
    if (loading) return <div className="auth-screen"><div className="hint">Loading…</div></div>
    if (!session) return <AuthGate />
  }

  if (onboarded === null) return <div className="auth-screen"><div className="hint">Loading…</div></div>
  if (!onboarded) {
    return (
      <Onboarding
        onComplete={(_, name) => { setOnboarded(true); setProfileName(name) }}
      />
    )
  }

  return (
    <div className="app">
      <NavBar
        active={tab}
        onChange={setTab}
        userEmail={session?.user?.email}
        userName={profileName}
        onSignOut={isCloudConfigured ? () => supabase.auth.signOut() : null}
      />
      <main className="main">
        {tab === 'dashboard' && <Dashboard date={date} setDate={setDate} />}
        {tab === 'food' && <FoodLog date={date} setDate={setDate} />}
        {tab === 'water' && <Water date={date} setDate={setDate} />}
        {tab === 'weight' && <Weight />}
        {tab === 'workouts' && <Workouts date={date} setDate={setDate} />}
        {tab === 'profile' && <Profile />}
        {tab === 'settings' && <Settings />}
      </main>
    </div>
  )
}
