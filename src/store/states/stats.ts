import { computed } from "vue";

import { CountQueryResult, HistoryV2Entry, Filter } from '@/types/history';
import { get as getTimer } from '@/store/states/timer';
import { get as getHistory } from '@/store/states/history';
import { FilterOptions, Stats } from '@/types/stats';
import { getDaysAgo } from '@/core/dateFunctions';

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

function getDuration(history: HistoryV2Entry[], filterOptions: FilterOptions) {
  const {range, date, timerId} = filterOptions
  return history.reduce((acc, current) => {
    const currentItemDate = new Date(current.ts);
    if (timerId && current.timerId !== timerId) return acc 
    if (queryFilterOperator(range, currentItemDate, date)) return acc+current.duration
    return acc;
  }, 0);
}

export const todayAsCounts = computed(() => {
  const history: HistoryV2Entry[] = JSON.parse(JSON.stringify(getHistory.history.value))
  const result = [] as CountQueryResult[];

  history.forEach((current) => {
    const currentItemDate = new Date(current.ts);
    if (queryFilterOperator("day", currentItemDate, new Date())) {
      const timer = getTimer.getTimerById(current.timerId)
      if (!timer) return
      const existingCount = result.find((x) => x.name === timer.name);
      existingCount ? existingCount.count++ : result.push({ name: timer.name, count: 1 });
    }
  });
  return result;
})

export const thisWeek = computed(() => {
  const history: HistoryV2Entry[] = JSON.parse(JSON.stringify(getHistory.history.value))
  return getTimer.timers.value.reduce((acc, timer) => {
    const x = []
    const y = []
  
    for (let i = 7; i >= 0; i--) {
      const filters = {
        range: 'day' as Filter,
        date: getDaysAgo(i),
        timerId: timer.id
      }
      const result = getDuration(history, filters)
      x.push(getDaysAgo(i).getDate())
      y.push(result)
    }

    acc.push({
      timerId: timer.id,
      dataset: { x, y },
    })
    return acc
  }, [] as Stats[])
})


export const thisMonth = computed(() => {
  const history: HistoryV2Entry[] = JSON.parse(JSON.stringify(getHistory.history.value))
  return getTimer.timers.value.reduce((acc, timer) => {
    const x = []
    const y = []
  
    for (let i = 31; i >= 0; i--) {
      const filters = {
        range: 'day' as Filter,
        date: getDaysAgo(i),
        timerId: timer.id
      }
      const result = getDuration(history, filters)
      x.push(getDaysAgo(i).getDate())
      y.push(result)
    }

    acc.push({
      timerId: timer.id,
      dataset: { x, y },
    })
    return acc
  }, [] as Stats[])
})


export const thisYear = computed(() => {
  const history: HistoryV2Entry[] = JSON.parse(JSON.stringify(getHistory.history.value))
  return getTimer.timers.value.reduce((acc, timer) => {
    const x = []
    const y = []
  
    const today = new Date();
    for (let i = 0; i <= 11; i++) {
      const filters = {
        range: 'month' as Filter,
        date: new Date(today.getFullYear(), i+1, 0),
        timerId: timer.id
      }
      const result = getDuration(history, filters)
      x.push(getDaysAgo(i).getDate())
      y.push(result)
    }

    acc.push({
      timerId: timer.id,
      dataset: { x, y },
    })
    return acc
  }, [] as Stats[])
})
