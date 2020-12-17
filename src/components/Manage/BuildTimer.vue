<template>
	<div>
		<h2 class="mb6">Build a timer</h2>
		<div class="mb6">
			<p class="text-smallest text-primary m0">Name</p>
			<input
				type="text"
				placeholder="Name your timer"
				class="full-width"
				v-model="name"
			/>
		</div>
		<div class="mb6">
			<p class="text-smallest text-primary m0">Description</p>
			<input
				type="text"
				placeholder="Write description"
				class="full-width"
				v-model="description"
			/>
		</div>
		<div class="mb6">
			<p class="text-smallest text-primary">Segments</p>
			<!-- All segments -->
			<div class="mb3">
				<transition-group name="fade">
					<div
						v-for="(segment, i) in segments"
						:key="i"
						class="flex-start flex-align-center full-width bg-bg-2 p3 mb2 rounded-subtle no-select"
					>
						<i class="material-icons icon text-xl width-smaller">
							{{ segment.icon }}
						</i>
						<p class="m0 text-small full-width">
							{{ `${segment.name} (${segment.duration} mins)` }}
						</p>
						<button class="bg-none icon" @click="removeSegment(i)">
							<i class="material-icons light">remove_circle</i>
						</button>
					</div>
				</transition-group>
			</div>
			<!-- New Segment -->
			<div
				class="flex-between flex-align-center full-width bg-bg-2 border-highlight p3 mb6"
				:class="segmentError ? 'bg-danger' : ''"
				v-if="showCreateForm"
			>
				<i
					class="material-icons icon text-xl mt2 width-smaller"
					@click="showIconPicker"
					>{{ newSegment.icon }}</i
				>
				<input
					type="text"
					placeholder="Segment name"
					class="ml4 full-width"
					v-model="newSegment.name"
				/>
				<input
					type="number"
					placeholder="Duration"
					class="ml4 width-small"
					v-model.number="newSegment.duration"
				/>
			</div>
			<!-- Action button -->
			<div
				class="flex-start flex-align-center long-button no-select mt3 bg-bg-2"
				@click="actionButtonClickHandler"
			>
				<i class="material-icons">
					{{ showCreateForm ? "save" : "add_circle" }}
				</i>
				<p class="text-medium m0 ml4">
					{{ showCreateForm ? "Save segment" : "New Segment" }}
				</p>
			</div>
		</div>
		<div class="flex-end">
			<button
				class="bg-secondary text-dark text-bold mt4"
				@click="addToMyTimers"
			>
				Add to library
			</button>
		</div>
		<CustomModal v-if="iconPickerVisible" @close="closeIconPicker">
			<IconPicker @selected="selectIcon" />
		</CustomModal>
	</div>
</template>

<script lang="ts">
// @ts-ignore
import { v4 as uuid } from "uuid";
import { defineComponent, reactive, ref } from "vue";

import CustomModal from "@/components/BaseComponents/CustomModal.vue";
import IconPicker from "@/components/Manage/IconPicker.vue";

import { Spec, Timer } from "@/types/timer";
import { mutate } from "@/providers/timer";

const months = require("@/lib/months.json");
const iconsList = require("@/lib/iconsList.json");

export default defineComponent({
	name: "BuildTimer",
	components: { CustomModal, IconPicker },
	emits: ["complete"],
	setup(_, { emit }) {
		const time = new Date();
		const day = time.getDate();
		const month = months[time.getMonth()];
		const year = time.getFullYear();
		const defaultDesc = `Built by me on ${day} ${month} ${year}`;

		const name = ref("Untitled");
		const description = ref("");
		description.value = defaultDesc;

		const segments = ref([] as Spec[]);
		const newSegment = reactive({
			name: null as null | string,
			duration: null as null | number,
			icon: "work",
		});

		const showCreateForm = ref(false);
		const segmentError = ref(false);

		function actionButtonClickHandler() {
			showCreateForm.value ? submitSegment() : (showCreateForm.value = true);
		}

		function submitSegment() {
			segmentError.value = false;
			if (!isSegmentValid(newSegment as Spec)) {
				segmentError.value = true;
				return;
			}
			segments.value.push({
				name: newSegment.name as string,
				icon: newSegment.icon,
				duration: newSegment.duration as number,
			});
			newSegment.name = null;
			newSegment.duration = null;
			newSegment.icon = "work";
		}

		function removeSegment(index: number) {
			segments.value = segments.value.filter((each, i) => i !== index);
		}

		function isSegmentValid(segment: Spec) {
			return (
				segment.name &&
				segment.name.length > 0 &&
				iconsList.includes(segment.icon) &&
				segment.duration &&
				segment.duration > 0 &&
				segment.duration < 120
			);
		}

		const iconPickerVisible = ref(false);
		const showIconPicker = () => (iconPickerVisible.value = true);
		function selectIcon(icon: string) {
			newSegment.icon = icon;
			closeIconPicker();
		}
		function closeIconPicker() {
			iconPickerVisible.value = false;
		}

		function addToMyTimers() {
			const timer: Timer = {
				id: uuid(),
				name: name.value,
				desc: description.value,
				spec: JSON.parse(JSON.stringify(segments.value)),
			};

			if (isTimerValid(timer)) mutate.newTimer(timer);
			emit("complete");
		}

		function isTimerValid(timer: Timer) {
			const { id, name, desc, spec } = timer;
			return (
				typeof id === "string" &&
				typeof name === "string" &&
				typeof desc === "string" &&
				!spec.map((each) => isSegmentValid(each)).includes(false)
			);
		}

		const buildError = ref(false);

		return {
			name,
			description,
			actionButtonClickHandler,
			showCreateForm,
			segmentError,
			newSegment,
			segments,
			removeSegment,
			showIconPicker,
			iconPickerVisible,
			closeIconPicker,
			selectIcon,
			addToMyTimers,
			buildError,
		};
	},
});
</script>
