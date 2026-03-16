<script setup lang="ts">
import type { DevContainerConfig, OrchestrationType } from "../types";
import LifecycleHooks from "./config/sections/Advanced/LifecycleHooks.vue";
import DockerRuntimeSettings from "./config/sections/Advanced/DockerRuntimeSettings.vue";
import HostRequirements from "./config/sections/Advanced/HostRequirements.vue";

const props = defineProps<{
  config: DevContainerConfig;
  orchestration: OrchestrationType;
}>();

const emit = defineEmits<{
  (e: "update:config", value: DevContainerConfig): void;
}>();

function updateConfig(newConfig: DevContainerConfig) {
  emit("update:config", newConfig);
}
</script>

<template>
  <div class="space-y-8">
    <LifecycleHooks :config="config" @update:config="updateConfig" />

    <DockerRuntimeSettings :config="config" @update:config="updateConfig" />

    <HostRequirements :config="config" @update:config="updateConfig" />
  </div>
</template>
