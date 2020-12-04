<template>
	<div class="flex-column-start full-width">
		<transition name="fade" mode="out-in">
			<component :is="view" />
		</transition>
		<transition name="fade" mode="out-in">
			<Today />
		</transition>
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
			view: computed(() =>
				get.timerSelected?.value === true ? "Timer" : "SelectTimer"
			),
		};
	},
});
</script>
