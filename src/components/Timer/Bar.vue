<template>
	<div class="flex-start full-width">
		<div
			v-for="(segment, i) in bar"
			:key="i"
			:style="segment.css"
			class="relative ml1 mr1 pt1 rounded-full transition-all"
			:class="getClass(segment.isCurrent)"
		>
			<div class="absolute label text-smallest">
				<p class="m0">{{ segment.name }}</p>
				<p class="text-dim m0">{{ `${segment.duration} mins` }}</p>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { get } from "@/store/states/timer";
import { Spec, TimerBarSegment } from "@//types/timer";

export default defineComponent({
	name: "Bar",
	props: {
		currentSegment: {
			type: Number,
			required: true,
			default: 0,
		},
	},
	setup(props) {
		const timer = get.currentTimer;

		const totalMinutes = computed(() => {
			return timer.value.spec.reduce(
				(acc: number, current: Spec) => acc + current.duration,
				0
			);
		});

		const bar = computed(() => {
			return timer.value.spec.reduce(
				(acc: TimerBarSegment[], current: Spec, i: number) => {
					const { name, duration } = current;
					const newSegment: TimerBarSegment = {
						name,
						duration,
						isCurrent: props.currentSegment === i,
						css: {
							width: Math.floor((duration / totalMinutes.value) * 100) + "%",
						},
					};
					acc.push(newSegment);
					return acc;
				},
				[]
			);
		});

		function getClass(condition: boolean) {
			const x = {
				"bg-bg-3": condition ? false : true,
				"bg-primary": condition ? true : false,
			};
			return x;
		}

		return {
			bar,
			getClass,
		};
	},
});
</script>

<style lang="scss" scoped>
.label {
	width: 100%;
	text-align: center;
	text-transform: capitalize;
	transform: translateY(-160%);
}
</style>
