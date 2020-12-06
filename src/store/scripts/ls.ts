import { Settings } from '@//types/app';
import { Timer } from "@//types/timer";
import { HistoryEntry } from '../../types/history';

const LS_KEYS = {
  saved: 'focus-timer.library',
  history: 'focus-timer.history',
  settings: 'focus-timer.settings',
}

type keys = 'saved' | 'history' | 'settings'

let log = false;
if (process.env.NODE_ENV === "development") log = true;

function write<T>(key: string, value: T) {
  const start = Date.now()
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    if (log) console.log("Could not write to localStorage")
  }
  const end = Date.now()
  if (log) console.log(`Took ${end-start} milliseconds to store`)
}

function read(key: string, fallback: string) {
  let result
  try {
    result = JSON.parse(localStorage.getItem(key) || fallback)
  } catch (err) {
    if (log) console.log(err)
  }
  return result
}

export function storeTimersToLs (payload: Timer[]) {
    write(LS_KEYS.saved, payload)
}

export function getTimersFromLs () {
  return read(LS_KEYS.saved, "[]")
}

export function storeHistoryToLs (payload: HistoryEntry[]) {
  write(LS_KEYS.history, payload)
}

export function getHistoryFromLs () {
  return read(LS_KEYS.history, "[]")
}

export function storeSettingsToLs (payload: Settings) {
  write(LS_KEYS.settings, payload)
}

export function getSettingsFromLs () {
  return read(LS_KEYS.settings, "{}")
}

export function clearLocalStorage() {
  Object.keys(LS_KEYS).forEach(key => {
    write(LS_KEYS[key as keys], "null")
  })
}