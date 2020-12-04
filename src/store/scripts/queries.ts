import { CountQueryResult, Filter, HistoryEntry } from "@//types/history";
import { get } from "@/store/states/history.ts";

// @ts-ignore
import { getDay } from "@//core/dateFunctions.js"

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function queryFilterOperator (queryFilter: Filter, current: Date, queryDate: Date,) {
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

export function getOneCount(history: HistoryEntry[], queryFilter: Filter, queryDate: Date, timerName: string) {
  return history.reduce((acc, current) => {
    const currentItemDate = new Date(current.ts);
    if (queryFilterOperator(queryFilter, currentItemDate, queryDate)) {
      if (current.name === timerName) return acc+1
    }
    return acc;
  }, 0);
}

export function getAllTimersCounts(history: HistoryEntry[], queryFilter: Filter, queryDate: Date) {
  const result = [] as CountQueryResult[];

  history.reverse().some((current) => {
    const currentItemDate = new Date(current.ts);
    if (queryFilterOperator(queryFilter, currentItemDate, queryDate)) {
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
}

export function getAllTimersDurations(history: HistoryEntry[], queryFilter: Filter, queryDate: Date) {
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
    const result = getAllTimersDurations(data, 'day', getDay({days: -i}))
    x.push(getDay({days: -i, months: 0}).getDate())
    y.push(result)
  }
  return { x, y }
}

export function getDurationDaysOfMonth() {
  const data = get.history.value;
  const x = []
  const y = []

  for (let i = 30; i >= 0; i--) {
    const result = getAllTimersDurations(data, 'day', getDay({days: -i}))
    x.push(getDay({days: -i, months: 0}).getDate())
    y.push(result)
  }
  return { x, y }
}

export function getDurationMonthsOfYear() {
  const data = get.history.value;
  const x: string[] = []
  const y: number[] = []

  // @ts-ignore
	const today = new Date(Date.today().toISOString());

  months.forEach((each, i) => {
    const result = getAllTimersDurations(data, 'month', new Date(today.getFullYear(), i+1, 0))
    x.push(each.slice(0,3))
    y.push(result)
  })

  return { x, y }
}
