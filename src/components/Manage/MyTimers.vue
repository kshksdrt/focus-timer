<template>
	<div class="card" id="selectTimer">
		<div class="flex-between">
			<h2 class="text-primary pb2">My Timers</h2>
			<button class="bg-none icon" @click="toggleEditing()">
				<i class="material-icons light text-larger">
					{{ editing ? "done" : "edit" }}
				</i>
			</button>
		</div>
		<transition-group name="fade-slow">
			<div v-for="timer in myTimers" :key="timer.id">
				<div class="card-alt">
					<div class="flex-between">
						<p class="text-bold m0">{{ timer.name }}</p>
						<button
							v-if="editing"
							class="bg-none icon"
							@click="removeTimer(timer.id)"
						>
							<i class="material-icons light">delete</i>
						</button>
					</div>
				</div>
			</div>
			<p v-if="myTimers.length === 0" class="text-medium text-dim">
				You have not added any timers.
			</p>
		</transition-group>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { get, mutate } from "@/store/states/timer";

export default defineComponent({
	name: "MyTimers",
	setup() {
		const myTimers = get.timers;

		function removeTimer(id: string) {
			mutate.removeTimer(id);
		}

		return {
			myTimers,
			removeTimer,
		};
	},
	data() {
		return {
			editing: false,
		};
	},
	methods: {
		toggleEditing() {
			this.editing = !this.editing;
		},
	},
});
</script>
