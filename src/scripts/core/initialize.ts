import { Timer } from "@/scripts/types/interfaces";
import { getTimersFromLs } from "@/scripts/store/ls";
import { mutate } from "@/scripts/store/states/timer";

export default function () {
  const x = getTimersFromLs()
  if (!Array.isArray(x)) return
  // x.forEach(each => {
  //   if (!Object.keys(each).includes("name") || !Object.keys(each).includes("uuid")) return
  // })
  mutate.importFromLs(x as Timer[])
}