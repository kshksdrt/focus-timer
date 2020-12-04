<template>
	<div class="m2">
		<h2 class="text-primary pb4">Settings</h2>
		<div class="flex-between flex-align-center" @click="toggleGrayscale">
			<p class="m0">Grayscale mode</p>
			<ToggleButton :enabled="settings.grayscaleMode" />
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import ToggleButton from "@/components/BaseComponents/ToggleButton.vue";

import { get, mutate } from "@/scripts/store/states/app";

export default defineComponent({
	name: "Settings",
	components: { ToggleButton },
	setup() {
		return {
			settings: get.settings,
			toggleGrayscale: () => mutate.toggleGrayscaleMode(),
		};
	},
	data() {
		return {
			enabled: true,
		};
	},
});
</script>
