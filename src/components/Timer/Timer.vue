<template>
	<div class="pb12">
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
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watchEffect, watch } from "vue";
import NotifyModal from "@/components/Timer/NotifyModal.vue";
import Bar from "@/components/Timer/Bar.vue";
import { get } from "@/scripts/store/states/timer";
import { mutate as mutateHistory } from "@/scripts/store/states/history";
import { data, actions } from "@/scripts/core/useTimer";

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
			console.assert(log, "Primary button clicked - starting");
			actions.addTime(timer.value.spec[currentSegment.value].duration * 60);
			actions.start();
		}

		function pauseTimer() {
			console.assert(log, "Primary button clicked - pausing");
			actions.pause();
		}

		function resumeTimer() {
			console.assert(log, "Primary button clicked - resuming");
			actions.resume();
		}

		function stopTimer() {
			console.assert(log, "Primary button clicked - stopping");
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
			const duration = timer.value.spec.reduce((a, c) => a + c.duration, 0);
			mutateHistory.newEntry(timer.value.name, duration);
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

		return {
			timer,
			timerVisibility,
			timerState,
			title,
			message,
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
			primaryButtonText,
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
