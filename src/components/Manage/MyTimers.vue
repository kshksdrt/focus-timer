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
		<div
			class="flex-start flex-align-center long-button no-select mb3"
			@click="openBuildTimerModal"
		>
			<i class="material-icons">add_circle</i>
			<p class="text-medium m0 ml4">Build a timer</p>
		</div>
		<CustomModal
			v-if="buildTimerModal"
			@close="closeBuildTimerModal"
			size="medium"
		>
			<BuildTimer @complete="closeBuildTimerModal" />
		</CustomModal>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

import CustomModal from "@/components/BaseComponents/CustomModal.vue";
import BuildTimer from "@/components/Manage/BuildTimer.vue";

import { get, mutate } from "@/store/states/timer";

export default defineComponent({
	name: "MyTimers",
	components: { BuildTimer, CustomModal },
	setup() {
		const myTimers = get.timers;

		function removeTimer(id: string) {
			mutate.removeTimer(id);
		}

		const buildTimerModal = ref(false);
		function openBuildTimerModal() {
			buildTimerModal.value = true;
		}
		function closeBuildTimerModal() {
			buildTimerModal.value = false;
		}

		return {
			myTimers,
			removeTimer,
			openBuildTimerModal,
			closeBuildTimerModal,
			buildTimerModal,
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
