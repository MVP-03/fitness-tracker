import { useTheme } from '../lib/useTheme.js'

function SunGlyph() {
  return (
    <svg viewBox="0 0 8 8" width="13" height="13" shapeRendering="crispEdges" aria-hidden="true">
      <g fill="currentColor">
        <rect x="3" y="0" width="2" height="1" />
        <rect x="3" y="7" width="2" height="1" />
        <rect x="0" y="3" width="1" height="2" />
        <rect x="7" y="3" width="1" height="2" />
        <rect x="1" y="1" width="1" height="1" />
        <rect x="6" y="1" width="1" height="1" />
        <rect x="1" y="6" width="1" height="1" />
        <rect x="6" y="6" width="1" height="1" />
        <rect x="2" y="2" width="4" height="4" />
      </g>
    </svg>
  )
}

function MoonGlyph() {
  return (
    <svg viewBox="0 0 8 8" width="13" height="13" shapeRendering="crispEdges" aria-hidden="true">
      <g fill="currentColor">
        <rect x="3" y="0" width="3" height="1" />
        <rect x="2" y="1" width="4" height="1" />
        <rect x="1" y="2" width="4" height="4" />
        <rect x="2" y="6" width="4" height="1" />
        <rect x="3" y="7" width="3" height="1" />
      </g>
    </svg>
  )
}

export default function ThemeToggle({ compact = false }) {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'

  if (compact) {
    return (
      <button
        type="button"
        className="icon-btn"
        onClick={toggle}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        aria-pressed={isDark}
      >
        {isDark ? <SunGlyph /> : <MoonGlyph />}
      </button>
    )
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
    >
      <span>{isDark ? 'Dark mode' : 'Light mode'}</span>
      {isDark ? <SunGlyph /> : <MoonGlyph />}
    </button>
  )
}
