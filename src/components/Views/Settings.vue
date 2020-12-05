<template>
	<div class="m2 no-select">
		<h2 class="text-primary pb4">Settings</h2>
		<div class="bg-bg-1 pb2 pt2 mb4 rounded-subtle">
			<p class="text-smaller text-dim p4 m0 uppercase">User Interface</p>
			<div
				class="flex-between flex-align-center pl4 pr4 hover-bg-2"
				@click="toggleGrayscale"
			>
				<p class="m0">Grayscale mode</p>
				<ToggleButton :enabled="settings.grayscaleMode" />
			</div>
		</div>
		<div class="bg-bg-1 pb2 pt2 mb4 rounded-subtle">
			<p class="text-smaller text-dim p4 m0 uppercase">Backups</p>
			<div
				class="pl4 pr4 pt2 pb2 mb2 cursor-pointer hover-bg-2 transition-all"
				@click="exportData"
			>
				<p class="mb2 text-medium">Export data</p>
				<p class="mb0 text-dim text-medium">
					Export your data as JSON and store it, so you can import it later.
				</p>
			</div>
			<div
				class="pl4 pr4 pt2 pb2 mb2 cursor-pointer hover-bg-2 transition-all"
				@click="$refs.importRef.click()"
			>
				<p class="mb2 text-medium">Import data</p>
				<p class="mb0 text-dim text-medium">
					Import previously exported JSON data.
				</p>
			</div>
		</div>
		<div class="bg-bg-1 pb2 pt2 mb4 rounded-subtle">
			<p class="text-smaller text-dim p4 m0 uppercase">Misc</p>
			<div
				class="pl4 pr4 pt2 pb2 mb2 cursor-pointer hover-bg-2 transition-all"
				@click="clearData"
			>
				<p class="mb2 text-medium">Clear all data</p>
				<p class="mb0 text-dim text-medium">
					Reset to factory settings and start afresh.
				</p>
			</div>
		</div>
		<a ref="exportRef" :href="url" :download="filename" />
		<div v-show="false" class="pb3">
			<input type="file" @change="importData" ref="importRef" />
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

import ToggleButton from "@/components/BaseComponents/ToggleButton.vue";

import $app from "@/store/states/app";
import $history from "@/store/states/history";
import $timer from "@/store/states/timer";

export default defineComponent({
	name: "Settings",
	components: { ToggleButton },
	setup() {
		const url = ref("");
		const filename = ref("");
		const exportRef = ref(null);
		const importRef = ref(null);

		function exportData() {
			const history = $history.get.history.value;
			const timers = $timer.get.timers.value;
			const settings = $app.get.settings.value;
			const version = require("../../../package.json").version;
			const data = {
				history: [...history],
				timers: [...timers],
				settings: { ...settings },
				version,
			};
			const stringToWrite = JSON.stringify(data);
			const exportBlob = new Blob([stringToWrite], {
				type: "application/json",
			});
			url.value = URL.createObjectURL(exportBlob);

			filename.value = `export-${Date.now()}.json`;
			if (exportRef.value) {
				setTimeout(() => {
					// @ts-ignore
					exportRef.value.click();
				}, 800);
				setTimeout(() => {
					URL.revokeObjectURL(url.value);
				}, 15000);
			}
		}

		function importData(event: any) {
			if (!event?.target?.files) return;
			const file = event.target.files[0];
			if (!file || !file.name) return;

			const fr = new FileReader();
			fr.readAsText(file);
			fr.onload = () => {
				try {
					if (typeof fr.result === "string")
						validateResult(JSON.parse(fr.result));
				} catch {
					displayImportError("Invalid file");
				}
			};
			fr.onerror = () => {
				displayImportError("Invalid file");
			};
		}

		function displayImportError(message: string) {
			console.log(message);
		}

		function validateResult(result: any) {
			console.log(result);
		}

		function clearData() {
			console.log("clearing data");
		}

		return {
			settings: $app.get.settings,
			toggleGrayscale: () => $app.mutate.toggleGrayscaleMode(),
			exportData,
			url,
			filename,
			exportRef,
			importRef,
			importData,
			clearData,
		};
	},
});
</script>
