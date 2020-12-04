<template>
	<button class="bg-none icon" @click="toggle">
		<i class="material-icons text-xxl" :class="getClass()">
			{{ enabled ? "toggle_on" : "toggle_off" }}
		</i>
	</button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "ToggleButton",
	props: {
		enabled: {
			type: Boolean,
			required: true,
			default: false,
		},
	},
	emits: ["toggle"],
	methods: {
		getClass() {
			return {
				"text-secondary": this.enabled,
				light: !this.enabled,
			};
		},
		toggle() {
			this.$emit("toggle");
		},
	},
});
</script>
