import { useEffect } from "react";

/**
 * マウント時に一度だけ実行されるuseEffectの糖衣構文
 */
export function useInitialization(effect: Parameters<typeof useEffect>[0]) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => effect(), []);
}
