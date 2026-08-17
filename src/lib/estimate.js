export async function estimateNutrition(description) {
  if (window.api?.groq) return window.api.groq.estimate(description)

  const res = await fetch('/api/estimate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Estimate failed')
  return data
}
