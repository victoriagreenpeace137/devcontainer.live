<script setup lang="ts">
import type { DevContainerConfig } from "../types";
import SectionHeader from "./SectionHeader.vue";
import FeatureSelector from "./FeatureSelector.vue";
import InfoTooltip from "./InfoTooltip.vue";

const props = defineProps<{
  config: DevContainerConfig;
}>();

const emit = defineEmits<{
  (e: "update:config", value: DevContainerConfig): void;
}>();

function updateConfig(path: string, value: any) {
  const newConfig = { ...props.config };

  if (path.startsWith("customizations.")) {
    const parts = path.split(".");
    if (parts.length === 2) {
      newConfig.customizations = {
        ...(newConfig.customizations || {}),
        [parts[1]]: value,
      };
    } else if (parts.length >= 3) {
      const category = parts[1];
      const key = parts.slice(2).join(".");
      const categoryObj = (newConfig.customizations?.[category] ||
        {}) as Record<string, any>;
      newConfig.customizations = {
        ...(newConfig.customizations || {}),
        [category]: { ...categoryObj, [key]: value },
      };
    }
  } else {
    (newConfig as any)[path] = value;
  }

  emit("update:config", newConfig);
}

function removeItem(path: string, index: number) {
  let list: any[] = [];
  const currentVal = (props.config as any)[path];

  list = [...(currentVal || [])];
  list.splice(index, 1);
  updateConfig(path, list);
}

function getVscodeExtensions(): string[] {
  return props.config.customizations?.vscode?.extensions || [];
}

function addVscodeExtension() {
  const current = getVscodeExtensions();
  updateConfig("customizations.vscode.extensions", [...current, ""]);
}

function updateVscodeExtension(index: number, value: string) {
  const current = getVscodeExtensions();
  const updated = [...current];
  updated[index] = value;
  updateConfig("customizations.vscode.extensions", updated);
}

function removeVscodeExtension(index: number) {
  const current = getVscodeExtensions();
  const updated = current.filter((_, i) => i !== index);
  updateConfig(
    "customizations.vscode.extensions",
    updated.length > 0 ? updated : undefined,
  );
}

function getVscodeSettings(): Record<string, any> {
  return props.config.customizations?.vscode?.settings || {};
}

function addVscodeSetting() {
  const current = getVscodeSettings();
  let newKey = "";
  let count = 1;
  while (
    newKey in current ||
    (newKey === "" && Object.keys(current).includes(""))
  ) {
    newKey = `setting_${count++}`;
  }
  updateConfig("customizations.vscode.settings", { ...current, [newKey]: "" });
}

function updateVscodeSettingKey(oldKey: string, newKey: string) {
  const current = getVscodeSettings();
  const value = current[oldKey];
  const updated: Record<string, any> = {};
  for (const key in current) {
    if (key === oldKey) {
      updated[newKey] = value;
    } else {
      updated[key] = current[key];
    }
  }
  updateConfig("customizations.vscode.settings", updated);
}

function updateVscodeSettingValue(key: string, value: string) {
  const current = getVscodeSettings();
  updateConfig("customizations.vscode.settings", { ...current, [key]: value });
}

function removeVscodeSetting(key: string) {
  const current = getVscodeSettings();
  const updated: Record<string, any> = {};
  for (const k in current) {
    if (k !== key) {
      updated[k] = current[k];
    }
  }
  updateConfig(
    "customizations.vscode.settings",
    Object.keys(updated).length > 0 ? updated : undefined,
  );
}
</script>

<template>
  <div class="space-y-8">
    <SectionHeader title="Dev Features" />
    <FeatureSelector
      :selectedFeatures="config.features || {}"
      @update:selectedFeatures="updateConfig('features', $event)"
    />

    <div class="space-y-4 pt-4 border-t border-ide-border">
      <SectionHeader
        title="Install Order"
        tooltip="overrideFeatureInstallOrder"
        class="!mb-4"
      />
      <div class="space-y-2">
        <div
          v-for="(feat, i) in config.overrideFeatureInstallOrder"
          :key="i"
          class="flex gap-1"
        >
          <input
            :value="feat"
            @input="
              (e) => {
                const list = [...(config.overrideFeatureInstallOrder || [])];
                list[i] = (e.target as HTMLInputElement).value;
                updateConfig('overrideFeatureInstallOrder', list);
              }
            "
            type="text"
            class="ide-input flex-1 text-[10px] py-1"
            placeholder="ghcr.io/devcontainers/features/node"
          />
          <button
            @click="removeItem('overrideFeatureInstallOrder', i)"
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
            updateConfig('overrideFeatureInstallOrder', [
              ...(config.overrideFeatureInstallOrder || []),
              '',
            ])
          "
          class="text-[8px] font-black uppercase tracking-widest text-ide-accent hover:underline"
        >
          + Add Feature ID
        </button>
      </div>
    </div>

    <div class="space-y-4 pt-4 border-t border-ide-border">
      <SectionHeader title="IDE Customizations" />
      <div class="space-y-6">
        <div class="space-y-3">
          <div class="flex items-center gap-1.5">
            <label
              class="text-[9px] font-black uppercase tracking-widest text-ide-text-muted"
              >VS Code Extensions</label
            >
            <InfoTooltip property="extensions" />
          </div>
          <div class="space-y-2">
            <div
              v-for="(ext, index) in config.customizations?.vscode
                ?.extensions || []"
              :key="index"
              class="flex items-center gap-2"
            >
              <input
                :value="ext"
                @input="
                  updateVscodeExtension(
                    Number(index),
                    ($event.target as HTMLInputElement).value,
                  )
                "
                type="text"
                class="ide-input flex-1"
                placeholder="ms-python.python"
              />
              <button
                @click="removeVscodeExtension(Number(index))"
                class="p-2 text-ide-text-muted hover:text-red-400 transition-colors"
              >
                <svg
                  class="w-4 h-4"
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
              @click="addVscodeExtension"
              class="text-[8px] font-black uppercase tracking-widest text-ide-accent hover:underline"
            >
              + Add Extension
            </button>
          </div>
        </div>

        <div class="space-y-3">
          <div class="flex items-center gap-1.5">
            <label
              class="text-[9px] font-black uppercase tracking-widest text-ide-text-muted"
              >VS Code Settings</label
            >
            <InfoTooltip property="settings" />
          </div>
          <div class="space-y-2">
            <template v-if="config.customizations?.vscode?.settings">
              <div
                v-for="(value, key, index) in config.customizations.vscode.settings"
                :key="index"
                class="grid grid-cols-[1fr_1fr_auto] gap-2 items-center"
              >
                <input
                  :value="key"
                  @input="
                    updateVscodeSettingKey(
                      key as string,
                      ($event.target as HTMLInputElement).value,
                    )
                  "
                  type="text"
                  class="ide-input"
                  placeholder="setting.key"
                />
                <input
                  :value="value"
                  @input="
                    updateVscodeSettingValue(
                      key as string,
                      ($event.target as HTMLInputElement).value,
                    )
                  "
                  type="text"
                  class="ide-input"
                  placeholder="value"
                />
                <button
                  @click="removeVscodeSetting(key as string)"
                  class="p-2 text-ide-text-muted hover:text-red-400 transition-colors"
                >
                  <svg
                    class="w-4 h-4"
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
            </template>
            <button
              @click="addVscodeSetting"
              class="text-[8px] font-black uppercase tracking-widest text-ide-accent hover:underline"
            >
              + Add Setting
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
