import { computed } from "vue";

import { CountQueryResult, HistoryV2Entry, Filter } from '@/types/history';
import { Stats } from '@/types/stats';

import { get as getTimer } from '@/providers/timer';
import { get as getHistory } from '@/providers/history';
import { queryFilterOperator, getDuration } from '@/scripts/historyUtils';
import { getDaysAgo } from '@/scripts/dateFunctions';

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
