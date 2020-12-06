import { computed, ref } from "vue";
// import { v4 as uuid } from "uuid";

import { Timer } from "@//types/timer";
import { storeTimersToLs } from '@/store/scripts/ls';

// State
const timers = ref([] as Timer[])
const externals = ref([] as Timer[])
const currentTimer = ref({} as Timer)
const timerSelected = ref(false)

// On startup
const library = require("@/lib/timersList.json");
library.forEach((x: Timer) => externals.value.push(x))

// Mutations
function importTimerFromExternal(id: string) {
  const result = externals.value.find((x) => x.id === id);
  const doesExist = timers.value.find((x) => x.id === id);
  if (result && !doesExist) timers.value.push(result)
  exportToLs(timers.value)
}

function newTimer(timer: Timer) {
  timers.value.push(timer)
  exportToLs(timers.value)
}

function removeTimer(id: string) {
  const prev = JSON.parse(JSON.stringify(timers.value))
  const result = prev.filter((each: Timer) => {
    return each.id !== id
  })
  timers.value = []
  result.forEach((x: Timer) => timers.value.push(x))
  exportToLs(timers.value)
}

function selectTimer(id: string) {
  const result = timers.value.find((x) => x.id === id);
  if (result) {
    currentTimer.value = { ...result }
    timerSelected.value = true
  }
}

function deselectTimer() {
  timerSelected.value = false
}

// LocalStorage
function exportToLs(timers: Timer[]) {
  storeTimersToLs(timers)
}

function batchImport(library: Timer[]) {
  timers.value = library
}

// Exports
export const get = {
  timers: computed(() => timers.value),
  externals: computed(() => externals.value),
  currentTimer: computed(() => currentTimer.value),
  timerSelected: computed(() => timerSelected.value),
}

export const mutate = {
  newTimer,
  removeTimer,
  selectTimer,
  deselectTimer,
  importTimerFromExternal,
  batchImport,
}

export default { get, mutate }