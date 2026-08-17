const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')
const fs = require('node:fs')

loadDotEnv()

function loadDotEnv() {
  const envPath = path.join(__dirname, '..', '.env')
  if (!fs.existsSync(envPath)) return
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const idx = trimmed.indexOf('=')
    if (idx === -1) continue
    const key = trimmed.slice(0, idx).trim()
    const value = trimmed.slice(idx + 1).trim()
    if (value && !process.env[key]) process.env[key] = value
  }
}

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: '#0f1115',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  const startUrl = process.env.ELECTRON_START_URL
  if (startUrl) {
    mainWindow.loadURL(startUrl)
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'))
  }
}

app.whenReady().then(() => {
  const db = require('./db.cjs')
  const { estimateNutrition } = require('./groq.cjs')
  registerIpc(db, estimateNutrition)
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

function registerIpc(db, estimateNutrition) {
  ipcMain.handle('groq:estimate', async (_e, description) => {
    const apiKey = db.getSetting('groq_api_key') || process.env.GROQ_API_KEY
    return estimateNutrition(description, apiKey)
  })

  ipcMain.handle('foods:list', () => db.listFoods())
  ipcMain.handle('foods:add', (_e, food) => db.addFood(food))
  ipcMain.handle('foods:delete', (_e, id) => db.deleteFood(id))

  ipcMain.handle('meals:list', (_e, date) => db.listMealEntries(date))
  ipcMain.handle('meals:add', (_e, entry) => db.addMealEntry(entry))
  ipcMain.handle('meals:delete', (_e, id) => db.deleteMealEntry(id))
  ipcMain.handle('meals:summary', (_e, date) => db.dailySummary(date))

  ipcMain.handle('weight:list', (_e, limit) => db.listWeightEntries(limit))
  ipcMain.handle('weight:upsert', (_e, date, weightKg) => db.upsertWeightEntry(date, weightKg))
  ipcMain.handle('weight:delete', (_e, id) => db.deleteWeightEntry(id))

  ipcMain.handle('workouts:list', (_e, date) => db.listWorkouts(date))
  ipcMain.handle('workouts:add', (_e, entry) => db.addWorkout(entry))
  ipcMain.handle('workouts:delete', (_e, id) => db.deleteWorkout(id))

  ipcMain.handle('settings:get', (_e, key, fallback) => db.getSetting(key, fallback))
  ipcMain.handle('settings:set', (_e, key, value) => db.setSetting(key, value))
}
