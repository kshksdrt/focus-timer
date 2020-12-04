<template>
	<div class="full-width">
		<div class="flex-between">
			<div
				v-for="{ target, text } in views"
				:key="target"
				class="rounded-full full-width transition-all"
				:class="getClass(target)"
				@click="changeView(target)"
			>
				<p class="text-small text-center m2">{{ text }}</p>
			</div>
		</div>
		<div class="full-width mt12" id="countStats">
			<canvas id="chartCanvas"></canvas>
		</div>
		<div class="full-width" id="durationStats"></div>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watchEffect } from "vue";

import { View } from "@/scripts/types/stats.ts";
import {
	getDurationDaysOfWeek,
	getDurationDaysOfMonth,
	getDurationMonthsOfYear,
} from "@/scripts/store/scripts/queries";

const { createGraph } = require("@/scripts/core/chartFunctions.js");

export default defineComponent({
	name: "StatsViewer",
	setup() {
		const views = [
			{
				target: "week",
				text: "Last 7d",
			},
			{
				target: "month",
				text: "Last 30d",
			},
			{
				target: "year",
				text: "This year",
			},
		];

		const currentView = ref("month" as View);

		function getClass(view: View) {
			return {
				"bg-none": currentView.value !== view,
				"bg-bg-2": currentView.value === view,
			};
		}

		function changeView(x: View) {
			currentView.value = x;
		}

		function drawGraph() {
			if (currentView.value === "week")
				createGraph(getDurationDaysOfWeek(), "bar");
			if (currentView.value === "month")
				createGraph(getDurationDaysOfMonth(), "line");
			if (currentView.value === "year")
				createGraph(getDurationMonthsOfYear(), "bar");
		}

		const mounted = ref(false);
		watchEffect(() => {
			if (mounted?.value === true) drawGraph();
		});

		onMounted(() => {
			mounted.value = true;
			drawGraph();
		});

		return {
			views,
			getClass,
			changeView,
		};
	},
});
</script>
