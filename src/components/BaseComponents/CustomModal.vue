<template>
	<div>
		<div class="modal-overlay" @click="onClose" />
		<div class="modal modal-small">
			<slot />
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

const iconsList = require("@/lib/iconsList.json");

export default defineComponent({
	name: "NotifyModal",
	props: {
		titleIcon: {
			type: String,
			required: false,
			default: "work",
		},
		title: {
			type: String,
			required: true,
		},
		message: {
			type: String,
			required: true,
		},
		primaryButtonText: {
			type: String,
			required: true,
		},
	},
	emits: ["close"],
	methods: {
		onClose() {
			this.$emit("close");
		},
	},
	setup() {
		return {};
	},
});
</script>
