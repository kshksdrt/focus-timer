import { getDaysAgo } from "./dateFunctions"

import { HistoryV2Entry } from "@/types/history"
import { Spec, Timer } from "@/types/timer"
import { BatchImport } from "@/types/app";

export function createSampleData() {
  const template = require("@/lib/sample.json")
  const timers: Timer[] = template.timers
  const history = [] as HistoryV2Entry[]

  // Today's entries
  const todayCount = Array(random(4, 18)).fill(null)
  todayCount.forEach(() => {
    const timerIndex = random(0,timers.length-1)
    history.push({
      timerId: timers[timerIndex].id,
      duration: template.timers[timerIndex].spec.reduce((a: number, c: Spec) => a+c.duration, 0),
      ts: new Date()
    })
  })
  
  // Entries for all days until the monthly archive boundary
  const count = Array(31 + getDaysAgo(31).getDate()).fill(null)
  count.forEach((_, i) => {
    const day = i+1
    timers.forEach((each) => {
      history.push({
        timerId: each.id,
        duration: each.spec.reduce((a: number, c: Spec) => a+c.duration, 0) * random(4, 9),
        ts: getDaysAgo(day)
      })
    })
  })

  // Yearly entries generation is not fully developed. It simply
  // creates entries for each month of this year, causing future dates
  // to be in history

  // const months = Array(getDaysAgo(31).getMonth()).fill(null)
  // months.forEach((_, i) => {
  //   const today = new Date()
  //   const date = new Date(today.setMonth(i))
  //   timers.forEach((each) => {
  //     history.push({
  //       timerId: each.id,
  //       duration: each.spec.reduce((a: number, c: Spec) => a+c.duration, 0) * random(100, 258),
  //       ts: date
  //     })
  //   })
  // })
  
  template.history = history
  return template as BatchImport
}

function random(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}