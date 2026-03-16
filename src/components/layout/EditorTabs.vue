<script setup lang="ts">
defineProps<{
  copyStatus: "idle" | "copied";
}>();

defineEmits<{
  (e: "copy"): void;
  (e: "download"): void;
  (e: "reset"): void;
}>();
</script>

<template>
  <div
    class="h-9 bg-ide-sidebar border-b border-ide-border flex items-center justify-between z-20"
  >
    <div class="flex h-full">
      <div class="tab-item active">
        <span class="text-ide-purple text-[10px] font-bold">{ }</span>
        <span>devcontainer.json</span>
      </div>
    </div>

    <div class="flex items-center gap-2 px-4">
      <button
        @click="$emit('copy')"
        class="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-ide-accent/10 transition-colors text-ide-text-muted hover:text-ide-text-bright group"
      >
        <svg
          v-if="copyStatus === 'idle'"
          class="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m-3 8h3m-3 4h3"
          />
        </svg>
        <svg
          v-else
          class="w-3.5 h-3.5 text-ide-green"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="3"
            d="M5 13l4 4L19 7"
          />
        </svg>
        <span class="text-[10px] font-bold uppercase tracking-widest">{{
          copyStatus === "copied" ? "Copied" : "Copy"
        }}</span>
      </button>
      <button
        @click="$emit('download')"
        class="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-ide-accent/10 transition-colors text-ide-text-muted hover:text-ide-text-bright"
      >
        <svg
          class="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        <span class="text-[10px] font-bold uppercase tracking-widest"
          >Download</span
        >
      </button>
      <div class="w-px h-3 bg-ide-border mx-1"></div>
      <button
        @click="$emit('reset')"
        class="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-ide-accent/10 transition-colors text-ide-text-muted hover:text-ide-red group"
      >
        <svg
          class="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        <span class="text-[10px] font-bold uppercase tracking-widest"
          >Reset</span
        >
      </button>
    </div>
  </div>
</template>
