<template>
	<div>
		<div class="modal-overlay" @click="onClose" />
		<div class="modal modal-small">
			<h1 class="capitalize mb8">
				<i class="material-icons mr3">{{ iconValid ? titleIcon : "work" }}</i>
				{{ title }}
			</h1>
			<p>{{ message }}</p>
			<button
				class="full-width bg-secondary text-dark no-transform mt6"
				@click="onProceedClicked"
			>
				{{ primaryButtonText }}
			</button>
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
	emits: ["proceed-clicked", "close"],
	methods: {
		onProceedClicked() {
			this.$emit("proceed-clicked");
		},
		onClose() {
			this.$emit("close");
		},
	},
	setup(props) {
		return {
			iconValid: iconsList.includes(props.titleIcon),
		};
	},
});
</script>
