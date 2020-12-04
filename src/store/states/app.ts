import { AppView, Settings } from '@//types/app';
import { computed, ref } from "vue";
import { storeSettingsToLs } from '../scripts/ls';

// State
const userNew = ref(false)
const currentView = ref("home" as AppView)

const settings = ref({
  lastUsedTimer: "",
  grayscaleMode: false,
} as Settings)

// Mutations
function userIsNew () {
  userNew.value = true
}

function changeView(view: AppView) {
  currentView.value = view
}

function importSettingsFromLs(lsValue: Settings) {
  for (const key in lsValue) {
    settings.value[key] = lsValue[key]
  }
}

function toggleGrayscaleMode() {
  settings.value.grayscaleMode = !settings.value.grayscaleMode
  exportSettingsToLs(settings.value)
}

// LocalStorage
function exportSettingsToLs(val: Settings) {
  storeSettingsToLs(val)
}

// Exports
export const get = {
  userNew,
  currentView,
  settings: computed(() => settings.value),
}

export const mutate = {
  userIsNew,
  changeView,
  toggleGrayscaleMode,
  storeSettingsToLs,
  importSettingsFromLs,
}

export default { get, mutate }