<template>
	<div class="full-width">
		<h2 class="text-primary mb6">Pick an icon</h2>
		<i
			class="material-icons icon text-xxl p2"
			v-for="icon in exampleIcons"
			:key="icon"
			@click="$emit('selected', icon)"
		>
			{{ icon }}
		</i>
		<p class="text-small mt8 no-select">
			Or enter the name of a material icon. You can find a list of material
			icons from Google's material design resources
			<a
				href="https://material.io/resources/icons/"
				rel="noopener noreferrer"
				target="_blank"
			>
				website </a
			>.
		</p>
		<div class="flex-between">
			<input
				type="text"
				placeholder="Enter a valid icon name"
				class="mr4 full-width"
				v-model="input"
			/>
			<button
				class="bg-bg-3 text-white uppercase"
				@click="$emit('selected', input)"
				:disabled="!isValid"
			>
				Go
			</button>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

const iconsList: string[] = require("@/lib/iconsList.json");

export default defineComponent({
	name: "IconPicker",
	emits: ["selected"],
	data() {
		return {
			input: "",
			exampleIcons: [
				"work",
				"free_breakfast",
				"emoji_food_beverage",
				"equalizer",
				"audiotrack",
				"face",
				"eco",
				"receipt",
				"sensor_door",
				"business_center",
				"sensor_door",
				"thumb_up_alt",
			],
		};
	},
	computed: {
		isValid(): boolean {
			return iconsList.includes(this.input);
		},
	},
});
</script>
