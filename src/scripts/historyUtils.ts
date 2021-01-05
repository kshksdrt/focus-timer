import { getDaysAgo } from "@/scripts/dateFunctions";
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
  // Next line deletes last year entries
  // history = history.filter(x => queryFilterOperator('year', new Date(), new Date(x.ts)))

  const merge = [] as HistoryV2Entry[]
  const archiveBoundary = getDaysAgo(31 + getDaysAgo(31).getDate())

  // Merge monthly
  for (let i = 0; i <= archiveBoundary.getMonth()+1; i++) {
    timers.forEach(timer => {
      const mergedTs = new Date(archiveBoundary.getFullYear(), i, 0)
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

  // Merge Daily
  for (let i = 1; i < 31 + getDaysAgo(31).getDate(); i++) {
    timers.forEach(timer => {
      const c = new Date(getDaysAgo(i))
      const filters = {
        range: 'day' as Filter,
        date: c,
        timerId: timer.id,
      }
      const duration = getDuration(history, filters)
      if (duration > 0) merge.push({
        timerId: timer.id,
        ts: c,
        duration,
      })
    })
  }
  
  // Push today's entries
  history.forEach(entry => {
    if (queryFilterOperator("day", new Date(entry.ts), new Date())) merge.push(entry)
  })

  return merge
}

