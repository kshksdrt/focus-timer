<template>
	<div>
		<div class="modal-overlay" @click="onClose" />
		<div :class="`modal modal-${size}`">
			<slot />
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "NotifyModal",
	props: {
		size: {
			type: String,
			required: false,
			default: "small",
		},
	},
	emits: ["close"],
	methods: {
		onClose() {
			this.$emit("close");
		},
	},
});
</script>
