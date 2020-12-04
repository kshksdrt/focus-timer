<template>
	<div class="card-border" id="selectTimer">
		<h2 class="text-primary">{{ welcomeMessage }}</h2>
		<p class="text-small pb5">{{ welcomeMessageSecondary }}</p>
		<div v-if="myTimers.length > 0">
			<transition name="fade-slow">
				<div class="card-alt">
					<div v-for="timer in myTimers" :key="timer.id">
						<div class="flex-between">
							<p class="text-bold m0">{{ timer.name }}</p>
							<button
								v-if="!isSelected(timer.id)"
								class="bg-none icon"
								@click="selectTimer(timer.id)"
							>
								<i class="material-icons light">play_arrow</i>
							</button>
							<p
								v-if="isSelected(timer.id)"
								class="uppercase text-smaller text-dim no-select"
							>
								Selected
							</p>
						</div>
					</div>
				</div>
			</transition>
		</div>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

import { get, mutate } from "@/scripts/store/states/timer";
import app from "@/scripts/store/states/app";
import { get as getHistory } from "@/scripts/store/states/history";

export default defineComponent({
	name: "SelectTimer",
	setup() {
		const userNew = app.get.userNew;

		const welcomeMessage = computed(() => {
			const time = new Date().getHours();
			if (time < 10) return "Good morning!";
			if (time < 20) return "Hello there!";
			return "Good evening!";
		});

		const welcomeMessageSecondary = computed(() => {
			if (userNew.value === true)
				return "Welcome to Focus Timer! Add a timer to get started.";

			const today = new Date();
			const time = today.getHours();
			if (getHistory.todaysSessions.value.length > 0)
				return "Let's keep working! Up for another session?";

			if (time > 20) return "Not working today? Up for a work session?";
			if (time > 14)
				return "It's still not too late for your first session. Let's go";

			return "Best time for your first session! Let's have a productive morning!";
		});

		const myTimers = get.timers;
		const current = get.currentTimer;

		function selectTimer(id: string) {
			mutate.selectTimer(id);
		}

		function isSelected(id: string) {
			return current.value.id === id;
		}

		return {
			welcomeMessage,
			welcomeMessageSecondary,
			myTimers,
			selectTimer,
			isSelected,
		};
	},
});
</script>
