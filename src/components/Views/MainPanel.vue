<template>
	<div class="flex-column-start full-width">
		<Timer v-if="timerSelected" id="timer" />
		<SelectTimer v-if="!timerSelected" id="selectTimer" />
		<Today id="today" />
	</div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

import { get } from "@/scripts/store/states/timer";

import Timer from "@/components/Timer/Timer.vue";
import SelectTimer from "@/components/Timer/SelectTimer.vue";
import Today from "@/components/History/Today.vue";

export default defineComponent({
	name: "MainPanel",
	components: { Timer, SelectTimer, Today },
	setup() {
		return {
			timerSelected: computed(() => get.timerSelected?.value === true),
		};
	},
});
</script>
