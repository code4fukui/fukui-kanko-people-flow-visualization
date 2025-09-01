import React, { useLayoutEffect, useRef } from "react";
import { cn, getLegendKey } from "@fukui-kanko/shared/utils";
import type { LegendProps } from "recharts";

export type ClickableLegendProps = {
  payload?: LegendProps["payload"];
  hidden: Set<string>;
  onToggle: (key: string) => void;
  instanceSuffix: string;
  savedScrollTop?: number;
  onScrollPersist?: (top: number) => void;
  hoveredKey?: string;
  onHoverKeyChange?: (key?: string) => void;
  className?: string;
};

/**
 * ホバー状態を発火するまでの遅延時間（ミリ秒）
 */
const HOVER_DWELL_MS = 50;

export const ClickableLegend: React.FC<ClickableLegendProps> = React.memo(
  ({
    payload = [],
    hidden,
    onToggle,
    instanceSuffix,
    savedScrollTop = 0,
    onScrollPersist,
    hoveredKey: controlledHoveredKey,
    onHoverKeyChange,
    className,
  }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const hoverTimerRef = useRef<number | undefined>(undefined);

    const setHover = (key?: string) => {
      onHoverKeyChange?.(key);
    };

    // ホバータイマーをクリアする
    const clearHoverTimer = () => {
      if (hoverTimerRef.current !== undefined) {
        window.clearTimeout(hoverTimerRef.current);
        hoverTimerRef.current = undefined;
      }
    };

    // ホバー状態を遅延してセットする
    const delayedHover = (key: string) => {
      clearHoverTimer();
      hoverTimerRef.current = window.setTimeout(() => {
        setHover(key);
        hoverTimerRef.current = undefined;
      }, HOVER_DWELL_MS);
    };

    // ホバー状態を解除する
    const cancelHover = () => {
      clearHoverTimer();
      setHover(undefined);
    };

    // 再マウント時にスクロール位置を復元（描画前に反映）
    useLayoutEffect(() => {
      if (containerRef.current) {
        containerRef.current.scrollTop = savedScrollTop;
      }
    }, [savedScrollTop]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
      onScrollPersist?.(e.currentTarget.scrollTop);
    };

    return (
      <div
        ref={containerRef}
        className={cn(
          "flex flex-wrap items-center justify-center gap-4 max-h-[4.5rem] overflow-y-auto",
          className,
        )}
        onScroll={handleScroll}
        onPointerLeave={cancelHover}
        onPointerCancel={cancelHover}
      >
        {payload.map((entry) => {
          const key = getLegendKey(String(entry.dataKey), instanceSuffix);
          const name = String(entry.value ?? key);
          const color = entry.color ?? "#999";
          const isHidden = hidden.has(key);
          const hoveredIsHidden = controlledHoveredKey ? hidden.has(controlledHoveredKey) : false;
          const isDimmedByHover =
            controlledHoveredKey !== undefined && controlledHoveredKey !== key && !hoveredIsHidden;

          return (
            <div key={key}>
              <button
                onClick={() => {
                  onScrollPersist?.(containerRef.current?.scrollTop ?? 0);
                  onToggle(key);
                }}
                onPointerEnter={() => delayedHover(key)}
                onPointerLeave={cancelHover}
                onFocus={() => setHover(key)}
                onBlur={cancelHover}
                className={cn(
                  "flex items-center gap-1.5 cursor-pointer",
                  (isHidden || isDimmedByHover) && "opacity-40",
                )}
              >
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{ backgroundColor: color }}
                />
                {name}
              </button>
            </div>
          );
        })}
      </div>
    );
  },
);
