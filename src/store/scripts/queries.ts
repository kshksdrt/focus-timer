import { CountQueryResult, Filter, HistoryV2Entry } from "@//types/history";
import { get } from "@/store/states/history.ts";
import { get as getTimer } from '../states/timer';

// @ts-ignore
import { getDaysAgo } from "@/core/dateFunctions.ts"

const months = require("@/lib/months.json");

export function queryFilterOperator (queryFilter: Filter, current: Date, queryDate: Date,) {
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

export function getOneCount(history: HistoryV2Entry[], queryFilter: Filter, queryDate: Date, timerId: string) {
  return history.reduce((acc, current) => {
    const currentItemDate = new Date(current.ts);
    if (queryFilterOperator(queryFilter, currentItemDate, queryDate)) {
      if (current.timerId === timerId) return acc+1
    }
    return acc;
  }, 0);
}

export function getAllTimersCounts(history: HistoryV2Entry[], queryFilter: Filter, queryDate: Date) {
  const result = [] as CountQueryResult[];

  history.forEach((current) => {
    const currentItemDate = new Date(current.ts);
    if (queryFilterOperator(queryFilter, currentItemDate, queryDate)) {
      const timer = getTimer.getTimerById(current.timerId)
      if (!timer) return

      let existingCount
      if (timer.name) existingCount = result.find((x) => x.name === timer.name);
      existingCount ? existingCount.count++ : result.push({ name: timer.name, count: 1 });
    }
  });
  return result;
}

export function getAllTimersDurations(history: HistoryV2Entry[], queryFilter: Filter, queryDate: Date) {
  return history.reduce((acc, current) => {
    const currentItemDate = new Date(current.ts);
    if (queryFilterOperator(queryFilter, currentItemDate, queryDate)) return acc+current.duration
    return acc;
  }, 0);
}

export function getDurationDaysOfWeek() {
  const data = get.history.value;
  const x = []
  const y = []

  for (let i = 7; i >= 0; i--) {
    const result = getAllTimersDurations(data, 'day', getDaysAgo(i))
    x.push(getDaysAgo(i).getDate())
    y.push(result)
  }
  return { x, y }
}

export function getDurationDaysOfMonth() {
  const data = get.history.value;
  const x = []
  const y = []

  for (let i = 30; i >= 0; i--) {
    const result = getAllTimersDurations(data, 'day', getDaysAgo(i))
    x.push(getDaysAgo(i).getDate())
    y.push(result)
  }
  return { x, y }
}

export function getDurationMonthsOfYear() {
  const data = get.history.value;
  const x: string[] = []
  const y: number[] = []

  // @ts-ignore
	const today = new Date();

  months.forEach((each: string, i: number) => {
    const result = getAllTimersDurations(data, 'month', new Date(today.getFullYear(), i+1, 0))
    x.push(each.slice(0,3))
    y.push(result)
  })

  return { x, y }
}

// Utilities
// export function mergeOldEntries(data: HistoryEntry[]) {
//   data.reduce((acc, current) => {
//     if (queryFilterOperator("day", current.ts, new Date())) {
//       // These happened today
//       acc.push(current)
//       return acc
//     } else if (current.ts > getDaysAgoISO(-31)) {
//       // These happened in the last 31 days, but not today
//       for (let i = 31; i >= 0; i--) {
//         const result = getAllTimersDurations(data, 'day', getDaysAgo(i))
//         acc.push({
//           ts,

//         })
//       }
//     }

//     return acc
//   }, [] as HistoryEntry[])
//   console.log(data)
// }

