import { Timer } from "@/scripts/types/interfaces";

const LS_KEYS = {
  saved: 'focus-timer.library'
}

export function storeTimersToLs (payload: Timer[]) {
  try {
    localStorage.setItem(LS_KEYS.saved, JSON.stringify(payload))
  } catch {
    console.log("Could not write to localStorage")
  }
}
export function getTimersFromLs () {
  let result = [];
  try {
    result = JSON.parse(localStorage.getItem(LS_KEYS.saved) || "[]")
  } catch (err) {
    console.log(err)
  }
  return result
}
