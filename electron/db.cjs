const path = require('node:path')
const { app } = require('electron')
const Database = require('better-sqlite3')

const dbPath = path.join(app.getPath('userData'), 'fitness-tracker.db')
const db = new Database(dbPath)
db.pragma('journal_mode = WAL')

const MICRO_COLUMNS = [
  ['fiber', 'g'], ['sugar', 'g'], ['sodium', 'mg'],
  ['potassium', 'mg'], ['calcium', 'mg'], ['iron', 'mg'], ['vitamin_c', 'mg'],
]

db.exec(`
  CREATE TABLE IF NOT EXISTS foods (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    serving_label TEXT NOT NULL DEFAULT '1 serving',
    calories REAL NOT NULL DEFAULT 0,
    protein REAL NOT NULL DEFAULT 0,
    carbs REAL NOT NULL DEFAULT 0,
    fat REAL NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS meal_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    meal_type TEXT NOT NULL DEFAULT 'snack',
    food_name TEXT NOT NULL,
    quantity REAL NOT NULL DEFAULT 1,
    calories REAL NOT NULL DEFAULT 0,
    protein REAL NOT NULL DEFAULT 0,
    carbs REAL NOT NULL DEFAULT 0,
    fat REAL NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS weight_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL UNIQUE,
    weight_kg REAL NOT NULL
  );

  CREATE TABLE IF NOT EXISTS workouts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    name TEXT NOT NULL,
    sets INTEGER,
    reps INTEGER,
    weight_kg REAL,
    duration_min REAL,
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS water_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    amount_ml REAL NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );
`)

// Migrate in micronutrient columns for installs created before they existed.
for (const table of ['foods', 'meal_entries']) {
  const existing = new Set(db.prepare(`PRAGMA table_info(${table})`).all().map(c => c.name))
  for (const [col] of MICRO_COLUMNS) {
    if (!existing.has(col)) {
      db.exec(`ALTER TABLE ${table} ADD COLUMN ${col} REAL NOT NULL DEFAULT 0`)
    }
  }
}

const MICRO_KEYS = MICRO_COLUMNS.map(([col]) => col)

function getSetting(key, fallback = null) {
  const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(key)
  return row ? row.value : fallback
}

function setSetting(key, value) {
  db.prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value').run(key, value)
}

// ---- Foods (reusable food library) ----
function listFoods() {
  return db.prepare('SELECT * FROM foods ORDER BY name COLLATE NOCASE').all()
}
function addFood(food) {
  const row = { ...Object.fromEntries(MICRO_KEYS.map(k => [k, 0])), ...food }
  const cols = ['name', 'serving_label', 'calories', 'protein', 'carbs', 'fat', ...MICRO_KEYS]
  const stmt = db.prepare(`INSERT INTO foods (${cols.join(', ')})
    VALUES (${cols.map(c => '@' + c).join(', ')})`)
  const info = stmt.run(row)
  return { id: info.lastInsertRowid, ...row }
}
function deleteFood(id) {
  db.prepare('DELETE FROM foods WHERE id = ?').run(id)
  return true
}

// ---- Meal entries (daily log) ----
function listMealEntries(date) {
  return db.prepare('SELECT * FROM meal_entries WHERE date = ? ORDER BY created_at').all(date)
}
function addMealEntry(entry) {
  const row = { ...Object.fromEntries(MICRO_KEYS.map(k => [k, 0])), ...entry }
  const cols = ['date', 'meal_type', 'food_name', 'quantity', 'calories', 'protein', 'carbs', 'fat', ...MICRO_KEYS]
  const stmt = db.prepare(`INSERT INTO meal_entries (${cols.join(', ')})
    VALUES (${cols.map(c => '@' + c).join(', ')})`)
  const info = stmt.run(row)
  return { id: info.lastInsertRowid, ...row }
}
function deleteMealEntry(id) {
  db.prepare('DELETE FROM meal_entries WHERE id = ?').run(id)
  return true
}
function dailySummary(date) {
  const cols = ['calories', 'protein', 'carbs', 'fat', ...MICRO_KEYS]
  const select = cols.map(c => `COALESCE(SUM(${c}),0) as ${c}`).join(', ')
  return db.prepare(`SELECT ${select} FROM meal_entries WHERE date = ?`).get(date)
}

// ---- Weight entries ----
function listWeightEntries(limit = 90) {
  return db.prepare('SELECT * FROM weight_entries ORDER BY date DESC LIMIT ?').all(limit)
}
function upsertWeightEntry(date, weight_kg) {
  db.prepare(`INSERT INTO weight_entries (date, weight_kg) VALUES (?, ?)
    ON CONFLICT(date) DO UPDATE SET weight_kg = excluded.weight_kg`).run(date, weight_kg)
  return db.prepare('SELECT * FROM weight_entries WHERE date = ?').get(date)
}
function deleteWeightEntry(id) {
  db.prepare('DELETE FROM weight_entries WHERE id = ?').run(id)
  return true
}

// ---- Workouts ----
function listWorkouts(date) {
  if (date) return db.prepare('SELECT * FROM workouts WHERE date = ? ORDER BY created_at').all(date)
  return db.prepare('SELECT * FROM workouts ORDER BY date DESC, created_at DESC LIMIT 200').all()
}
function addWorkout(entry) {
  const stmt = db.prepare(`INSERT INTO workouts (date, name, sets, reps, weight_kg, duration_min, notes)
    VALUES (@date, @name, @sets, @reps, @weight_kg, @duration_min, @notes)`)
  const info = stmt.run(entry)
  return { id: info.lastInsertRowid, ...entry }
}
function deleteWorkout(id) {
  db.prepare('DELETE FROM workouts WHERE id = ?').run(id)
  return true
}

// ---- Water entries ----
function listWaterEntries(date) {
  return db.prepare('SELECT * FROM water_entries WHERE date = ? ORDER BY created_at').all(date)
}
function addWaterEntry(entry) {
  const stmt = db.prepare('INSERT INTO water_entries (date, amount_ml) VALUES (@date, @amount_ml)')
  const info = stmt.run(entry)
  return { id: info.lastInsertRowid, ...entry }
}
function deleteWaterEntry(id) {
  db.prepare('DELETE FROM water_entries WHERE id = ?').run(id)
  return true
}

module.exports = {
  getSetting, setSetting,
  listFoods, addFood, deleteFood,
  listMealEntries, addMealEntry, deleteMealEntry, dailySummary,
  listWeightEntries, upsertWeightEntry, deleteWeightEntry,
  listWorkouts, addWorkout, deleteWorkout,
  listWaterEntries, addWaterEntry, deleteWaterEntry,
}
