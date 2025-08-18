import React, { useLayoutEffect, useRef } from "react";
import { cn } from "@fukui-kanko/shared/utils";
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
};

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
  }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const hoveredKey = controlledHoveredKey;

    const setHover = (key?: string) => {
      onHoverKeyChange?.(key);
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
        className="flex flex-wrap items-center justify-center gap-4 max-h-[4.5rem] overflow-y-auto"
        onScroll={handleScroll}
      >
        {payload.map((entry) => {
          const key = `${entry.dataKey}_${instanceSuffix}`;
          const name = String(entry.value ?? key);
          const color = entry.color ?? "#999";
          const isHidden = hidden.has(key);
          const hoveredIsHidden = hoveredKey ? hidden.has(hoveredKey) : false;
          const isDimmedByHover =
            hoveredKey !== undefined && hoveredKey !== key && !hoveredIsHidden;

          return (
            <div key={key}>
              <button
                onClick={() => {
                  onScrollPersist?.(containerRef.current?.scrollTop ?? 0);
                  onToggle(key);
                }}
                onMouseEnter={() => setHover(key)}
                onMouseLeave={() => setHover(undefined)}
                onFocus={() => setHover(key)}
                onBlur={() => setHover(undefined)}
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
