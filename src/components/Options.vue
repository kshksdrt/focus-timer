<template>
	<div>
		<div class="card">
			<h2 class="text-primary pb3">My library</h2>
			<div v-if="myTimers.length === 0" class="p6">
				<p class="margin-auto text-center text-dim">
					You have not set up any timers.
				</p>
			</div>
			<transition-group name="fade-slow">
				<div v-for="timer in myTimers" :key="timer.id">
					<div class="card-alt">
						<div class="flex-between">
							<p class="text-bold">{{ timer.name }}</p>
							<button
								v-if="!isSelected(timer.id)"
								class="bg-bg-3 text-white"
								@click="selectTimer(timer.id)"
							>
								Choose
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
			</transition-group>
		</div>
		<div class="card">
			<h2 class="text-primary pb3">External</h2>
			<div v-for="timer in externals" :key="timer.id">
				<div class="card-alt">
					<p class="text-bold">{{ timer.name }}</p>
					<p class="text-dim text-small pb2">{{ timer.desc }}</p>
					<button
						class="bg-bg-3 text-white uppercase"
						@click="importTimerFromExternal(timer.id)"
					>
						Import
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { get, mutate } from "@/scripts/store/state";
import { Timer } from "@/scripts/store/interfaces";

export default defineComponent({
	name: "Options",
	setup() {
		const myTimers = get.timers;
		const externals = get.externals;
		const current = get.currentTimer;

		function importTimerFromExternal(id: string) {
			mutate.importTimer(id);
		}

		function selectTimer(id: string) {
			mutate.selectTimer(id);
		}

		function isSelected(id: string) {
			return current.value.id === id;
		}

		return {
			myTimers,
			externals,
			importTimerFromExternal,
			selectTimer,
			isSelected,
		};
	},
});
</script>
