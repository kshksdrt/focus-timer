<template>
	<div>
		<div class="card-border">
			<Timer />
		</div>
		<div class="card">
			<h2 class="text-primary pb3">Daily report</h2>
			<div class="p6">
				<p class="margin-auto text-center text-dim">
					Start working to see your stats here.
				</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { defineComponent } from "vue";
import { get } from "@/scripts/store/state";
import Timer from "@/components/Timer/Timer.vue";

const timer = get.currentTimer;

export { timer };

export default defineComponent({
	name: "MainPanel",
	components: { Timer },
});
</script>
