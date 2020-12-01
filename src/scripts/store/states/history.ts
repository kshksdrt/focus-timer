import { Count, HistoryEntry } from "@/scripts/types/history";
import { computed, ref } from 'vue';

import { storeHistoryToLs } from '../ls';

// State
const history = ref([] as HistoryEntry[])

// Computed
const todaysSessions = computed((): Count[] => {
  const fullHistory: HistoryEntry[] = get.history.value;
  const today = new Date();
  const result = [] as Count[];

  fullHistory.reverse().some((current) => {
    const currentItemDate = new Date(current.ts);
    if (
      currentItemDate.getDate() === today.getDate() &&
      currentItemDate.getMonth() === today.getMonth() &&
      currentItemDate.getFullYear() === today.getFullYear()
    ) {
      const existingCount = result.find((x) => x.name === current.name);
      if (existingCount) {
        existingCount.count++;
      } else {
        result.push({ name: current.name, count: 1 });
      }
      return false;
    }
    return true;
  });
  return result;
});

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
  todaysSessions
}

export const mutate = {
  newEntry,
  importFromLs,
}

export default { get, mutate }