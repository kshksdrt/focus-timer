import { HistoryEntry, HistoryV2Entry } from "@//types/history";
import { computed, ref } from 'vue';

import { mergeOldHistory } from '@/scripts/historyUtils';
import { storeHistoryToLs } from '@/scripts/ls';
import { migrateToHistoryV2 } from '@/scripts/migrations';
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

function deleteEntriesByTimer(timerId: string) {
  history.value = history.value.filter(x => (x.timerId !== timerId))
  storeHistoryToLs(history.value)
}

// External data
function batchImport(data: HistoryEntry[] | HistoryV2Entry[], timers: Timer[]) {
  // Middleware: Migrate v1 to v2
  let historyV2: HistoryV2Entry[]
  if (data.length > 0 && Object.keys(data[0]).includes("name")) {
    console.log("Migrating data to v2")
    historyV2 = migrateToHistoryV2(data as HistoryEntry[], timers)
  } else {
    historyV2 = data as HistoryV2Entry[]
  }

  // Middleware: Merge
  historyV2 = mergeOldHistory(historyV2 as HistoryV2Entry[], timers)

  // Middleware: Delete old year entries

  // Middleware: Sort
  historyV2 = historyV2.sort((a, b) => (a.ts < b.ts) ? -1 : ((a.ts > b.ts) ? 1 : 0))

  // Batch import
  history.value = historyV2.reduce((acc, entry) => {
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

function exportToLs() {
  storeHistoryToLs(history.value)
}

// Exports
export const get = {
  history: computed(() => history.value),
}

export const mutate = {
  newEntry,
  deleteEntriesByTimer,
  batchImport,
}

export default { get, mutate }