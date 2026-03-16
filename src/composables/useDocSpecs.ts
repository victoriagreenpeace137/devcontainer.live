import { ref, onMounted } from "vue";

const MAIN_SPEC_URL =
  "https://raw.githubusercontent.com/devcontainers/spec/refs/heads/main/docs/specs/devcontainerjson-reference.md";
const VSCODE_SPEC_URL =
  "https://raw.githubusercontent.com/devcontainers/spec/refs/heads/main/docs/specs/supporting-tools.md";
const GPU_SPEC_URL =
  "https://raw.githubusercontent.com/devcontainers/spec/main/docs/specs/gpu-host-requirement.md";

const specs = ref<Record<string, string>>({});
const isLoading = ref(false);
const hasLoaded = ref(false);

function parseMarkdownTable(text: string): Record<string, string> {
  const propertyMap: Record<string, string> = {};
  // Match markdown table rows: | `property` | type | description |
  // Using a more robust regex that handles escaped pipes in the middle columns
  const rowRegex =
    /^\|\s*`([^`]+)`[^|]*\|\s*(?:\\\||[^|])+\s*\|\s*(.*?)\s*\|/gm;
  let match;

  while ((match = rowRegex.exec(text)) !== null) {
    const prop = match[1].trim();
    let desc = match[2].trim();

    // Clean up description: remove bold, links, and nested code blocks
    desc = desc
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\[(.*?)\]\(.*?\)/g, "$1")
      .replace(/`(.*?)`/g, "$1")
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/&nbsp;/g, " ");

    propertyMap[prop] = desc;
  }
  return propertyMap;
}

export function useDocSpecs() {
  const fetchSpecs = async () => {
    if (hasLoaded.value || isLoading.value) return;

    isLoading.value = true;
    try {
      const [mainRes, vscodeRes, gpuRes] = await Promise.all([
        fetch(MAIN_SPEC_URL),
        fetch(VSCODE_SPEC_URL),
        fetch(GPU_SPEC_URL),
      ]);

      const [mainText, vscodeText, gpuText] = await Promise.all([
        mainRes.ok ? mainRes.text() : "",
        vscodeRes.ok ? vscodeRes.text() : "",
        gpuRes.ok ? gpuRes.text() : "",
      ]);

      const mainMap = parseMarkdownTable(mainText);
      const vscodeMap = parseMarkdownTable(vscodeText);
      const gpuMap = parseMarkdownTable(gpuText);

      specs.value = { ...vscodeMap, ...mainMap, ...gpuMap };
      hasLoaded.value = true;
    } catch (err) {
      console.error("Error fetching/parsing devcontainer specs:", err);
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(fetchSpecs);

  const getDesc = (property: string) => {
    return specs.value[property] || "";
  };

  return {
    specs,
    isLoading,
    getDesc,
    hasLoaded,
  };
}
