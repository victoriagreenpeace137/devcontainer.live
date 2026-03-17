<script setup lang="ts">
import type { DevContainerConfig } from "../../../../types";
import InfoTooltip from "../../../InfoTooltip.vue";

const props = defineProps<{
  build?: DevContainerConfig["build"];
}>();

const emit = defineEmits<{
  (e: "update:build", val: DevContainerConfig["build"]): void;
}>();

function updateBuild(key: string, value: any) {
  emit("update:build", { ...(props.build || {}), [key]: value });
}

function handleRemoveArg(key: string) {
  const args = { ...(props.build?.args || {}) };
  delete args[key];
  updateBuild("args", args);
}

function handleUpdateArg(oldKey: string, newKey: string, value: any) {
  const args = { ...(props.build?.args || {}) };
  if (oldKey !== newKey) {
    delete args[oldKey];
  }
  args[newKey] = value;
  updateBuild("args", args);
}
</script>

<template>
  <div class="pt-4 space-y-4 animate-in fade-in duration-300">
    <div class="space-y-2">
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-1.5">
          <label
            class="text-[9px] font-black uppercase tracking-widest text-ide-text-muted"
            >Dockerfile Path</label
          >
          <InfoTooltip property="build.dockerfile" />
        </div>
        <label class="flex items-center gap-1 cursor-pointer">
          <input
            type="checkbox"
            :checked="!!build?.dockerFile && !build?.dockerfile"
            @change="
              (e) => {
                const b = { ...(build || {}) };
                if ((e.target as HTMLInputElement).checked) {
                  b.dockerFile = b.dockerfile || 'Dockerfile';
                  delete (b as any).dockerfile;
                } else {
                  b.dockerfile = b.dockerFile || 'Dockerfile';
                  delete (b as any).dockerFile;
                }
                $emit('update:build', b);
              }
            "
            class="sr-only peer"
          />
          <div
            class="w-6 h-3 bg-ide-border rounded-full peer peer-checked:bg-ide-accent transition-colors relative"
          >
            <div
              class="absolute inset-y-0.5 left-0.5 w-2 h-2 bg-white rounded-full transition-transform"
              :class="
                !!build?.dockerFile && !build?.dockerfile
                  ? 'translate-x-3'
                  : 'translate-x-0'
              "
            ></div>
          </div>
          <span
            class="text-[7px] font-bold uppercase tracking-tighter opacity-50"
            >Use 'dockerFile' Case</span
          >
        </label>
      </div>
      <input
        :value="build?.dockerfile || build?.dockerFile"
        @input="
          updateBuild(
            build?.dockerFile ? 'dockerFile' : 'dockerfile',
            ($event.target as HTMLInputElement).value,
          )
        "
        type="text"
        class="ide-input w-full font-mono"
        placeholder="Dockerfile"
      />
    </div>
    <div class="space-y-2">
      <div class="flex items-center gap-1.5">
        <label
          class="text-[9px] font-black uppercase tracking-widest text-ide-text-muted"
          >Build Context</label
        >
        <InfoTooltip property="build.context" />
      </div>
      <input
        :value="build?.context"
        @input="
          updateBuild('context', ($event.target as HTMLInputElement).value)
        "
        type="text"
        class="ide-input w-full font-mono"
        placeholder="."
      />
    </div>
    <div class="space-y-2">
      <div class="flex items-center gap-1.5">
        <label
          class="text-[9px] font-black uppercase tracking-widest text-ide-text-muted"
          >Build Args</label
        >
        <InfoTooltip property="build.args" />
      </div>
      <div class="space-y-1">
        <div
          v-for="(val, key, i) in build?.args || {}"
          :key="i"
          class="grid grid-cols-[1fr_1fr_auto] gap-1"
        >
          <input
            :value="key"
            @input="
              (e) =>
                handleUpdateArg(
                  key as string,
                  (e.target as HTMLInputElement).value,
                  val,
                )
            "
            type="text"
            class="ide-input text-[10px] py-1"
            placeholder="name"
          />
          <input
            :value="val"
            @input="
              handleUpdateArg(
                key as string,
                key as string,
                ($event.target as HTMLInputElement).value,
              )
            "
            type="text"
            class="ide-input text-[10px] py-1"
            placeholder="value"
          />
          <button
            @click="handleRemoveArg(key as string)"
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
          @click="handleUpdateArg('', '', '')"
          class="text-[8px] font-black uppercase tracking-widest text-ide-accent hover:underline"
        >
          + Add Arg
        </button>
      </div>
    </div>
    <div class="space-y-2">
      <div class="flex items-center gap-1.5">
        <label
          class="text-[9px] font-black uppercase tracking-widest text-ide-text-muted"
          >Build Options</label
        >
        <InfoTooltip property="build.options" />
      </div>
      <div class="space-y-1">
        <div v-for="(opt, i) in build?.options" :key="i" class="flex gap-1">
          <input
            :value="opt"
            @input="
              (e) => {
                const opts = [...(build?.options || [])];
                opts[i] = (e.target as HTMLInputElement).value;
                updateBuild('options', opts);
              }
            "
            type="text"
            class="ide-input flex-1 text-[10px] py-1"
            placeholder="--add-host=..."
          />
          <button
            @click="
              () => {
                const opts = [...(build?.options || [])];
                opts.splice(i, 1);
                updateBuild('options', opts);
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
          @click="updateBuild('options', [...(build?.options || []), ''])"
          class="text-[8px] font-black uppercase tracking-widest text-ide-accent hover:underline"
        >
          + Add Option
        </button>
      </div>
    </div>
  </div>
</template>
