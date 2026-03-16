import type { DevContainerConfig } from "../types";

export interface UseConfigUpdateOptions<T> {
  modelValue: T;
  emit: (event: "update:modelValue", value: T) => void;
}

export function useConfigUpdate<
  T extends { config: DevContainerConfig; orchestration: any },
>(options: UseConfigUpdateOptions<T>) {
  const { modelValue, emit } = options;

  function updateConfig(path: string, value: any) {
    const newConfig = { ...modelValue.config };

    if (path.startsWith("build.")) {
      const key = path.split(".")[1];
      newConfig.build = {
        ...(newConfig.build || { dockerfile: "Dockerfile", context: "." }),
        [key]: value,
      };
    } else if (path.startsWith("hostRequirements.")) {
      const key = path.split(".")[1];
      newConfig.hostRequirements = {
        ...(newConfig.hostRequirements || {}),
        [key]: value,
      };
    } else if (path.startsWith("otherPortsAttributes.")) {
      const key = path.split(".")[1];
      newConfig.otherPortsAttributes = {
        ...(newConfig.otherPortsAttributes || {}),
        [key]: value,
      };
    } else if (path.startsWith("customizations.")) {
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

    emit("update:modelValue", { ...modelValue, config: newConfig });
  }

  function updateOrchestration(val: any) {
    emit("update:modelValue", { ...modelValue, orchestration: val });
  }

  function removeItem(path: string, index: number) {
    let list: any[] = [];
    const currentVal = (modelValue.config as any)[path];

    if (path === "appPort") {
      list = Array.isArray(currentVal)
        ? [...currentVal]
        : currentVal
          ? [currentVal]
          : [];
    } else {
      list = [...(currentVal || [])];
    }

    list.splice(index, 1);
    updateConfig(path, list);
  }

  return {
    updateConfig,
    updateOrchestration,
    removeItem,
  };
}
