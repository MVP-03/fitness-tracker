export default function MacroRing({ value, goal, label, color }) {
  const pct = goal > 0 ? Math.min(value / goal, 1) : 0
  const r = 42
  const c = 2 * Math.PI * r
  const offset = c * (1 - pct)

  return (
    <div className="macro-ring">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} className="ring-track" />
        <circle
          cx="50" cy="50" r={r}
          className="ring-progress"
          style={{ stroke: color, strokeDasharray: c, strokeDashoffset: offset }}
          transform="rotate(-90 50 50)"
        />
        <text x="50" y="47" textAnchor="middle" className="ring-value">{Math.round(value)}</text>
        <text x="50" y="63" textAnchor="middle" className="ring-goal">/ {goal}</text>
      </svg>
      <div className="ring-label">{label}</div>
    </div>
  )
}
