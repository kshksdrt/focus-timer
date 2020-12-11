import { HistoryEntry, HistoryV2Entry, HistoryEntryIndeterminate } from "@//types/history";
import { computed, ref } from 'vue';

import { storeHistoryToLs } from '@/store/scripts/ls';
import { migrateToHistoryV2 } from '../scripts/migrations';
import { Timer } from '@/types/timer';

// State
const history = ref([] as HistoryV2Entry[])

// Mutations
function newEntry(timerId: string, duration: number) {
  const entry = {
    ts: new Date(),
    timerId, duration
  };
  history.value.push(entry as HistoryV2Entry)
  exportToLs()
}

// LocalStorage
function exportToLs() {
  storeHistoryToLs(history.value)
}

function batchImport(data: HistoryEntryIndeterminate[], timers: Timer[]) {
  if (data.length > 0 && Object.keys(data[0]).includes("name")) {
    console.log("Migrating data to v2")
    data = migrateToHistoryV2(data as HistoryEntry[], timers)
  }
  // mergeOldEntries(data)
  data = data.sort((a, b) => (a.ts < b.ts) ? -1 : ((a.ts > b.ts) ? 1 : 0))
  history.value = data.reduce((acc, entry) => {
    if (!entry.timerId) return acc
    acc.push({
      timerId: entry.timerId,
      ts: entry.ts,
      duration: entry.duration,
    })
    return acc
  }, [] as HistoryV2Entry[])
  exportToLs()
}

// Exports
export const get = {
  history: computed(() => history.value),
}

export const mutate = {
  newEntry,
  batchImport,
}

export default { get, mutate }