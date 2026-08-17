const SYSTEM_PROMPT = `You are a nutrition estimation engine. Given a free-text food or meal
description, estimate its total nutrition. Respond with ONLY a JSON object (no markdown, no
prose) with these exact numeric keys: calories, protein, carbs, fat, fiber, sugar, sodium,
potassium, calcium, iron, vitamin_c. Units: calories in kcal, protein/carbs/fat/fiber/sugar in
grams, sodium/potassium/calcium/vitamin_c in mg, iron in mg. Use reasonable USDA-style estimates
for the full described quantity (e.g. "2 eggs and toast" means both items combined). If a value
is negligible, use 0.`

async function estimateNutrition(description, apiKey) {
  if (!apiKey) throw new Error('No Groq API key configured. Add one in Settings.')

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'openai/gpt-oss-120b',
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: description },
      ],
    }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Groq API error (${res.status}): ${text.slice(0, 300)}`)
  }

  const data = await res.json()
  const content = data.choices?.[0]?.message?.content
  if (!content) throw new Error('Groq returned no content')

  const parsed = JSON.parse(content)
  const keys = ['calories', 'protein', 'carbs', 'fat', 'fiber', 'sugar', 'sodium', 'potassium', 'calcium', 'iron', 'vitamin_c']
  const result = {}
  for (const k of keys) result[k] = Number(parsed[k]) || 0
  return result
}

module.exports = { estimateNutrition }
