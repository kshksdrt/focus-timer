import { computed, reactive, ref } from "vue";
import { v4 as uuid } from "uuid";
import { Timer } from "@/scripts/store/interfaces";
import { storeTimersToLs } from './ls';
// import { storeTimersToLs } from "@/scripts/store/ls";

const presets = [
  {
    id: "cc03ab9b-e846-48a1-a44b-9990faad447e",
    name: "Pomodoro Timer",
    desc: "The Pomodoro Technique is a time management method developed by Francesco Cirillo in the late 1980s. The idea is to break down work into intervals, traditionally 25 minutes in length, separated by short breaks of 5 minutes.",
    spec: [
      { name: "work", icon: "work", duration: 25 },
      { name: "break", icon: "local_cafe", duration: 5 },
    ],
  }
]

// State
const timers = ref([] as Timer[])
const externals = ref([] as Timer[])
const currentTimer = ref({} as Timer)

const settings = reactive({
  lastUsedTimer: ""
})

presets.forEach(x => externals.value.push(x))
// Mutations
function importTimer (id: string) {
  const result = externals.value.find((x) => x.id === id);
  const doesExist = timers.value.find((x) => x.id === id);
  if (result && !doesExist) timers.value.push(result)
  syncLibraryToLs(timers.value)
}

function newTimer (timer: Timer) {
  timers.value.push(timer)
  syncLibraryToLs(timers.value)
}

function removeTimer (id: string) {
  const prev = JSON.parse(JSON.stringify(timers.value))
  const result = prev.filter((each: Timer) => {
    return each.id !== id
  })
  timers.value = []
  result.forEach((x: Timer) => timers.value.push(x))
  syncLibraryToLs(timers.value)
}

function selectTimer (id: string) {
  const result = timers.value.find((x) => x.id === id);
  if (result) currentTimer.value = { ...result }
}

// LocalStorage
function syncLibraryToLs(timers: Timer[]) {
  storeTimersToLs(timers)
}

function importLsData(library: Timer[]) {
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
  importLsData,
}