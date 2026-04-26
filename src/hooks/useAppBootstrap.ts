import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";

export function useAppBootstrap() {
  const initialized = useAppStore((state) => state.initialized);
  const loadingText = useAppStore((state) => state.loadingText);
  const init = useAppStore((state) => state.init);

  useEffect(() => {
    if (!initialized) {
      void init();
    }
  }, [init, initialized]);

  return { initialized, loadingText };
}
