<template>
  <div class="card">
    <h2 class="text-primary pb2">External</h2>
    <div v-for="timer in externals" :key="timer.id">
      <div class="card-alt">
        <p class="text-bold">{{ timer.name }}</p>
        <p class="text-dim text-small pb2">{{ timer.desc }}</p>
        <button
          class="bg-bg-3 text-white uppercase"
          @click="importTimerFromExternal(timer.id)"
        >
          Import
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { get, mutate } from "@/providers/timer";

export default defineComponent({
  name: "External",
  setup() {
    const externals = get.externals;

    function importTimerFromExternal(id: string) {
      mutate.importTimerFromExternal(id);
    }

    return {
      externals,
      importTimerFromExternal,
    };
  },
});
</script>
