<template>
	<div id="appContent">
		<MainPanel v-if="currentView === 'home'" />
		<ManageTimers v-if="currentView === 'manage'" />
	</div>
	<div id="navbarMobile" class="flex-even">
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

// Components
import MainPanel from "@/components/Views/MainPanel.vue";
import ManageTimers from "@/components/Views/ManageTimers.vue";

export default defineComponent({
	name: "App",
	components: { MainPanel, ManageTimers },
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
		};
	},
	setup() {
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
		};
	},
});
</script>

<style lang="scss">
@import "@/assets/styles/app.scss";
</style>
