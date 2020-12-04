<template>
	<div id="appContent">
		<transition name="fade" mode="out-in">
			<component :is="view[currentView]" />
		</transition>
	</div>
	<div :id="type === 'xs' ? 'navbarMobile' : 'navbar'">
		<button
			class="bg-none icon"
			v-for="button in buttons"
			:key="button.target"
			@click="navigate(button.target)"
		>
			<i class="material-icons" :class="isSelected(button.target)">
				{{ button.icon }}
			</i>
		</button>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

// Scripts
import appState from "@/scripts/store/states/app";
import { AppView } from "./scripts/types/app";

// @ts-ignore
import useBreakpoints from "./scripts/core/useBreakpoints.js";

// Components
import MainPanel from "@/components/Views/MainPanel.vue";
import ManageTimers from "@/components/Views/ManageTimers.vue";
import StatsViewer from "@/components/Views/StatsViewer.vue";

export default defineComponent({
	name: "App",
	components: { MainPanel, ManageTimers, StatsViewer },
	data() {
		return {
			buttons: [
				{
					target: "home",
					icon: "home",
				},
				{
					target: "manage",
					icon: "timer",
				},
				{
					target: "stats",
					icon: "analytics",
				},
				{
					target: "settings",
					icon: "settings",
				},
			],
			view: {
				home: "MainPanel",
				manage: "ManageTimers",
				stats: "StatsViewer",
			},
		};
	},
	setup() {
		const { type } = useBreakpoints();

		function isSelected(target: AppView) {
			return {
				primary: appState.get.currentView.value === target,
				light: appState.get.currentView.value !== target,
			};
		}

		function navigate(target: AppView) {
			appState.mutate.changeView(target);
		}

		return {
			currentView: appState.get.currentView,
			isSelected,
			navigate,
			type,
		};
	},
});
</script>

<style lang="scss">
@import "@/assets/styles/app.scss";
</style>
