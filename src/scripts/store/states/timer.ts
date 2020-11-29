import { computed, reactive, ref } from "vue";
import { v4 as uuid } from "uuid";

import { Timer } from "@/scripts/types/interfaces";
import { storeTimersToLs } from '../ls';

// State
const timers = ref([] as Timer[])
const externals = ref([] as Timer[])
const currentTimer = ref({} as Timer)
const settings = reactive({
  lastUsedTimer: ""
})

// On startup
const library = require("@/lib/timersList.json");
library.forEach((x: Timer) => externals.value.push(x))

// Mutations
function importTimer (id: string) {
  const result = externals.value.find((x) => x.id === id);
  const doesExist = timers.value.find((x) => x.id === id);
  if (result && !doesExist) timers.value.push(result)
  exportToLs(timers.value)
}

function newTimer (timer: Timer) {
  timers.value.push(timer)
  exportToLs(timers.value)
}

function removeTimer (id: string) {
  const prev = JSON.parse(JSON.stringify(timers.value))
  const result = prev.filter((each: Timer) => {
    return each.id !== id
  })
  timers.value = []
  result.forEach((x: Timer) => timers.value.push(x))
  exportToLs(timers.value)
}

function selectTimer (id: string) {
  const result = timers.value.find((x) => x.id === id);
  if (result) currentTimer.value = { ...result }
}

// LocalStorage
function exportToLs(timers: Timer[]) {
  storeTimersToLs(timers)
}

function importFromLs(library: Timer[]) {
  timers.value = library
}

// Exports
export const get = {
  timers,
  externals,
  currentTimer,
}

export const mutate = {
  newTimer,
  removeTimer,
  selectTimer,
  importTimer,
  importFromLs,
}

export default { get, mutate }