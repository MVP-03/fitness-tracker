export function todayISO() {
  const d = new Date()
  const tzOffset = d.getTimezoneOffset() * 60000
  return new Date(d.getTime() - tzOffset).toISOString().slice(0, 10)
}

export function shiftDate(iso, days) {
  const d = new Date(iso + 'T00:00:00')
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

function pad2(n) {
  return String(n).padStart(2, '0')
}

// dd/mm/yyyy — Indian date format, used everywhere instead of locale-dependent formatting.
export function formatDDMMYYYY(iso) {
  const d = new Date(iso + 'T00:00:00')
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`
}

export function formatNice(iso) {
  const d = new Date(iso + 'T00:00:00')
  const weekday = d.toLocaleDateString(undefined, { weekday: 'short' })
  return `${weekday}, ${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`
}

export function formatShort(iso) {
  const d = new Date(iso + 'T00:00:00')
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}`
}

export function calculateAge(dobISO) {
  if (!dobISO) return null
  const dob = new Date(dobISO + 'T00:00:00')
  if (Number.isNaN(dob.getTime())) return null
  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const monthDiff = today.getMonth() - dob.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) age--
  return age
}

export function formatBirthday(dobISO) {
  return formatDDMMYYYY(dobISO)
}

// Last N calendar dates ending today, oldest first — used by the weekly goal tracker.
export function lastNDates(n) {
  const out = []
  const today = todayISO()
  for (let i = n - 1; i >= 0; i--) out.push(shiftDate(today, -i))
  return out
}
