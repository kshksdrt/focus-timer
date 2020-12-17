import { getDaysAgo } from "@/core/dateFunctions";
import { Filter, HistoryV2Entry } from "@/types/history";
import { FilterOptions } from "@/types/stats";
import { Timer } from "@/types/timer";

export function queryFilterOperator(queryFilter: Filter, current: Date, queryDate: Date,) {
  const d = current.getDate() === queryDate.getDate()
  const m = current.getMonth() === queryDate.getMonth()
  const y = current.getFullYear() === queryDate.getFullYear()
  switch (queryFilter) {
    case 'day': return ![d, m, y].includes(false)
    case 'month': return ![m, y].includes(false)
    case 'year': return ![y].includes(false)
    default: return false
  }
}

export function getDuration(history: HistoryV2Entry[], filterOptions: FilterOptions) {
  const {range, date, timerId} = filterOptions
  return history.reduce((acc, current) => {
    const currentItemDate = new Date(current.ts);
    if (timerId && current.timerId !== timerId) return acc 
    if (queryFilterOperator(range, currentItemDate, date)) return acc+current.duration
    return acc;
  }, 0);
}

export function mergeOldHistory(history: HistoryV2Entry[], timers: Timer[]): HistoryV2Entry[] {
  const merge = [] as HistoryV2Entry[]
  const today = new Date()
  const archiveBoundary = getDaysAgo(31 + getDaysAgo(31).getDate())

  // Merge monthly
  for (let i = 1; i <= archiveBoundary.getMonth(); i++) {
    timers.forEach(timer => {
      const mergedTs = new Date(today.getFullYear(), i, 0)
      const filters = {
        range: 'month' as Filter,
        date: mergedTs,
        timerId: timer.id
      }
      const duration = getDuration(history, filters)
      if (duration > 0) merge.push({
        timerId: timer.id,
        ts: mergedTs,
        duration,        
      })
    })
  }

  // Push recent entries
  history.forEach(entry => {
    const h = new Date(entry.ts)
    const boundary = new Date(archiveBoundary)
    if (h > boundary) merge.push(entry)
  })

  return merge
}

