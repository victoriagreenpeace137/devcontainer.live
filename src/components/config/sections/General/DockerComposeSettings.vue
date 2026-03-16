<script setup lang="ts">
import type { DevContainerConfig } from "../../../../types";
import SectionHeader from "../../../SectionHeader.vue";
import InfoTooltip from "../../../InfoTooltip.vue";

const props = defineProps<{
  config: DevContainerConfig;
}>();

const emit = defineEmits<{
  (e: "update:config", val: DevContainerConfig): void;
}>();

function updateConfig(path: string, value: any) {
  emit("update:config", { ...props.config, [path]: value });
}
</script>

<template>
  <div class="pt-4 space-y-4 animate-in fade-in duration-300">
    <div class="space-y-2">
      <div class="flex items-center gap-1.5">
        <label
          class="text-[9px] font-black uppercase tracking-widest text-ide-text-muted"
          >Compose File</label
        >
        <InfoTooltip property="dockerComposeFile" />
      </div>
      <input
        :value="
          Array.isArray(config.dockerComposeFile)
            ? config.dockerComposeFile[0]
            : config.dockerComposeFile
        "
        @input="
          updateConfig('dockerComposeFile', [
            ($event.target as HTMLInputElement).value,
          ])
        "
        type="text"
        class="ide-input w-full font-mono"
        placeholder="docker-compose.yml"
      />
    </div>
    <div class="space-y-2">
      <div class="flex items-center gap-1.5">
        <label
          class="text-[9px] font-black uppercase tracking-widest text-ide-text-muted"
          >Service Name</label
        >
        <InfoTooltip property="service" />
      </div>
      <input
        :value="config.service"
        @input="
          updateConfig('service', ($event.target as HTMLInputElement).value)
        "
        type="text"
        class="ide-input w-full font-mono"
        placeholder="app"
      />
    </div>

    <div class="space-y-6 pt-4 border-t border-ide-border/30">
      <SectionHeader title="Docker Compose Services" />
      <div class="space-y-3">
        <div class="flex flex-col gap-0.5">
          <div class="flex items-center gap-1.5">
            <label
              class="text-[9px] font-black uppercase tracking-widest text-ide-text-muted"
              >Run Services</label
            >
            <InfoTooltip property="runServices" />
          </div>
        </div>
        <div class="space-y-1">
          <div
            v-for="(service, i) in config.runServices"
            :key="i"
            class="flex gap-1"
          >
            <input
              :value="service"
              @input="
                (e) => {
                  const svcs = [...(config.runServices || [])];
                  svcs[i] = (e.target as HTMLInputElement).value;
                  updateConfig('runServices', svcs);
                }
              "
              type="text"
              class="ide-input flex-1 text-[10px] py-1"
              placeholder="service-name"
            />
            <button
              @click="
                () => {
                  const svcs = [...(config.runServices || [])];
                  svcs.splice(i, 1);
                  updateConfig('runServices', svcs);
                }
              "
              class="text-ide-text-muted hover:text-ide-orange"
            >
              <svg
                class="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <button
            @click="
              updateConfig('runServices', [...(config.runServices || []), ''])
            "
            class="text-[8px] font-black uppercase tracking-widest text-ide-accent hover:underline"
          >
            + Add Service
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
