import PixelMark from './PixelMark.jsx'
import ThemeToggle from './ThemeToggle.jsx'
import { Droplet } from './Icons.jsx'

function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  )
}
function FoodIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 3v7a3 3 0 0 0 3 3v8" />
      <path d="M6 3v6M9 3v6" />
      <path d="M17 3c-2 0-3 2-3 5s1 4 3 4v9" />
    </svg>
  )
}
function WeightIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="13" r="8" />
      <path d="M9 3h6M12 13l3-3" />
    </svg>
  )
}
function WorkoutIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6.5 6.5l11 11M4 9l3-3 2 2-3 3-2-2zM15 18l3-3 2 2-3 3-2-2zM2 20l4-4M18 6l4-4" />
    </svg>
  )
}
function ProfileIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.5-4.5 5-6 8-6s6.5 1.5 8 6" />
    </svg>
  )
}
function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 13a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.56V19a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1H4a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.56-1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H10a1.7 1.7 0 0 0 1-1.56V4a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V10a1.7 1.7 0 0 0 1.56 1H20a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.56 1z" />
    </svg>
  )
}

const TABS = [
  { id: 'dashboard', label: 'Today', Icon: DashboardIcon },
  { id: 'food', label: 'Food', Icon: FoodIcon },
  { id: 'water', label: 'Water', Icon: Droplet },
  { id: 'weight', label: 'Weight', Icon: WeightIcon },
  { id: 'workouts', label: 'Workouts', Icon: WorkoutIcon },
  { id: 'profile', label: 'Profile', Icon: ProfileIcon },
  { id: 'settings', label: 'Settings', Icon: SettingsIcon },
]

export default function NavBar({ active, onChange, userEmail, userName, onSignOut }) {
  const displayName = userName || (userEmail ? userEmail.split('@')[0] : '')
  return (
    <nav className="sidebar" aria-label="Main">
      <div className="sidebar-brand">
        <PixelMark size={18} />
        <span>Tracker</span>
      </div>

      <div className="sidebar-nav">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={`nav-item ${active === id ? 'active' : ''}`}
            onClick={() => onChange(id)}
            aria-current={active === id ? 'page' : undefined}
            aria-label={label}
            title={label}
          >
            <Icon />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div className="sidebar-footer">
        <ThemeToggle />
        {userEmail && (
          <button
            type="button"
            className="nav-user"
            title={`Sign out of ${userEmail}`}
            onClick={() => {
              if (window.confirm('Sign out?')) onSignOut?.()
            }}
          >
            <span className="nav-avatar">{displayName.trim().charAt(0).toUpperCase()}</span>
            <span className="nav-email">{displayName}</span>
          </button>
        )}
      </div>
    </nav>
  )
}
