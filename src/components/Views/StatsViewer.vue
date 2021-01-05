<template>
	<div class="full-width mt12">
		<div
			class="flex-start full-width pb6 border-bottom"
			v-if="mounted && currentTimer"
		>
			<p class="m0 text-medium text-bold text-primary mr8">Timer</p>
			<Dropdown class="full-width" :current="currentTimer.name">
				<div
					class="capitalize"
					v-for="timer in allTimers"
					:key="timer.id"
					@click="selectTimer(timer.id)"
				>
					{{ timer.name }}
				</div>
			</Dropdown>
		</div>
		<div class="flex-between mt6">
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
		<div class="full-width mt12 relative" style="height: 25vh">
			<transition-group name="fade-slow" mode="out-in">
				<canvas
					id="weekCanvas"
					class="absolute"
					:key="0"
					v-show="currentView === 'week'"
				></canvas>
				<canvas
					id="monthCanvas"
					class="absolute"
					:key="1"
					v-show="currentView === 'month'"
				></canvas>
				<canvas
					id="yearCanvas"
					class="absolute"
					:key="2"
					v-show="currentView === 'year'"
				></canvas>
			</transition-group>
		</div>
		<div class="full-width p2" v-if="currentView !== 'year'">
			<h4 class="text-primary pb2">Summary</h4>
			<div v-for="({ name, value }, i) in stats" :key="i" class="flex-between">
				<p class="text-medium">{{ name }}</p>
				<p class="text-medium">{{ value }}</p>
			</div>
			<p v-if="!currentTimer">No timer selected</p>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";

import Dropdown from "@/components/BaseComponents/Dropdown.vue";

import { Dataset, View } from "@//types/stats.ts";
import { Timer } from "@/types/timer";

import { get as getTimer } from "@/providers/timer";
import { thisMonth, thisWeek, thisYear } from "@/providers/stats";

const { registerCanvas, createGraph } = require("@/scripts/chartFunctions.js");
const months: string[] = require("@/lib/months.json");

export default defineComponent({
	name: "StatsViewer",
	components: { Dropdown },
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
			// {
			// 	target: "year",
			// 	text: "This year",
			// },
		];

		const currentView = ref("week" as View);
		const currentTimer = ref({} as Timer);

		// @ts-ignore
		let weekChart, monthChart, yearChart;

		onMounted(() => {
			currentTimer.value = getTimer.timers.value[0];
		});

		function selectTimer(id: string) {
			const res = getTimer.timers.value.find((x) => x.id === id);
			if (res) currentTimer.value = res;
			drawGraph();
		}

		function getClass(view: View) {
			return {
				"bg-none": currentView.value !== view,
				"bg-bg-2": currentView.value === view,
			};
		}

		function changeView(x: View) {
			currentView.value = x;
			drawGraph();
		}

		function drawGraph() {
			if (currentView.value === "week") {
				const stats = thisWeek.value.find(
					(x) => currentTimer.value.id === x.timerId
				);
				if (!stats) return;
				const dataset: Dataset = stats.dataset;
				// @ts-ignore
				createGraph(weekChart, "week", dataset);
				createSummary(dataset, "week");
			}
			if (currentView.value === "month") {
				const stats = thisMonth.value.find(
					(x) => currentTimer.value.id === x.timerId
				);
				if (!stats) return;
				const dataset: Dataset = stats.dataset;
				// @ts-ignore
				createGraph(monthChart, "month", dataset);
				createSummary(dataset, "month");
			}
			if (currentView.value === "year") {
				const stats = thisYear.value.find(
					(x) => currentTimer.value.id === x.timerId
				);
				if (!stats) return;
				const { x, y } = stats.dataset;
				// @ts-ignore
				createGraph(yearChart, "year", createMonthStrings({ x, y }));
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

		onMounted(() => {
			mounted.value = true;
			weekChart = registerCanvas("bar", "weekCanvas");
			monthChart = registerCanvas("line", "monthCanvas");
			yearChart = registerCanvas("bar", "yearCanvas");
			setTimeout(() => changeView("week"), 200);
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
		}

		return {
			views,
			currentView,
			changeView,
			getClass,
			stats,
			currentTimer,
			allTimers: getTimer.timers,
			selectTimer,
			mounted,
		};
	},
});
</script>
