import { ref } from "vue";

export function useEditorActions(
  generatedJson: { value: string },
  reset: () => void,
) {
  const copyStatus = ref<"idle" | "copied">("idle");
  const showIndentMenu = ref(false);

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(generatedJson.value);
      copyStatus.value = "copied";
      setTimeout(() => {
        copyStatus.value = "idle";
      }, 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  }

  function downloadConfig() {
    const blob = new Blob([generatedJson.value], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "devcontainer.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return {
    copyStatus,
    showIndentMenu,
    copyToClipboard,
    downloadConfig,
    reset,
  };
}
