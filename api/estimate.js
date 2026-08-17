const SYSTEM_PROMPT = `You are a nutrition estimation engine. Given a free-text food or meal
description — which may be lowercase, unpunctuated, or sloppily typed — estimate its total
nutrition and clean up the description into a proper food name. Respond with ONLY a JSON object
(no markdown, no prose) with these exact keys: name, calories, protein, carbs, fat, fiber, sugar,
sodium, potassium, calcium, iron, vitamin_c. "name" is the tidied-up version of the input: correct
casing (title case), correct spelling, sensible punctuation and "and"/commas between items, no
trailing period (e.g. "2 eggs and toast no butter" becomes "2 Eggs and Toast, No Butter"). The
numeric keys use these units: calories in kcal, protein/carbs/fat/fiber/sugar in grams,
sodium/potassium/calcium/vitamin_c in mg, iron in mg. Use reasonable USDA-style estimates for the
full described quantity (e.g. "2 eggs and toast" means both items combined). If a value is
negligible, use 0.`

const KEYS = ['calories', 'protein', 'carbs', 'fat', 'fiber', 'sugar', 'sodium', 'potassium', 'calcium', 'iron', 'vitamin_c']

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    res.status(500).json({ error: 'GROQ_API_KEY is not configured on the server' })
    return
  }

  const description = (req.body?.description || '').trim()
  if (!description) {
    res.status(400).json({ error: 'Missing description' })
    return
  }

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
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

    if (!groqRes.ok) {
      const text = await groqRes.text().catch(() => '')
      res.status(502).json({ error: `Groq API error (${groqRes.status}): ${text.slice(0, 300)}` })
      return
    }

    const data = await groqRes.json()
    const content = data.choices?.[0]?.message?.content
    if (!content) {
      res.status(502).json({ error: 'Groq returned no content' })
      return
    }

    const parsed = JSON.parse(content)
    const result = { name: typeof parsed.name === 'string' ? parsed.name.trim() : '' }
    for (const k of KEYS) result[k] = Number(parsed[k]) || 0
    res.status(200).json(result)
  } catch (err) {
    res.status(500).json({ error: err.message || 'Estimate failed' })
  }
}
