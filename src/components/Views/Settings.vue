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
				@click="resetModal = true"
			>
				<p class="mb2 text-medium">Clear all data</p>
				<p class="mb0 text-dim text-medium">
					Reset to factory settings and start afresh.
				</p>
			</div>
		</div>
		<CustomModal v-if="importModal" @close="closeImportModal">
			<h1 class="capitalize mb8">
				<i class="material-icons mr3">library_add_check</i>
				Import complete!
			</h1>
			<p>Following data have been imported.</p>
			<p
				v-for="(each, i) in imports"
				:key="i"
				class="mb1 ml4 text-small capitalize"
			>
				{{ `${i + 1}. ${each}` }}
			</p>
			<button
				class="full-width bg-secondary text-dark mt6"
				@click="closeImportModal"
			>
				GO TO HOME
			</button>
		</CustomModal>
		<NotifyModal
			v-if="error.state"
			@proceed-clicked="closeErrorModal"
			@close="closeErrorModal"
			titleIcon="error"
			title="Import error"
			:message="error.message"
			primaryButtonText="CLOSE"
		/>
		<NotifyModal
			v-if="resetModal"
			@proceed-clicked="clearData"
			@close="resetModal = false"
			titleIcon="priority_high"
			title="Clear all data?"
			message="This action is irreversible. Proceed?"
			primaryButtonText="CLEAR ALL DATA"
		/>
		<!-- Invisible import/export element -->
		<a ref="exportRef" :href="url" :download="filename" />
		<div v-show="false" class="pb3">
			<input type="file" @change="importData" ref="importRef" />
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";

import ToggleButton from "@/components/BaseComponents/ToggleButton.vue";
import CustomModal from "@/components/BaseComponents/CustomModal.vue";
import NotifyModal from "@/components/BaseComponents/NotifyModal.vue";

import $app from "@/store/states/app";
import $history from "@/store/states/history";
import $timer from "@/store/states/timer";
import { clearLocalStorage } from "@/store/scripts/ls.ts";
import { BatchImport } from "@/types/app";

export default defineComponent({
	name: "Settings",
	components: { ToggleButton, CustomModal, NotifyModal },
	setup() {
		// Export and import features
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

		// @ts-ignore
		function importData(event) {
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
					displayImportError("Selected file could not be imported.");
				}
			};
			fr.onerror = () => {
				displayImportError("Selected file could not be imported.");
			};
		}

		// Import result
		const error = reactive({
			state: false,
			message: "",
		});

		function displayImportError(message: string) {
			error.state = true;
			error.message = message;
		}

		function closeErrorModal() {
			error.state = false;
			error.message = "";
		}

		function validateResult(result: BatchImport) {
			storeData(result);
		}

		const importModal = ref(false);
		const imports = ref([] as string[]);
		function storeData(data: BatchImport) {
			console.log(data);
			imports.value = Object.keys(data);
			importModal.value = true;
			try {
				$history.mutate.batchImport(data.history, data.timers);
				$timer.mutate.batchImport(data.timers);
				$app.mutate.batchImport(data.settings);
			} catch (err) {
				if (process.env.NODE_ENV === "development") console.log(err);
			}
		}

		function closeImportModal() {
			importModal.value = false;
			imports.value = [];
			$app.mutate.changeView("home");
		}

		const resetModal = ref(false);
		function clearData() {
			clearLocalStorage();
			location.reload();
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
			error,
			closeErrorModal,
			resetModal,
			imports,
			importModal,
			closeImportModal,
		};
	},
});
</script>
