<script setup lang="ts">
import type { DevContainerConfig } from "../../../../types";
import SectionHeader from "../../../SectionHeader.vue";
import InfoTooltip from "../../../InfoTooltip.vue";
import SearchableSelect from "../../../SearchableSelect.vue";

const props = defineProps<{
  config: DevContainerConfig;
}>();

const emit = defineEmits<{
  (e: "update:config", val: DevContainerConfig): void;
}>();

const lifecycleHooks = [
  {
    key: "initializeCommand",
    label: "Initialize Command",
    desc: "RUNS ON HOST",
    color: "text-ide-orange",
  },
  {
    key: "onCreateCommand",
    label: "On Create Command",
    desc: "RUNS INSIDE CONTAINER",
    color: "text-ide-accent",
  },
  {
    key: "updateContentCommand",
    label: "Update Content Command",
    desc: "RUNS INSIDE CONTAINER",
    color: "text-ide-accent",
  },
  {
    key: "postCreateCommand",
    label: "Post Create Command",
    desc: "RUNS INSIDE CONTAINER",
    color: "text-ide-accent",
  },
  {
    key: "postStartCommand",
    label: "Post Start Command",
    desc: "RUNS INSIDE CONTAINER",
    color: "text-ide-accent",
  },
  {
    key: "postAttachCommand",
    label: "Post Attach Command",
    desc: "RUNS INSIDE CONTAINER",
    color: "text-ide-accent",
  },
] as const;

type HookKey = (typeof lifecycleHooks)[number]["key"];

const waitForOptions = [
  { value: "initializeCommand", label: "Initialize Command" },
  { value: "onCreateCommand", label: "On Create Command" },
  { value: "updateContentCommand", label: "Update Content Command" },
  { value: "postCreateCommand", label: "Post Create Command" },
  { value: "postStartCommand", label: "Post Start Command" },
];

function updateConfig(path: string, value: any) {
  emit("update:config", { ...props.config, [path]: value });
}

function getHookValue(key: HookKey) {
  return props.config[key];
}
</script>

<template>
  <div class="space-y-8">
    <SectionHeader title="Lifecycle Hooks" />
    <div class="space-y-6">
      <div v-for="hook in lifecycleHooks" :key="hook.key" class="space-y-3">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-1.5">
            <label
              class="text-[9px] font-black uppercase tracking-widest text-ide-text-muted"
              >{{ hook.label }}</label
            >
            <InfoTooltip :property="hook.key" />
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="
                () => {
                  const val = getHookValue(hook.key);
                  if (typeof val === 'object' && !Array.isArray(val)) {
                    const keys = Object.keys(val || {});
                    updateConfig(hook.key, keys.length > 0 ? val[keys[0]] : '');
                  } else {
                    updateConfig(hook.key, {
                      main: typeof val === 'string' ? val : '',
                    });
                  }
                }
              "
              class="text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 border border-ide-border rounded hover:border-ide-accent hover:text-ide-accent transition-colors"
            >
              {{
                typeof getHookValue(hook.key) === "object" &&
                !Array.isArray(getHookValue(hook.key))
                  ? "Sequential"
                  : "Parallel"
              }}
            </button>
            <span class="text-[8px] font-mono opacity-50" :class="hook.color">{{
              hook.desc
            }}</span>
          </div>
        </div>

        <input
          v-if="
            typeof getHookValue(hook.key) !== 'object' ||
            Array.isArray(getHookValue(hook.key))
          "
          :value="getHookValue(hook.key)"
          @input="
            updateConfig(hook.key, ($event.target as HTMLInputElement).value)
          "
          type="text"
          class="ide-input w-full font-mono py-1.5"
          :placeholder="
            hook.key === 'postCreateCommand' ? 'npm install' : 'COMMAND_STRING'
          "
        />

        <div v-else class="space-y-2 border-l border-ide-accent/20 pl-4">
          <div
            v-for="(cmd, subKey) in getHookValue(hook.key) as Record<
              string,
              string
            >"
            :key="subKey"
            class="flex gap-2"
          >
            <input
              :value="subKey"
              @change="
                (e) => {
                  const val = {
                    ...(getHookValue(hook.key) as Record<string, string>),
                  };
                  const newKey = (e.target as HTMLInputElement).value;
                  if (newKey !== subKey) {
                    val[newKey] = val[subKey];
                    delete val[subKey];
                    updateConfig(hook.key, val);
                  }
                }
              "
              type="text"
              class="ide-input w-20 text-[9px] font-black uppercase opacity-50"
            />
            <input
              :value="cmd"
              @input="
                (e) => {
                  const val = {
                    ...(getHookValue(hook.key) as Record<string, string>),
                  };
                  val[subKey] = (e.target as HTMLInputElement).value;
                  updateConfig(hook.key, val);
                }
              "
              type="text"
              class="ide-input flex-1 font-mono text-[10px]"
            />
            <button
              @click="
                () => {
                  const val = {
                    ...(getHookValue(hook.key) as Record<string, string>),
                  };
                  delete val[subKey];
                  updateConfig(
                    hook.key,
                    Object.keys(val).length > 0 ? val : '',
                  );
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
              () => {
                const val = {
                  ...(getHookValue(hook.key) as Record<string, string>),
                };
                val[`step_${Object.keys(val).length + 1}`] = '';
                updateConfig(hook.key, val);
              }
            "
            class="text-[8px] font-black uppercase tracking-widest text-ide-accent hover:underline"
          >
            + Add parallel step
          </button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4 items-end mt-4">
      <div class="space-y-2">
        <div class="flex items-center gap-1.5">
          <label
            class="text-[9px] font-black uppercase tracking-widest text-ide-text-muted"
            >Wait For Hook</label
          >
          <InfoTooltip property="waitFor" />
        </div>
        <SearchableSelect
          :model-value="config.waitFor || 'postCreateCommand'"
          :options="waitForOptions"
          @update:model-value="updateConfig('waitFor', $event)"
          placeholder="Select hook to wait for..."
        />
      </div>
      <label
        class="flex items-center gap-3 p-3 bg-ide-activity border border-ide-border rounded-lg cursor-pointer group hover:border-ide-accent/50 transition-colors h-[42px]"
      >
        <input
          type="checkbox"
          :checked="config.overrideCommand"
          @change="
            updateConfig(
              'overrideCommand',
              ($event.target as HTMLInputElement).checked,
            )
          "
          class="hidden"
        />
        <div
          class="w-4 h-4 border-2 border-ide-border rounded flex items-center justify-center group-hover:border-ide-accent transition-colors"
          :class="{ 'bg-ide-accent border-ide-accent': config.overrideCommand }"
        >
          <svg
            v-if="config.overrideCommand"
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
        <div class="flex items-center gap-1.5">
          <span class="text-[10px] font-black uppercase tracking-widest"
            >Override Command</span
          >
          <InfoTooltip property="overrideCommand" />
        </div>
      </label>
    </div>
  </div>
</template>
