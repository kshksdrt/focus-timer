import { Timer } from "@/scripts/types/timer";
import { getHistoryFromLs, getTimersFromLs } from "@/scripts/store/ls";
import { mutate as mutateTimer } from "@/scripts/store/states/timer";
import { mutate as mutateHistory } from "@/scripts/store/states/history";
import { HistoryEntry } from '../types/history';

export default function () {
  const timers = getTimersFromLs()
  const history = getHistoryFromLs()
  if (!Array.isArray([...timers, ...history])) return
  // x.forEach(each => {
  //   if (!Object.keys(each).includes("name") || !Object.keys(each).includes("uuid")) return
  // })
  mutateTimer.importFromLs(timers as Timer[])
  mutateHistory.importFromLs(history as HistoryEntry[])
}