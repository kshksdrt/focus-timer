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
		<div class="full-width mt12">
			<canvas id="chartCanvas"></canvas>
		</div>
		<div class="full-width mt12 p2">
			<h4 class="text-primary pb2">Summary</h4>
			<div v-for="({ name, value }, i) in stats" :key="i" class="flex-between">
				<p class="text-medium">{{ name }}</p>
				<p class="text-medium">{{ value }}</p>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watchEffect } from "vue";

import { Dataset, View } from "@/scripts/types/stats.ts";
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

		const currentView = ref("week" as View);

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
			if (currentView.value === "week") {
				const dataset: Dataset = getDurationDaysOfWeek();
				createGraph(dataset, "bar");
				createStats(dataset, "week");
			}
			if (currentView.value === "month") {
				const dataset: Dataset = getDurationDaysOfMonth();
				createGraph(dataset, "line");
				createStats(dataset, "week");
			}
			if (currentView.value === "year") {
				const dataset: Dataset = getDurationMonthsOfYear();
				createGraph(dataset, "bar");
				createStats(dataset, "week");
			}
		}

		const mounted = ref(false);
		watchEffect(() => {
			if (mounted?.value === true) drawGraph();
		});

		onMounted(() => {
			mounted.value = true;
			drawGraph();
		});

		const stats = ref([] as { name: string; value: string }[]);

		function createStats(dataset: Dataset, type: View) {
			stats.value = [];
			if (type === "week" || type === "month") {
				// Most productive day
				const highestMins = Math.max(...dataset.y);
				const index = () => {
					let res = 0;
					dataset.y.some((val, i) => {
						if (val === highestMins) {
							res = i;
							return true;
						}
						return false;
					});
					return res;
				};
				const day = dataset.x[index()];
				if (typeof day === "string") return;
				const dayTh = (d: number) =>
					d === 1 ? "1st" : d === 2 ? "2nd" : d === 3 ? "3rd" : `${d}th`;
				stats.value.push({
					name: "Most productive day",
					value: `${dayTh(day)}`,
				});

				// Mean
				const total = dataset.y.reduce((a, c) => a + c, 0);
				const mean = Math.floor(total / dataset.y.length);
				stats.value.push({
					name: "Average minutes per day",
					value: `${mean} mins`,
				});

				// SD
				const sumOfSquares = dataset.y.reduce((acc, curr) => {
					return Math.pow(curr, 2) + acc;
				}, 0);
				const sd = Math.floor(Math.sqrt(sumOfSquares / dataset.y.length));
				stats.value.push({
					name: "Standard deviation",
					value: `${sd} mins`,
				});
			}
			if (type === "year") {
				console.log("year");
			}
		}

		return {
			views,
			getClass,
			changeView,
			stats,
		};
	},
});
</script>
