import { Timer } from "@/scripts/types/timer";
import { HistoryEntry } from '../types/history';

const LS_KEYS = {
  saved: 'focus-timer.library',
  history: 'focus-timer.history'
}

let log = false;
if (process.env.NODE_ENV === "development") log = true;

export function storeTimersToLs (payload: Timer[]) {
  try {
    localStorage.setItem(LS_KEYS.saved, JSON.stringify(payload))
  } catch {
    console.assert(log, "Could not write to localStorage")
  }
}

export function getTimersFromLs () {
  let result = [];
  try {
    result = JSON.parse(localStorage.getItem(LS_KEYS.saved) || "[]")
  } catch (err) {
    console.assert(log, err)
  }
  return result
}

export function storeHistoryToLs (payload: HistoryEntry[]) {
  const start = Date.now()
  try {
    localStorage.setItem(LS_KEYS.history, JSON.stringify(payload))
  } catch {
    console.assert(log, "Could not write to localStorage")
  }
  const end = Date.now()
  console.assert(log, `Took ${end-start} milliseconds to store`)
}

export function getHistoryFromLs () {
  const start = Date.now()
  let result = [];
  try {
    result = JSON.parse(localStorage.getItem(LS_KEYS.history) || "[]")
  } catch (err) {
    console.assert(log, err)
  }
  const end = Date.now()
  console.assert(log, `Took ${end-start} milliseconds to read`)
  return result
}
