import { useEffect, useState } from "react";

export const DEFAULT_KEY = "default";

export function useLocalDefaultStar() {
  const [defaultStarKey, setDefaultStarKey] = useState<string>(
    localStorage.getItem(DEFAULT_KEY) ?? "",
  );

  useEffect(() => {
    const res = localStorage.getItem(DEFAULT_KEY) ?? "";
    setDefaultStarKey(res);
  }, []);

  const setDefaultStar = (title: string) => {
    const defaultStar = title;
    window.localStorage.setItem(DEFAULT_KEY, String(defaultStar));
    setDefaultStarKey(defaultStar);
  };

  const removeDefaultStar = () => {
    window.localStorage.removeItem(DEFAULT_KEY);
    setDefaultStarKey("");
  };

  return { defaultStarKey, setDefaultStar, removeDefaultStar };
}
