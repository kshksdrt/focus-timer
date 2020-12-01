import { AppView } from '@/scripts/types/app';
import { computed, ref } from "vue";

// State
const currentView = ref("home" as AppView)

// Mutations
function changeView(view: AppView) {
  currentView.value = view
}

// Exports
export const get = {
  currentView: computed(() => currentView.value)
}

export const mutate = {
  changeView
}

export default { get, mutate }