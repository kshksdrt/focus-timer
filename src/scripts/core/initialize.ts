import { Timer } from "@/scripts/store/interfaces";
import { getTimersFromLs } from "@/scripts/store/ls";
import { mutate } from "@/scripts/store/state";

export default function () {
  const x = getTimersFromLs()
  if (!Array.isArray(x)) return
  // x.forEach(each => {
  //   if (!Object.keys(each).includes("name") || !Object.keys(each).includes("uuid")) return
  // })
  mutate.importLsData(x as Timer[])
}