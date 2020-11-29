<template>
	<div class="root grid-container">
		<MainPanel />
		<Options />
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MainPanel from "./components/MainPanel.vue";
import Options from "./components/Options.vue";

export default defineComponent({
	name: "App",
	components: { MainPanel, Options },
});
</script>

<style lang="scss">
@import "@/assets/styles/app.scss";
</style>
