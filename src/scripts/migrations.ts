import { HistoryEntry, HistoryV2Entry } from '@/types/history';
import { Timer } from '@/types/timer';

export function migrateToHistoryV2(history: HistoryEntry[], timers: Timer[]): HistoryV2Entry[] {
  return history.reduce((acc, current) => {
    const { name, ts, duration } = current
    const t = timers.find(timer => timer.name === name)
    if (!t) return acc
    const v2Entry = {
      timerId: t.id,
      ts, duration
    }
    acc.push(v2Entry)
    return acc
  }, [] as HistoryV2Entry[])
}