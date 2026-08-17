import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isCloudConfigured = Boolean(url && anonKey)

// Supabase's default auth lock coordinates session refreshes across browser tabs
// via the Web Locks API. This is a single-window Electron/Vite app, not a
// multi-tab browser session, and in dev the lock can get orphaned by a stale
// HMR module instance and never release — every future auth call then queues
// forever with zero network activity. A no-op lock removes that failure mode.
const noopLock = async (_name, _acquireTimeout, fn) => fn()

export const supabase = isCloudConfigured
  ? createClient(url, anonKey, { auth: { lock: noopLock } })
  : null
