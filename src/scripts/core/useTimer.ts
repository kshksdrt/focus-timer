import { computed, reactive } from "vue";
import { CountdownState } from '../store/interfaces';

const timer = reactive({
  current: 0,
  state: "stopped" as CountdownState,
})

let count: number;
function countdownFunction() {
  const oneSecond = process.env.NODE_ENV === "production" ? 1 : 36
  if (timer.current === 0) {
    onComplete()
    return
  }
  timer.current = timer.current - oneSecond
  // console.log("counting", timer.current)
}

function start() {
  clearInterval(count);
  timer.state = "playing"
  count = setInterval(countdownFunction, 1000)
}

function stop() {
  clearInterval(count);
  timer.state = "stopped"
  timer.current = 0
}

function pause() {
  clearInterval(count);
  timer.state = "paused"
}

function resume() {
  clearInterval(count);
  timer.state = "playing"
  count = setInterval(countdownFunction, 1000)
}

function onComplete() {
  timer.state = "waiting"
  clearInterval(count);
}

function addTime(seconds: number) {
  timer.current = seconds
}

export const data = {
  current: computed(() => timer.current/60),
  secondsLeft: computed(() => timer.current),
  state: computed(() => timer.state),
}

export const actions = {
  addTime,
  start,
  pause,
  resume,
  stop,
}