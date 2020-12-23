<template>
	<div class="mt12">
		<MyTimers />
		<External />
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import MyTimers from "@/components/Manage/MyTimers.vue";
import External from "@/components/Manage/External.vue";

export default defineComponent({
	name: "ManageTimers",
	components: { External, MyTimers },
});
</script>
