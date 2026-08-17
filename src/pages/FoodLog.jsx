import { useEffect, useState } from 'react'
import { formatNice, shiftDate } from '../lib/date.js'
import { api } from '../lib/api.js'
import { estimateNutrition } from '../lib/estimate.js'
import { ChevronLeft, ChevronRight, Close, Sparkle, Plus } from '../components/Icons.jsx'

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack']
const MICRO_FIELDS = [
  ['fiber', 'Fiber (g)'], ['sugar', 'Sugar (g)'], ['sodium', 'Sodium (mg)'],
  ['potassium', 'Potassium (mg)'], ['calcium', 'Calcium (mg)'], ['iron', 'Iron (mg)'], ['vitamin_c', 'Vitamin C (mg)'],
]
const emptyFood = {
  name: '', serving_label: '1 serving', calories: '', protein: '', carbs: '', fat: '',
  ...Object.fromEntries(MICRO_FIELDS.map(([k]) => [k, ''])),
}

export default function FoodLog({ date, setDate }) {
  const [foods, setFoods] = useState([])
  const [newFood, setNewFood] = useState(emptyFood)
  const [showNewFood, setShowNewFood] = useState(false)
  const [logQty, setLogQty] = useState({})
  const [logMeal, setLogMeal] = useState({})
  const [showMicros, setShowMicros] = useState(false)
  const [estimating, setEstimating] = useState(false)
  const [estimateError, setEstimateError] = useState('')

  async function refreshFoods() {
    setFoods(await api.foods.list())
  }

  useEffect(() => { refreshFoods() }, [])

  async function addFood(ev) {
    ev.preventDefault()
    const payload = {
      name: newFood.name.trim(),
      serving_label: newFood.serving_label.trim() || '1 serving',
      calories: Number(newFood.calories) || 0,
      protein: Number(newFood.protein) || 0,
      carbs: Number(newFood.carbs) || 0,
      fat: Number(newFood.fat) || 0,
      ...Object.fromEntries(MICRO_FIELDS.map(([k]) => [k, Number(newFood[k]) || 0])),
    }
    if (!payload.name) return
    await api.foods.add(payload)
    setNewFood(emptyFood)
    setShowNewFood(false)
    refreshFoods()
  }

  async function estimateWithAI() {
    if (!newFood.name.trim()) return
    setEstimating(true)
    setEstimateError('')
    try {
      const est = await estimateNutrition(newFood.name.trim())
      setNewFood(f => ({
        ...f,
        calories: est.calories, protein: est.protein, carbs: est.carbs, fat: est.fat,
        fiber: est.fiber, sugar: est.sugar, sodium: est.sodium,
        potassium: est.potassium, calcium: est.calcium, iron: est.iron, vitamin_c: est.vitamin_c,
      }))
      setShowMicros(true)
    } catch (err) {
      setEstimateError(err.message || 'Estimate failed')
    } finally {
      setEstimating(false)
    }
  }

  async function removeFood(id) {
    await api.foods.delete(id)
    refreshFoods()
  }

  async function logEntry(food) {
    const qty = Number(logQty[food.id]) || 1
    const mealType = logMeal[food.id] || 'snack'
    await api.meals.add({
      date,
      meal_type: mealType,
      food_name: food.name,
      quantity: qty,
      calories: food.calories * qty,
      protein: food.protein * qty,
      carbs: food.carbs * qty,
      fat: food.fat * qty,
      ...Object.fromEntries(MICRO_FIELDS.map(([k]) => [k, (food[k] || 0) * qty])),
    })
  }

  return (
    <div className="page">
      <div className="date-nav">
        <button onClick={() => setDate(shiftDate(date, -1))} aria-label="Previous day"><ChevronLeft /></button>
        <div className="date-label">Logging for {formatNice(date)}</div>
        <button onClick={() => setDate(shiftDate(date, 1))} aria-label="Next day"><ChevronRight /></button>
      </div>

      <div className="section-header">
        <h3>Food library</h3>
        <button className="link-btn" onClick={() => setShowNewFood(v => !v)}>
          {showNewFood ? <Close size={13} /> : <Plus size={13} />}
          {showNewFood ? 'Cancel' : 'New food'}
        </button>
      </div>

      {showNewFood && (
        <form className="food-form" onSubmit={addFood}>
          <input placeholder="e.g. 2 eggs and toast" value={newFood.name}
            onChange={e => setNewFood(f => ({ ...f, name: e.target.value }))} />
          <button type="button" className="add-btn" onClick={estimateWithAI} disabled={estimating}>
            <Sparkle size={14} />
            {estimating ? 'Estimating…' : 'Estimate with AI'}
          </button>
          {estimateError && <div className="form-error">{estimateError}</div>}
          <input placeholder="Serving (e.g. 100g)" value={newFood.serving_label}
            onChange={e => setNewFood(f => ({ ...f, serving_label: e.target.value }))} />
          <input type="number" placeholder="Calories" value={newFood.calories}
            onChange={e => setNewFood(f => ({ ...f, calories: e.target.value }))} />
          <input type="number" placeholder="Protein (g)" value={newFood.protein}
            onChange={e => setNewFood(f => ({ ...f, protein: e.target.value }))} />
          <input type="number" placeholder="Carbs (g)" value={newFood.carbs}
            onChange={e => setNewFood(f => ({ ...f, carbs: e.target.value }))} />
          <input type="number" placeholder="Fat (g)" value={newFood.fat}
            onChange={e => setNewFood(f => ({ ...f, fat: e.target.value }))} />

          <button type="button" className="link-btn micro-toggle" onClick={() => setShowMicros(v => !v)}>
            {showMicros ? 'Hide micronutrients' : 'Add micronutrients (optional)'}
          </button>
          {showMicros && MICRO_FIELDS.map(([key, label]) => (
            <input
              key={key} type="number" placeholder={label} value={newFood[key]}
              onChange={e => setNewFood(f => ({ ...f, [key]: e.target.value }))}
            />
          ))}

          <button type="submit">Save food</button>
        </form>
      )}

      {foods.length === 0 ? (
        <p className="empty">No foods yet — add one above to start logging.</p>
      ) : (
        <ul className="food-list">
          {foods.map(food => (
            <li key={food.id} className="food-row">
              <div className="food-info">
                <div className="food-name">{food.name}</div>
                <div className="food-meta">
                  {food.serving_label} · {Math.round(food.calories)} kcal ·
                  {' '}{Math.round(food.protein)}p / {Math.round(food.carbs)}c / {Math.round(food.fat)}f
                </div>
              </div>
              <div className="food-actions">
                <input
                  type="number" step="0.25" min="0" className="qty-input"
                  value={logQty[food.id] ?? 1}
                  onChange={e => setLogQty(q => ({ ...q, [food.id]: e.target.value }))}
                />
                <select
                  value={logMeal[food.id] ?? 'snack'}
                  onChange={e => setLogMeal(m => ({ ...m, [food.id]: e.target.value }))}
                >
                  {MEAL_TYPES.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <button className="add-btn" onClick={() => logEntry(food)}>Log</button>
                <button className="icon-btn" onClick={() => removeFood(food.id)} aria-label="Delete food"><Close /></button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
