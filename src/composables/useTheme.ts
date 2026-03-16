import { ref, computed, watch } from "vue";

export interface Theme {
  id: string;
  name: string;
  class: string;
}

export const themes: Theme[] = [
  { id: "midnight", name: "Midnight", class: "" },
  { id: "dracula", name: "Dracula", class: "theme-dracula" },
  { id: "nord", name: "Nord", class: "theme-nord" },
  { id: "solarized", name: "Solarized Light", class: "theme-solarized-light" },
];

const THEME_STORAGE_KEY = "devcontainer_theme";
const savedThemeId = localStorage.getItem(THEME_STORAGE_KEY) || themes[0].id;
const currentThemeId = ref(savedThemeId);
const showThemeMenu = ref(false);

const currentTheme = computed(
  () => themes.find((t) => t.id === currentThemeId.value) || themes[0],
);

export function useTheme() {
  function setTheme(id: string) {
    currentThemeId.value = id;
    showThemeMenu.value = false;
  }

  watch(
    currentTheme,
    (newTheme) => {
      if (!newTheme) return;

      localStorage.setItem(THEME_STORAGE_KEY, newTheme.id);

      // Remove all theme classes
      themes.forEach((t) => {
        if (t.class) document.documentElement.classList.remove(t.class);
      });

      // Add new theme class
      if (newTheme.class)
        document.documentElement.classList.add(newTheme.class);
    },
    { immediate: true },
  );

  return {
    themes,
    currentThemeId,
    currentTheme,
    showThemeMenu,
    setTheme,
  };
}
