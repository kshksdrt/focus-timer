<template>
	<div class="card-border full-width" id="today">
		<h4 class="text-primary pb2">Today</h4>
		<div
			v-for="timer in todaysSessions"
			:key="timer.name"
			class="flex-between flex-align-center mb3"
		>
			<p class="m0 text-medium">{{ timer.name }}</p>
			<div class="badge no-select">
				<p>{{ timer.count }}</p>
			</div>
		</div>
		<p v-if="todaysSessions.length === 0" class="m0 text-medium text-dim">
			No activity.
		</p>
	</div>
	<!-- <p>{{ computes }}</p> -->
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { get } from "@/store/states/history";

export default defineComponent({
	name: "Today",
	setup() {
		return {
			todaysSessions: get.todaysSessions,
		};
	},
});
</script>
