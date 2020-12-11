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
			<canvas id="weekCanvas" v-show="currentView === 'week'"></canvas>
			<canvas id="monthCanvas" v-show="currentView === 'month'"></canvas>
			<canvas id="yearCanvas" v-show="currentView === 'year'"></canvas>
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

import { Dataset, View } from "@//types/stats.ts";
import { get as getTimer } from "@/store/states/timer";
import { Timer } from "@/types/timer";
import { thisMonth, thisWeek, thisYear } from "@/store/states/stats";

const { createGraph } = require("@//core/chartFunctions.js");
const months: string[] = require("@/lib/months.json");

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
		const currentTimer = ref({} as Timer);

		onMounted(() => {
			currentTimer.value = getTimer.timers.value[0];
		});

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
				const stats = thisWeek.value.find(
					(x) => currentTimer.value.id === x.timerId
				);
				if (!stats) return;
				const dataset: Dataset = stats.dataset;
				createGraph(dataset, "week");
				createSummary(dataset, "week");
			}
			if (currentView.value === "month") {
				const stats = thisMonth.value.find(
					(x) => currentTimer.value.id === x.timerId
				);
				if (!stats) return;
				const dataset: Dataset = stats.dataset;
				createGraph(dataset, "month");
				createSummary(dataset, "month");
			}
			if (currentView.value === "year") {
				const stats = thisYear.value.find(
					(x) => currentTimer.value.id === x.timerId
				);
				if (!stats) return;
				const { x, y } = stats.dataset;
				createGraph(createMonthStrings({ x, y }), "year");
				createSummary({ x, y }, "year");
			}
		}

		function createMonthStrings(dataset: Dataset) {
			return {
				y: dataset.y,
				x: months.reduce((acc: string[], c) => {
					acc.push(c.slice(0, 3));
					return acc;
				}, []),
			};
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

		function createSummary(dataset: Dataset, type: View) {
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
			currentView,
			changeView,
			getClass,
			stats,
		};
	},
});
</script>
