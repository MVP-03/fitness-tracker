import { supabase } from './supabaseClient.js'

const MICRO_KEYS = ['fiber', 'sugar', 'sodium', 'potassium', 'calcium', 'iron', 'vitamin_c']

async function uid() {
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) throw new Error('Not signed in')
  return data.user.id
}

function check(result) {
  if (result.error) throw result.error
  return result.data
}

export const cloudApi = {
  foods: {
    async list() {
      const user_id = await uid()
      return check(await supabase.from('foods').select('*').eq('user_id', user_id).order('name'))
    },
    async add(food) {
      const user_id = await uid()
      const rows = check(await supabase.from('foods').insert({ ...food, user_id }).select())
      return rows[0]
    },
    async delete(id) {
      await uid()
      check(await supabase.from('foods').delete().eq('id', id))
      return true
    },
  },

  meals: {
    async list(date) {
      const user_id = await uid()
      return check(await supabase.from('meal_entries').select('*')
        .eq('user_id', user_id).eq('date', date).order('created_at'))
    },
    async add(entry) {
      const user_id = await uid()
      const rows = check(await supabase.from('meal_entries').insert({ ...entry, user_id }).select())
      return rows[0]
    },
    async delete(id) {
      await uid()
      check(await supabase.from('meal_entries').delete().eq('id', id))
      return true
    },
    async summary(date) {
      const user_id = await uid()
      const rows = check(await supabase.from('meal_entries').select('*')
        .eq('user_id', user_id).eq('date', date))
      const totals = { calories: 0, protein: 0, carbs: 0, fat: 0 }
      for (const k of MICRO_KEYS) totals[k] = 0
      for (const row of rows) {
        totals.calories += row.calories
        totals.protein += row.protein
        totals.carbs += row.carbs
        totals.fat += row.fat
        for (const k of MICRO_KEYS) totals[k] += row[k] || 0
      }
      return totals
    },
  },

  weight: {
    async list(limit = 90) {
      const user_id = await uid()
      return check(await supabase.from('weight_entries').select('*')
        .eq('user_id', user_id).order('date', { ascending: false }).limit(limit))
    },
    async upsert(date, weight_kg) {
      const user_id = await uid()
      const rows = check(await supabase.from('weight_entries')
        .upsert({ user_id, date, weight_kg }, { onConflict: 'user_id,date' }).select())
      return rows[0]
    },
    async delete(id) {
      await uid()
      check(await supabase.from('weight_entries').delete().eq('id', id))
      return true
    },
  },

  workouts: {
    async list(date) {
      const user_id = await uid()
      let query = supabase.from('workouts').select('*').eq('user_id', user_id)
      query = date ? query.eq('date', date).order('created_at') : query.order('date', { ascending: false }).limit(200)
      return check(await query)
    },
    async add(entry) {
      const user_id = await uid()
      const rows = check(await supabase.from('workouts').insert({ ...entry, user_id }).select())
      return rows[0]
    },
    async delete(id) {
      await uid()
      check(await supabase.from('workouts').delete().eq('id', id))
      return true
    },
  },

  water: {
    async list(date) {
      const user_id = await uid()
      return check(await supabase.from('water_entries').select('*')
        .eq('user_id', user_id).eq('date', date).order('created_at'))
    },
    async add(entry) {
      const user_id = await uid()
      const rows = check(await supabase.from('water_entries').insert({ ...entry, user_id }).select())
      return rows[0]
    },
    async delete(id) {
      await uid()
      check(await supabase.from('water_entries').delete().eq('id', id))
      return true
    },
  },

  // 'profile' and 'goals' live in the cloud profiles table so they follow the
  // signed-in person; any other setting (e.g. groq_api_key) stays local per
  // machine and is handled by the caller falling back to window.api.settings.
  settings: {
    async get(key) {
      const user_id = await uid()
      const rows = check(await supabase.from('profiles').select('*').eq('user_id', user_id))
      const row = rows[0]
      if (!row) return null
      if (key === 'goals') return row.goals ? JSON.stringify(row.goals) : null
      if (key === 'profile') {
        if (!row.onboarded) return null
        const { sex, date_of_birth, height_cm, current_weight_kg, target_weight_kg, activity_level, weekly_rate_kg } = row
        return JSON.stringify({ sex, date_of_birth, height_cm, current_weight_kg, target_weight_kg, activity_level, weekly_rate_kg })
      }
      return null
    },
    async set(key, value) {
      const user_id = await uid()
      if (key === 'goals') {
        check(await supabase.from('profiles').upsert({ user_id, goals: JSON.parse(value) }, { onConflict: 'user_id' }))
        return
      }
      if (key === 'profile') {
        const p = JSON.parse(value)
        check(await supabase.from('profiles').upsert({ user_id, ...p, onboarded: true }, { onConflict: 'user_id' }))
        return
      }
    },
  },
}
