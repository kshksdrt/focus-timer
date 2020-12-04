import { Timer } from "@//types/timer";
import { getHistoryFromLs, getSettingsFromLs, getTimersFromLs } from "@/store/scripts/ls";
import { mutate as mutateTimer } from "@/store/states/timer";
import { mutate as mutateHistory } from "@/store/states/history";
import { mutate as mutateApp } from "@/store/states/app";
import { HistoryEntry } from '@/types/history';

export default function () {
  if (!localStorage.getItem("focus-timer.version")) {
    mutateApp.userIsNew()
  }
  
  const version = require('../../package.json').version
  localStorage.setItem("focus-timer.version", JSON.stringify(version))

  const timers = getTimersFromLs()
  const history = getHistoryFromLs()
  const settings = getSettingsFromLs()

  if (!Array.isArray([...timers, ...history])) return
  // x.forEach(each => {
  //   if (!Object.keys(each).includes("name") || !Object.keys(each).includes("uuid")) return
  // })
  mutateTimer.importFromLs(timers as Timer[])
  mutateHistory.importFromLs(history as HistoryEntry[])
  mutateApp.importSettingsFromLs(settings)
}