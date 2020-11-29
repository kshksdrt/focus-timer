<template>
	<transition name="fade">
		<div v-if="timerVisibility === true" class="mt8">
			<div class="flex-start full-width">
				<div
					v-for="(segment, i) in bar"
					:key="i"
					:style="segment.css"
					class="relative m1 rounded-full transitions-all"
					:class="getClass(segment.isCurrent)"
				>
					<div class="absolute label text-smallest">
						<p class="m0">{{ segment.name }}</p>
						<p class="text-dim m0">{{ `${segment.duration} mins` }}</p>
					</div>
				</div>
			</div>
			<div class="flex-center full-width rounded-full bg-bg-1 mt12 mb4">
				<h1 class="text-center">{{ countdown }}</h1>
			</div>
			<!-- Help text -->
			<div v-if="timerState === 'waiting'" class="mb8">
				<!-- Go to next segment title -->
				<div v-if="isRemaining" class="flex-center">
					<span class="text-center text-small">
						{{ "Press &nbsp;&nbsp;" }} <SvgIcon name="next" />{{
							"&nbsp;&nbsp; to start " + timer.spec[currentSegment + 1].name
						}}
					</span>
				</div>
				<!-- Start next session title -->
				<div v-if="!isRemaining" class="flex-center">
					<span class="text-center text-small">
						{{ "Press &nbsp;&nbsp;" }} <SvgIcon name="restart" />{{
							"&nbsp;&nbsp; to start next session"
						}}
					</span>
				</div>
			</div>
			<div class="flex-center">
				<button
					class="mr2 p5 rounded-full text-light"
					@click="primaryButtonClickHandler"
				>
					<SvgIcon :name="primaryButton" />
				</button>
				<button class="mr2 p5 rounded-full text-light" @click="stopTimer">
					<SvgIcon name="stop" />
				</button>
			</div>
		</div>
	</transition>
	<transition>
		<div v-if="timerVisibility !== true">
			<p class="text-align">Please select a timer.</p>
		</div>
	</transition>
	<!-- Debug -->
	<!-- <p
		v-for="(each, i) in [
			100,
			timerState,
			timerVisibility,
			currentSegment,
			timer,
		]"
		:key="i"
		class="text-smaller"
	>
		{{ each }}
	</p> -->
	<teleport to="#modal" v-if="showPopup">
		<NotifyModal
			@proceed-clicked="onPopupButtonClicked"
			@close="closePopup"
			:titleIcon="timer.spec[currentSegment].icon"
			:title="title()"
			:message="message()"
			:primaryButtonText="primaryButtonText()"
		/>
	</teleport>
</template>

<script setup="props" lang="ts">
import { computed, defineComponent, ref, watch } from "vue";
import SvgIcon from "@/components/BaseComponents/SvgIcon.vue";
import NotifyModal from "@/components/Timer/NotifyModal.vue";

import { Timer, TimerBarSegment, Spec } from "@/scripts/store/interfaces";
import { get } from "@/scripts/store/state";
import { data, actions } from "@/scripts/core/useTimer";

const timer = get.currentTimer;
const currentMinute = data.current;
const timerState = data.state;

const timerVisibility = ref(false);
if (get.currentTimer.value.id) {
	timerVisibility.value = true;
	generateBar(timer.value);
}

const primaryButton = computed(() => {
	if (timerState.value === "stopped") return "play";
	if (timerState.value === "playing") return "pause";
	if (timerState.value === "paused") return "play";
	if (timerState.value === "waiting") {
		if (timer.value.spec.length <= currentSegment.value + 1) return "restart";
		return "next";
	}
});

function primaryButtonClickHandler() {
	if (timerState.value === "stopped") return startTimer();
	if (timerState.value === "playing") return pauseTimer();
	if (timerState.value === "paused") return resumeTimer();
	if (timerState.value === "waiting") return goToNextSegment();
}

let log = false;
if (process.env.NODE_ENV === "development") log = true;

function startTimer() {
	if (log) console.log("Primary button clicked - starting");
	actions.addTime(timer.value.spec[currentSegment.value].duration * 60);
	actions.start();
}

function pauseTimer() {
	if (log) console.log("Primary button clicked - pausing");
	actions.pause();
}

function resumeTimer() {
	if (log) console.log("Primary button clicked - resuming");
	actions.resume();
}

function stopTimer() {
	if (log) console.log("Primary button clicked - stopping");
	actions.stop();
}

const isRemaining = computed(() => {
	return timer.value.spec.length > currentSegment.value + 1;
});

function goToNextSegment() {
	if (isRemaining.value === false) {
		currentSegment.value = 0;
	} else if (isRemaining.value === true) {
		currentSegment.value++;
	}
	startTimer();
}

function getNextSegmentduration() {
	if (timer.value.spec.length <= currentSegment.value + 1) {
		return timer.value.spec[0].duration;
	}
	if (timer.value.spec.length > currentSegment.value + 1) {
		return timer.value.spec[currentSegment.value + 1].duration;
	}
	return 0;
}

function countOneInHistory() {
	console.log("Saving to history");
}

const currentSegment = ref(0);

const bar = ref([] as TimerBarSegment[]);

function generateBar(val: Timer) {
	if (!val || !val.spec) return;

	const totalMinutes = val.spec.reduce(
		(acc: number, current: Spec) => acc + current.duration,
		0
	);

	const newBar: TimerBarSegment[] = val.spec.reduce(
		(acc: TimerBarSegment[], current: Spec, i: number) => {
			const { name, duration } = current;
			const newSegment: TimerBarSegment = {
				name,
				duration,
				isCurrent: currentSegment.value === i,
				css: {
					width: Math.floor((duration / totalMinutes) * 100) + "%",
				},
			};
			acc.push(newSegment);
			return acc;
		},
		[]
	);

	bar.value = [];
	newBar.forEach((each) => {
		bar.value.push(each);
	});
}

const countdown = computed(() => {
	if (timerVisibility.value === false) return "00 : 00";
	const totalSeconds = data.secondsLeft.value;
	const min = Math.floor(totalSeconds / 60);
	const sec = totalSeconds % 60;
	const addZero = (x: number) => (x < 10 ? "0" + x : x);
	return `${addZero(min)} : ${addZero(sec)}`;
});

function getClass(condition: boolean) {
	const x = {
		"bg-bg-3": condition ? false : true,
		"bg-primary": condition ? true : false,
		pt1: condition ? false : true,
		pt2: condition ? true : false,
	};
	return x;
}

watch(timer, (val) => {
	val.spec ? (timerVisibility.value = true) : (timerVisibility.value = false);
	generateBar(val);
});

watch(currentMinute, (val) => {
	generateBar(timer.value);
});

watch(timerState, (val) => {
	if (val === "waiting") {
		countOneInHistory();
		actions.addTime(getNextSegmentduration() * 60);
		showPopup.value = true;
	}
});

const showPopup = ref(false);

function closePopup() {
	showPopup.value = false;
}

function onPopupButtonClicked() {
	showPopup.value = false;
	primaryButtonClickHandler();
}

function primaryButtonText() {
	if (isRemaining.value === true) {
		const { name, duration } = timer.value.spec[currentSegment.value + 1];
		return `Start ${name} (${duration} mins)?`;
	} else if (isRemaining.value === false) {
		return `Start ${timer.value.name} again`;
	}
}

function title() {
	if (isRemaining.value === true) {
		const prev = timer.value.spec[currentSegment.value];
		return `${prev.name} complete!`;
	} else if (isRemaining.value === false) {
		return `Session complete`;
	}
}

function message() {
	if (isRemaining.value === true) {
		return `You're doing great, keep it going!`;
	} else if (isRemaining.value === false) {
		return `You're doing great, keep it going!`;
	}
}

export {
	timer,
	timerVisibility,
	timerState,
	title,
	message,
	countdown,
	bar,
	currentSegment,
	currentMinute,
	getClass,
	startTimer,
	stopTimer,
	primaryButton,
	primaryButtonClickHandler,
	showPopup,
	onPopupButtonClicked,
	isRemaining,
	primaryButtonText,
	closePopup,
};

export default defineComponent({
	name: "Timer",
	components: { SvgIcon, NotifyModal },
});
</script>

<style lang="scss" scoped>
.label {
	width: 100%;
	text-align: center;
	text-transform: capitalize;
	transform: translateY(-160%);
}
</style>
