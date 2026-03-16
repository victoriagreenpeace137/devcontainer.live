<script setup lang="ts">
import { ref } from "vue";
import { useDocSpecs } from "../composables/useDocSpecs";

const props = defineProps<{
  property: string;
}>();

const { getDesc } = useDocSpecs();

// Smart positioning state
const containerRef = ref<HTMLElement | null>(null);
const showTooltip = ref(false);
const position = ref<{ top?: boolean; right?: boolean }>({});
const coords = ref({ x: 0, y: 0 });

function handleEnter() {
  calculatePosition();
  showTooltip.value = true;
}

function handleLeave() {
  showTooltip.value = false;
}

function calculatePosition() {
  if (!containerRef.value) return;

  const rect = containerRef.value.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const tooltipWidth = 256;
  const tooltipHeight = 150;

  const spaceAbove = rect.top;
  const spaceBelow = viewportHeight - rect.bottom;
  const spaceRight = viewportWidth - rect.left;

  const isTopOverflow = spaceAbove < tooltipHeight && spaceBelow > spaceAbove;
  const isRightOverflow = spaceRight < tooltipWidth;

  position.value = {
    top: isTopOverflow,
    right: isRightOverflow,
  };

  coords.value = {
    x: rect.left,
    y: isTopOverflow ? rect.bottom : rect.top,
  };
}
</script>

<template>
  <div
    v-if="getDesc(property)"
    ref="containerRef"
    class="relative flex items-center"
    @mouseenter="handleEnter"
    @mouseleave="handleLeave"
  >
    <svg
      class="w-3.5 h-3.5 text-ide-text-muted/40 hover:text-ide-accent cursor-help transition-all duration-200"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>

    <!-- Premium Tooltip (Teleported) -->
    <Teleport to="body">
      <div
        class="fixed p-3 bg-ide-sidebar/95 backdrop-blur-xl border border-ide-border rounded-xl shadow-2xl transition-opacity duration-300 z-[9999] text-[10px] normal-case tracking-normal text-ide-text leading-relaxed pointer-events-none w-72"
        :class="[showTooltip ? 'opacity-100 visible' : 'opacity-0 invisible']"
        :style="{
          top: coords.y + (position.top ? 12 : -12) + 'px',
          left: coords.x + 'px',
          transform:
            (position.top ? '' : 'translateY(-100%)') +
            (position.right
              ? ' translateX(calc(-100% + 32px))'
              : ' translateX(-16px)'),
        }"
      >
        <div class="relative">
          <div
            class="flex items-center gap-2 mb-2 border-b border-ide-border/50 pb-2"
          >
            <div
              class="w-1.5 h-1.5 rounded-full bg-ide-accent shadow-[0_0_8px_rgba(88,166,255,0.5)]"
            ></div>
            <div
              class="font-black text-ide-accent uppercase tracking-widest text-[9px]"
            >
              {{ property }}
            </div>
          </div>
          <div class="text-ide-text/90 line-clamp-6">
            {{ getDesc(property) }}
          </div>

          <!-- Subtle Arrow -->
          <div
            class="absolute w-3 h-3 bg-ide-sidebar/95 backdrop-blur-xl border-ide-border rotate-45"
            :class="[
              position.top
                ? '-top-[21px] border-l border-t'
                : '-bottom-[21px] border-r border-b',
              position.right ? 'right-[20px]' : 'left-[20px]',
            ]"
          ></div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.tracking-tightest {
  letter-spacing: -0.025em;
}

/* Custom animation for smoother entry */
.invisible {
  visibility: hidden;
}
</style>
