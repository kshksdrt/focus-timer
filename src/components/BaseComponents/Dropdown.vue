<template>
	<div>
		<div class="dropdown width-200">
			<div class="trigger flex-between" @click="toggle">
				<p class="m0">{{ current }}</p>
				<i class="material-icons">arrow_drop_down</i>
			</div>
			<div class="target" v-if="show" @click="toggle">
				<slot />
			</div>
		</div>
		<div class="overlay-invisible" v-if="show" @click="toggle" />
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
	name: "Dropdown",
	props: {
		current: {
			type: String,
			required: true,
		},
	},
	setup() {
		const show = ref(false);
		return {
			show,
			toggle: () => (show.value = !show.value),
		};
	},
});
</script>
