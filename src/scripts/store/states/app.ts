import { AppView, Settings } from '@/scripts/types/app';
import { ref } from "vue";

// State
const userNew = ref(false)
const currentView = ref("home" as AppView)
const settings = ref({
  lastUsedTimer: "",
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

// Exports
export const get = {
  userNew,
  currentView,
  settings,
}

export const mutate = {
  userIsNew,
  changeView,
  importSettingsFromLs,
}

export default { get, mutate }