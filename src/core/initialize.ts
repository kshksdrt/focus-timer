import { Timer } from "@//types/timer";
import { getHistoryFromLs, getSettingsFromLs, getTimersFromLs } from "@/store/scripts/ls";
import { mutate as mutateTimer } from "@/store/states/timer";
import { mutate as mutateHistory } from "@/store/states/history";
import { mutate as mutateApp } from "@/store/states/app";
import { HistoryEntry, HistoryV2Entry } from '@/types/history';
import { Settings } from '@/types/app';

export default function() {
  if (!localStorage.getItem("focus-timer.version")) mutateApp.userIsNew()
  
  const version = require('../../package.json').version
  localStorage.setItem("focus-timer.version", JSON.stringify(version))

  try {
    const timers = getTimersFromLs()
    const history = getHistoryFromLs()
    const settings = getSettingsFromLs()

    if (!Array.isArray(timers) || !Array.isArray(history)) return

    mutateTimer.batchImport(timers as Timer[])
    mutateHistory.batchImport(history as HistoryEntry[] | HistoryV2Entry[], timers as Timer[])
    mutateApp.batchImport(settings as Settings)
  } catch (err) {
    if (process.env.NODE_ENV === "development") console.log(err);
  }
}