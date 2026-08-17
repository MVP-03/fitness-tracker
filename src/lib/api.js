import { isCloudConfigured } from './supabaseClient.js'
import { cloudApi } from './cloudApi.js'

const CLOUD_SETTINGS_KEYS = new Set(['goals', 'profile'])

const localApi = window.api

export const api = isCloudConfigured
  ? {
      foods: cloudApi.foods,
      meals: cloudApi.meals,
      weight: cloudApi.weight,
      workouts: cloudApi.workouts,
      settings: {
        get: (key, fallback) => CLOUD_SETTINGS_KEYS.has(key)
          ? cloudApi.settings.get(key).then(v => v ?? fallback)
          : localApi.settings.get(key, fallback),
        set: (key, value) => CLOUD_SETTINGS_KEYS.has(key)
          ? cloudApi.settings.set(key, value)
          : localApi.settings.set(key, value),
      },
    }
  : localApi
