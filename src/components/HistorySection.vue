<script setup lang="ts">
import { computed } from "vue";
import type { DevContainerConfig } from "../types";
import SectionHeader from "./SectionHeader.vue";
import MountsControl from "./MountsControl.vue";

const props = defineProps<{
  config: DevContainerConfig;
}>();

const emit = defineEmits<{
  (e: "update:config", value: DevContainerConfig): void;
}>();

function updateConfig(path: string, value: any) {
  const newConfig = { ...props.config };
  (newConfig as any)[path] = value;
  emit("update:config", newConfig);
}

const hasBashHistoryMount = computed(() => {
  return (props.config.mounts || []).some((m: any) => {
    const mount = typeof m === "string" ? m : m.target;
    return mount === "/commandhistory";
  });
});

function toggleBashHistory() {
  const existing = props.config.mounts || [];
  const bashHistoryMount = {
    source: "bash-history",
    target: "/commandhistory",
    type: "volume",
  };

  if (hasBashHistoryMount.value) {
    updateConfig(
      "mounts",
      existing.filter((m: any) => {
        const mount = typeof m === "string" ? m : m.target;
        return mount !== "/commandhistory";
      }),
    );
  } else {
    updateConfig("mounts", [...existing, bashHistoryMount]);
  }
}
</script>

<template>
  <div class="space-y-8">
    <SectionHeader title="Bash History" />
    <div class="space-y-4">
      <label
        class="flex items-center gap-3 p-3 bg-ide-activity/50 border border-ide-border rounded-lg cursor-pointer group hover:border-ide-accent/50 transition-colors"
      >
        <input
          type="checkbox"
          :checked="hasBashHistoryMount"
          @change="toggleBashHistory"
          class="hidden"
        />
        <div
          class="w-4 h-4 border-2 border-ide-border rounded flex items-center justify-center group-hover:border-ide-accent transition-colors"
          :class="{ 'bg-ide-accent border-ide-accent': hasBashHistoryMount }"
        >
          <svg
            v-if="hasBashHistoryMount"
            class="w-3 h-3 text-ide-bg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="4"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <div class="flex flex-col">
          <span class="text-[10px] font-black uppercase tracking-widest"
            >Persist Bash History</span
          >
          <span class="text-[8px] text-ide-text-muted"
            >Keep command history across rebuilds</span
          >
        </div>
      </label>
    </div>

    <div class="space-y-4">
      <SectionHeader title="Mounts & Volumes" tooltip="mounts" />
      <MountsControl
        :mounts="config.mounts || []"
        @update:mounts="updateConfig('mounts', $event)"
      />
    </div>
  </div>
</template>
