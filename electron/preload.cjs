const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
  foods: {
    list: () => ipcRenderer.invoke('foods:list'),
    add: (food) => ipcRenderer.invoke('foods:add', food),
    delete: (id) => ipcRenderer.invoke('foods:delete', id),
  },
  meals: {
    list: (date) => ipcRenderer.invoke('meals:list', date),
    add: (entry) => ipcRenderer.invoke('meals:add', entry),
    delete: (id) => ipcRenderer.invoke('meals:delete', id),
    summary: (date) => ipcRenderer.invoke('meals:summary', date),
  },
  weight: {
    list: (limit) => ipcRenderer.invoke('weight:list', limit),
    upsert: (date, weightKg) => ipcRenderer.invoke('weight:upsert', date, weightKg),
    delete: (id) => ipcRenderer.invoke('weight:delete', id),
  },
  workouts: {
    list: (date) => ipcRenderer.invoke('workouts:list', date),
    add: (entry) => ipcRenderer.invoke('workouts:add', entry),
    delete: (id) => ipcRenderer.invoke('workouts:delete', id),
  },
  settings: {
    get: (key, fallback) => ipcRenderer.invoke('settings:get', key, fallback),
    set: (key, value) => ipcRenderer.invoke('settings:set', key, value),
  },
  groq: {
    estimate: (description) => ipcRenderer.invoke('groq:estimate', description),
  },
})
