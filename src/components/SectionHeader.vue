<script setup lang="ts">
import InfoTooltip from "./InfoTooltip.vue";

defineProps<{
  title: string;
  tooltip?: string;
}>();
</script>

<template>
  <div class="mb-6">
    <div class="flex items-center gap-1.5 mb-1">
      <label
        class="text-[10px] font-black uppercase tracking-[0.25em] text-ide-text-muted block"
      >
        {{ title }}
      </label>
      <InfoTooltip v-if="tooltip" :property="tooltip" />
    </div>
    <div
      class="h-[1px] w-full bg-gradient-to-r from-ide-border to-transparent"
    ></div>
  </div>
</template>
