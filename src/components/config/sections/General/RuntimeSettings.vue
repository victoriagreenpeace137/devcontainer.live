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
  const newConfig = { ...props.config };
  (newConfig as any)[path] = value;
  emit("update:config", newConfig);
}

function updateEnvVar(
  path: "containerEnv" | "remoteEnv",
  oldKey: string,
  newKey: string,
  value: string,
) {
  const current = (props.config[path] || {}) as Record<string, string | null>;
  const updated: Record<string, string | null> = {};

  for (const k in current) {
    if (k === oldKey) {
      updated[newKey] = value;
    } else {
      updated[k] = current[k];
    }
  }

  if (oldKey === "") {
    updated[newKey] = value;
  } else if (newKey === oldKey) {
    updated[oldKey] = value;
  }

  updateConfig(path, updated);
}

function removeEnvVar(path: "containerEnv" | "remoteEnv", key: string) {
  const current = { ...(props.config[path] || {}) };
  delete current[key];
  updateConfig(path, Object.keys(current).length > 0 ? current : undefined);
}
</script>

<template>
  <div class="space-y-4">
    <SectionHeader title="Runtime Settings" />
    <div class="space-y-2">
      <div class="flex items-center gap-1.5">
        <label
          class="text-[9px] font-black uppercase tracking-widest text-ide-text-muted"
          >Workspace Mount</label
        >
        <InfoTooltip property="workspaceMount" />
      </div>
      <input
        :value="config.workspaceMount"
        @input="
          updateConfig(
            'workspaceMount',
            ($event.target as HTMLInputElement).value,
          )
        "
        type="text"
        class="ide-input w-full font-mono"
        placeholder="source=${localWorkspaceFolder},target=/workspace,type=bind"
      />
    </div>
    <div class="space-y-2">
      <div class="flex items-center gap-1.5">
        <label
          class="text-[9px] font-black uppercase tracking-widest text-ide-text-muted"
          >Workspace Folder</label
        >
        <InfoTooltip property="workspaceFolder" />
      </div>
      <input
        :value="config.workspaceFolder"
        @input="
          updateConfig(
            'workspaceFolder',
            ($event.target as HTMLInputElement).value,
          )
        "
        type="text"
        class="ide-input w-full font-mono"
        placeholder="/workspace"
      />
    </div>
    <div class="space-y-2">
      <div class="flex items-center gap-1.5">
        <label
          class="text-[9px] font-black uppercase tracking-widest text-ide-text-muted"
          >Run Arguments</label
        >
        <InfoTooltip property="runArgs" />
      </div>
      <div class="space-y-1">
        <div v-for="(arg, i) in config.runArgs" :key="i" class="flex gap-1">
          <input
            :value="arg"
            @input="
              (e) => {
                const args = [...(config.runArgs || [])];
                args[i] = (e.target as HTMLInputElement).value;
                updateConfig('runArgs', args);
              }
            "
            type="text"
            class="ide-input flex-1 text-[10px] py-1"
          />
          <button
            @click="
              () => {
                const args = [...(config.runArgs || [])];
                args.splice(i, 1);
                updateConfig('runArgs', args);
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
          @click="updateConfig('runArgs', [...(config.runArgs || []), ''])"
          class="text-[8px] font-black uppercase tracking-widest text-ide-accent hover:underline"
        >
          + Add Arg
        </button>
      </div>
    </div>

    <SectionHeader title="Environment" />
    <div class="space-y-4">
      <div class="space-y-2">
        <div class="flex items-center gap-1.5">
          <label
            class="text-[9px] font-black uppercase tracking-widest text-ide-text-muted"
            >Container Env</label
          >
          <InfoTooltip property="containerEnv" />
        </div>
        <div class="space-y-1">
          <div
            v-for="(value, key, i) in config.containerEnv"
            :key="i"
            class="grid grid-cols-[1fr_1fr_auto] gap-1"
          >
            <input
              :value="key"
              @input="
                updateEnvVar(
                  'containerEnv',
                  key as string,
                  ($event.target as HTMLInputElement).value,
                  value,
                )
              "
              type="text"
              class="ide-input text-[10px] py-1"
              placeholder="KEY"
            />
            <input
              :value="value"
              @input="
                updateEnvVar(
                  'containerEnv',
                  key as string,
                  key as string,
                  ($event.target as HTMLInputElement).value,
                )
              "
              type="text"
              class="ide-input text-[10px] py-1"
              placeholder="VALUE"
            />
            <button
              @click="removeEnvVar('containerEnv', key as string)"
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
              () => {
                const current = config.containerEnv || {};
                let newKey = 'NEW_VAR';
                let count = 1;
                while (newKey in current) {
                  newKey = `NEW_VAR_${count++}`;
                }
                updateEnvVar('containerEnv', '', newKey, '');
              }
            "
            class="text-[8px] font-black uppercase tracking-widest text-ide-accent hover:underline"
          >
            + Add Variable
          </button>
        </div>
      </div>

      <div class="space-y-2">
        <div class="flex items-center gap-1.5">
          <label
            class="text-[9px] font-black uppercase tracking-widest text-ide-text-muted"
            >Remote Env</label
          >
          <InfoTooltip property="remoteEnv" />
        </div>
        <div class="space-y-1">
          <div
            v-for="(value, key, i) in config.remoteEnv"
            :key="i"
            class="grid grid-cols-[1fr_1fr_auto] gap-1"
          >
            <input
              :value="key"
              @input="
                updateEnvVar(
                  'remoteEnv',
                  key as string,
                  ($event.target as HTMLInputElement).value,
                  value as string,
                )
              "
              type="text"
              class="ide-input text-[10px] py-1"
              placeholder="KEY"
            />
            <input
              :value="value"
              @input="
                updateEnvVar(
                  'remoteEnv',
                  key as string,
                  key as string,
                  ($event.target as HTMLInputElement).value,
                )
              "
              type="text"
              class="ide-input text-[10px] py-1"
              placeholder="VALUE"
            />
            <button
              @click="removeEnvVar('remoteEnv', key as string)"
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
              () => {
                const current = config.remoteEnv || {};
                let newKey = 'NEW_VAR';
                let count = 1;
                while (newKey in current) {
                  newKey = `NEW_VAR_${count++}`;
                }
                updateEnvVar('remoteEnv', '', newKey, '');
              }
            "
            class="text-[8px] font-black uppercase tracking-widest text-ide-accent hover:underline"
          >
            + Add Variable
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
