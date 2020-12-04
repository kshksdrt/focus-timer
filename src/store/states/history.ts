import { CountQueryResult, HistoryEntry } from "@//types/history";
import { computed, ref, watchEffect } from 'vue';

import { storeHistoryToLs } from '@/store/scripts/ls';
import { getAllTimersCounts } from '@/store/scripts/queries';

// State
const history = ref([] as HistoryEntry[])
const todaysSessions = ref([] as CountQueryResult[])

// Watchers
watchEffect(() => {
  const today = new Date()
  todaysSessions.value = getAllTimersCounts(history.value, "day", today)
})

// Mutations
function newEntry(name: string, duration: number) {
  const entry = {
    ts: new Date(),
    name, duration
  };
  history.value.push(entry as HistoryEntry)
  exportToLs(history.value)
}

// LocalStorage
function exportToLs(history: HistoryEntry[]) {
  storeHistoryToLs(history)
}

function importFromLs(library: HistoryEntry[]) {
  history.value = library
}

// Exports
export const get = {
  history: computed(() => history.value),
  todaysSessions,
}

export const mutate = {
  newEntry,
  importFromLs,
}

export default { get, mutate }