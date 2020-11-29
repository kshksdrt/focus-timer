<template>
	<span v-html="require(`!html-loader!../../assets/icons/${name}.svg`)"></span>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
	name: "svg-icon",
	props: {
		name: String,
		default: null,
	},
});
</script>
