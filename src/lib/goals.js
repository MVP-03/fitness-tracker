// Static micronutrient targets (general adult RDAs) — not weight-dependent.
export const MICRO_TARGETS = {
  fiber: 30,       // g
  sugar: 50,       // g, upper limit
  sodium: 2300,    // mg, upper limit
  potassium: 3500, // mg
  calcium: 1000,   // mg
  iron: 12,        // mg (midpoint of male/female RDA)
  vitamin_c: 85,   // mg
}

export const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
}

const KCAL_PER_KG = 7700 // approx energy stored per kg of bodyweight

// Mifflin-St Jeor BMR, then TDEE, then a calorie target that moves current
// weight toward target weight at a safe weekly rate.
export function calculateGoals(profile) {
  const {
    sex = 'male',
    age = 30,
    height_cm = 170,
    current_weight_kg,
    target_weight_kg,
    activity_level = 'moderate',
    weekly_rate_kg = 0.5,
  } = profile

  if (!current_weight_kg || !height_cm || !age) return null

  const bmr = sex === 'female'
    ? 10 * current_weight_kg + 6.25 * height_cm - 5 * age - 161
    : 10 * current_weight_kg + 6.25 * height_cm - 5 * age + 5

  const tdee = bmr * (ACTIVITY_MULTIPLIERS[activity_level] || ACTIVITY_MULTIPLIERS.moderate)

  const weightDelta = (target_weight_kg ?? current_weight_kg) - current_weight_kg
  const direction = weightDelta > 0.1 ? 1 : weightDelta < -0.1 ? -1 : 0
  const dailyAdjustment = direction * Math.abs(weekly_rate_kg) * KCAL_PER_KG / 7

  // Cap the deficit so calories never drop below a safe floor.
  const safeFloor = sex === 'female' ? 1200 : 1500
  let calories = Math.round(tdee + dailyAdjustment)
  calories = Math.max(calories, safeFloor)

  // Protein scales with target bodyweight (supports muscle retention in a
  // deficit and growth in a surplus); fat is a fixed share of calories;
  // carbs fill the remainder.
  const proteinTarget = target_weight_kg || current_weight_kg
  const protein = Math.round(proteinTarget * (direction < 0 ? 2.0 : 1.8))
  const fat = Math.round((calories * 0.25) / 9)
  const carbsCalories = calories - protein * 4 - fat * 9
  const carbs = Math.round(Math.max(carbsCalories, 0) / 4)

  return {
    calories,
    protein,
    carbs,
    fat,
    ...MICRO_TARGETS,
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    direction,
  }
}
