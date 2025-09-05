import { useCallback, useEffect, useId, useRef, useState } from "react";
import { HOVER_CLEAR_DELAY_MS } from "@fukui-kanko/shared/utils";

/**
 * グラフの凡例クリックによる系列の表示/非表示切り替えとホバー時の他系列減光効果を提供するカスタムフック
 */
export const useLegendControl = () => {
  const instanceId = useId();
  const legendScrollTopRef = useRef(0);

  // 凡例で非表示制御
  const [hiddenKeys, setHiddenKeys] = useState<Set<string>>(new Set());
  const toggleKey = useCallback((key: string) => {
    setHiddenKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  // 凡例ホバーで他系列を減光
  const [hoveredLegendKey, setHoveredLegendKey] = useState<string | undefined>(undefined);
  const hoverClearTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const setHoveredLegendKeyStable = useCallback((key?: string) => {
    if (hoverClearTimerRef.current !== undefined) {
      clearTimeout(hoverClearTimerRef.current);
      hoverClearTimerRef.current = undefined;
    }
    if (key === undefined) {
      hoverClearTimerRef.current = setTimeout(() => {
        setHoveredLegendKey(undefined);
        hoverClearTimerRef.current = undefined;
      }, HOVER_CLEAR_DELAY_MS);
    } else {
      setHoveredLegendKey(key);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (hoverClearTimerRef.current !== undefined) {
        clearTimeout(hoverClearTimerRef.current);
        hoverClearTimerRef.current = undefined;
      }
    };
  }, []);

  return {
    instanceId,
    legendScrollTopRef,
    hiddenKeys,
    toggleKey,
    hoveredLegendKey,
    setHoveredLegendKeyStable,
  };
};
