<template>
	<div class="pb12" id="timer">
		<transition name="fade">
			<div class="mt8 mb6 full-width">
				<Bar :currentSegment="currentSegment" />
				<div
					class="flex-center full-width rounded-full no-select bg-bg-1 mt12 mb8"
				>
					<h1 class="text-center">{{ countdown }}</h1>
				</div>
				<!-- Help text -->
				<div v-if="timerState === 'waiting'" class="mb8">
					<!-- Go to next segment title -->
					<div v-if="isRemaining" class="flex-center">
						<span class="text-center text-small">
							{{ "Press &nbsp;&nbsp;" }}
							<i class="material-icons light">{{ primaryButton }}</i
							>{{
								"&nbsp;&nbsp; to start " + timer.spec[currentSegment + 1].name
							}}
						</span>
					</div>
					<!-- Start next session title -->
					<div v-if="!isRemaining" class="flex-center">
						<span class="text-center text-small">
							{{ "Press &nbsp;&nbsp;" }}
							<i class="material-icons light">{{ primaryButton }}</i
							>{{ "&nbsp;&nbsp; to start next session" }}
						</span>
					</div>
				</div>
				<!-- Controls -->
				<div class="flex-center">
					<button
						class="rounded-full icon size-largest mr4"
						@click="primaryButtonClickHandler"
					>
						<i class="material-icons light">{{ primaryButton }}</i>
					</button>
					<button
						class="rounded-full icon size-larger"
						v-if="timerState === 'playing'"
						@click="stopTimer"
					>
						<i class="material-icons light">stop</i>
					</button>
				</div>
			</div>
		</transition>
		<!-- Debug -->
		<!-- <p
			v-for="(each, i) in [
				100,
				timerState,
				currentSegment,
				timer,
			]"
			:key="i"
			class="text-smaller"
		>
			{{ each }}
		</p> -->
		<NotifyModal
			v-if="showPopup"
			@proceed-clicked="onPopupButtonClicked"
			@close="closePopup"
			:titleIcon="timer.spec[currentSegment].icon"
			:title="notificationStrings.popupTitle"
			:message="notificationStrings.popupBody"
			:primaryButtonText="notificationStrings.popupPrimaryButton"
		/>
	</div>
</template>

<script lang="ts">
import {
	defineComponent,
	ref,
	computed,
	watchEffect,
	watch,
	reactive,
} from "vue";

import NotifyModal from "@/components/BaseComponents/NotifyModal.vue";
import Bar from "@/components/Timer/Bar.vue";

import { get, mutate } from "@/providers/timer";
import { mutate as mutateHistory } from "@/providers/history";
import { data, actions } from "@/scripts/useTimer";
import { displayNotification, requestPermission } from "@/pwa/notifications";

export default defineComponent({
	name: "Timer",
	components: { NotifyModal, Bar },
	setup() {
		const timer = get.currentTimer;
		const currentMinute = data.current;
		const timerState = data.state;

		const timerVisibility = ref(false);
		if (get.currentTimer.value.id) {
			timerVisibility.value = true;
		}

		const primaryButton = computed(() => {
			if (timerState.value === "stopped") return "play_arrow";
			if (timerState.value === "playing") return "pause";
			if (timerState.value === "paused") return "play_arrow";
			if (timerState.value === "waiting") {
				if (!isRemaining.value) return "refresh";
				return "redo";
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
			mutate.deselectTimer();
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
			const duration = timer.value.spec.reduce((a, c) => a + c.duration, 0);
			mutateHistory.newEntry(timer.value.id, duration);
		}

		const currentSegment = ref(0);

		const countdown = computed(() => {
			if (timerVisibility.value === false) return "00 : 00";
			const totalSeconds = data.secondsLeft.value;
			const min = Math.floor(totalSeconds / 60);
			const sec = totalSeconds % 60;
			const addZero = (x: number) => (x < 10 ? "0" + x : x);
			return `${addZero(min)} : ${addZero(sec)}`;
		});

		watchEffect(() => {
			if (timer.value.spec) {
				timerVisibility.value = true;
			} else {
				timerVisibility.value = false;
			}
		});

		watch(timerState, (val) => {
			if (val === "waiting") {
				if (isRemaining.value === false) countOneInHistory();
				actions.addTime(getNextSegmentduration() * 60);
				if (Notification.permission === "default") requestPermission();
				generateNotificationStrings();
				showPopup.value = true;
				notify();
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

		const notificationStrings = reactive({
			popupTitle: "",
			popupBody: "",
			popupPrimaryButton: "",
			notificationTitle: "",
			notificationBody: "",
		});

		function generateNotificationStrings() {
			if (isRemaining.value === true) {
				const prev = timer.value.spec[currentSegment.value];
				const title = `${prev.name.charAt(0).toUpperCase() +
					prev.name.slice(1)} segment complete!`;
				const { name, duration } = timer.value.spec[currentSegment.value + 1];
				notificationStrings.popupTitle = title;
				let tip = "";
				if (Notification.permission !== "granted")
					tip =
						" Quick tip: Allow notifications to be notified about timer events";
				notificationStrings.popupBody =
					"You're doing great, keep it going!" + tip;
				notificationStrings.popupPrimaryButton = `Start ${name} (${duration} mins)?`;
				notificationStrings.notificationTitle = title;
				notificationStrings.notificationBody = `Go to next segment: ${name} (${duration} mins)`;
			} else if (isRemaining.value === false) {
				notificationStrings.popupTitle = "Session complete";
				let tip = "";
				if (Notification.permission !== "granted")
					tip =
						" Quick tip: Allow notifications to be notified about timer events";
				notificationStrings.popupBody =
					"You're doing great, keep it going!" + tip;
				notificationStrings.popupPrimaryButton = `Start ${timer.value.name} again`;
				notificationStrings.notificationTitle = "Session complete";
				notificationStrings.notificationBody = "Start the next session";
			} else {
				notificationStrings.popupTitle = "Error";
				notificationStrings.popupBody = "Error";
				notificationStrings.popupPrimaryButton = "Error";
				notificationStrings.notificationTitle = "Error";
				notificationStrings.notificationBody = "Error";
			}
		}

		function notify() {
			const { notificationTitle, notificationBody } = notificationStrings;
			const action = {
				action: "next",
				title: notificationBody,
			};
			displayNotification(notificationTitle, notificationBody, [action]);
		}

		return {
			timer,
			timerVisibility,
			timerState,
			notificationStrings,
			countdown,
			currentSegment,
			currentMinute,
			startTimer,
			stopTimer,
			primaryButton,
			primaryButtonClickHandler,
			showPopup,
			onPopupButtonClicked,
			isRemaining,
			closePopup,
		};
	},
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
