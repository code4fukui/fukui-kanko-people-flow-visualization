import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { AggregatedData } from "@fukui-kanko/shared";
import { ClickableLegend } from "@fukui-kanko/shared/components/parts";
import {
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from "@fukui-kanko/shared/components/ui";
import { GRAPH_VIEW_TYPES } from "@fukui-kanko/shared/types";
import { getLegendKey, HOVER_CLEAR_DELAY_MS, WEEK_DAYS } from "@fukui-kanko/shared/utils";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

type GraphProps = {
  data: AggregatedData[];
  xKey?: string;
  yKey?: string;
  type: keyof typeof GRAPH_VIEW_TYPES;
};

export type XAxisTickProps = {
  x: number;
  y: number;
  payload: { value: string };
  index?: number;
};

const chartConfig = {
  totalCount: { label: "人物検出回数" },
};

export function renderTick(props: XAxisTickProps, data: AggregatedData[], xKey: string) {
  const d = data.find((row) => row[xKey] === props.payload.value);
  return (
    <CustomizedXAxisTick
      {...props}
      dayOfWeek={d?.dayOfWeek !== undefined ? String(d.dayOfWeek) : undefined}
      holidayName={d?.holidayName !== undefined ? String(d.holidayName) : undefined}
    />
  );
}

export const CustomizedXAxisTick = ({
  x,
  y,
  payload,
  dayOfWeek,
  holidayName,
}: {
  x: number;
  y: number;
  payload: { value: string };
  dayOfWeek?: string;
  holidayName?: string;
}) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={0} textAnchor="middle" fill="#666" fontSize={12}>
        <tspan x={0} dy={5}>
          {payload.value}
        </tspan>
        {holidayName ? (
          <tspan x={0} dy={16} fill="red" fontSize={10}>
            {holidayName}
          </tspan>
        ) : (
          dayOfWeek && (
            <tspan
              x={0}
              dy={16}
              fill={dayOfWeek === "土" ? "blue" : dayOfWeek === "日" ? "red" : undefined}
              fontSize={10}
            >
              {dayOfWeek}
            </tspan>
          )
        )}
      </text>
    </g>
  );
};

const weekdayColors: Record<(typeof WEEK_DAYS)[number], string> = {
  日: "#F44336",
  月: "#000000",
  火: "#FF9800",
  水: "#00BCD4",
  木: "#4CAF50",
  金: "#FFEB3B",
  土: "#2196F3",
};

const Graph: React.FC<GraphProps> = ({
  data,
  xKey = "aggregateFrom",
  yKey = "totalCount",
  type,
<<<<<<< HEAD
=======
  _className,
>>>>>>> e58bafc (👍️レインボーラインのページに積み上げ棒グラフを実装)
}) => {
  const instanceId = useId();
  const tickRenderer = useCallback(
    (props: XAxisTickProps) => renderTick(props, data, xKey),
    [data, xKey],
  );

  const legendScrollTopRef = useRef(0);

  const [hiddenKeys, setHiddenKeys] = useState<Set<string>>(new Set());
  const toggleKey = useCallback((key: string) => {
    setHiddenKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

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

  // 15日より多いデータ数の場合、日曜基準の目盛りを表示
  const sundayTicks = useMemo(() => {
    if (type !== "day") return undefined;
    const uniqueDays = new Set(data.map((row) => String(row[xKey]))).size;
    if (uniqueDays <= 15) return undefined;
    const ticks = data
      .filter((row) => row.dayOfWeek !== undefined && row.dayOfWeek === "日")
      .map((row) => String(row[xKey]));
    return ticks;
  }, [data, type, xKey]);

  if (type === "hour") {
    // 日付ごとにグループ化し、xKeyを時間のみに変換
    const grouped: { [date: string]: AggregatedData[] } = {};
    data.forEach((row) => {
      const value = String(row[xKey]);
      const [date, hour] = value.split(" ");
      if (!grouped[date]) grouped[date] = [];
      // 新しいオブジェクトでxKeyを時間のみに
      grouped[date].push({
        ...row,
        [xKey]: hour, // "HH:00" のみ
        [`${date}_${yKey}`]: row[yKey],
        type,
      });
    });

    return (
      <ChartContainer config={chartConfig} className="h-full w-full">
        <LineChart margin={{ top: 10, right: 40 }}>
          {Object.entries(grouped).map(([date, rows]) => {
            const isHoliday = !!rows[0]?.holidayName;
            const d = rows[0]?.dayOfWeek as (typeof WEEK_DAYS)[number] | undefined;
            const strokeColor = isHoliday ? "#F44336" : d ? weekdayColors[d] : "#888";
            const legendKey = getLegendKey(`${date}_${yKey}`, instanceId);
            const isHidden = hiddenKeys.has(legendKey);

            // ホバーに応じて他ラインを減光、対象を強調
            const shouldDimOthers =
              hoveredLegendKey !== undefined && !hiddenKeys.has(hoveredLegendKey);
            const isDimmed = shouldDimOthers && hoveredLegendKey !== legendKey;
            return (
              <Line
                key={date}
                data={rows}
                dataKey={`${date}_${yKey}`}
                name={`${date}(${rows[0]?.dayOfWeek}${isHoliday ? "・祝" : ""})`}
                stroke={strokeColor}
                strokeWidth={hoveredLegendKey === legendKey ? 3 : 2}
                strokeOpacity={isDimmed ? 0.1 : 1}
                hide={isHidden}
              />
            );
          })}
          <CartesianGrid />
          <XAxis dataKey={xKey} tickMargin={8} allowDuplicatedCategory={false} />
          <YAxis />
          <ChartTooltip
            cursor={{ fillOpacity: 0.4, stroke: "hsl(var(--primary))" }}
            content={<ChartTooltipContent className="bg-white" />}
          />
          <ChartLegend
            wrapperStyle={{ width: "100%" }}
            content={(props) => (
              <ClickableLegend
                payload={props.payload}
                hidden={hiddenKeys}
                onToggle={toggleKey}
                instanceSuffix={instanceId}
                savedScrollTop={legendScrollTopRef.current}
                onScrollPersist={(top) => {
                  legendScrollTopRef.current = top;
                }}
                hoveredKey={hoveredLegendKey}
                onHoverKeyChange={setHoveredLegendKeyStable}
              />
            )}
          />
        </LineChart>
      </ChartContainer>
    );
  }
  if (type === "month" || type === "week" || type === "day") {
    return (
      <ChartContainer config={chartConfig} className="h-full w-full">
        <LineChart data={data} margin={{ top: 10, bottom: 10, right: 40 }}>
          <Line dataKey={yKey} strokeWidth={3} stroke="#2563eb" />
          <CartesianGrid />
          <XAxis
            dataKey={xKey}
            tick={type === "day" ? tickRenderer : undefined}
            tickMargin={8}
            ticks={sundayTicks}
          />
          <YAxis />
          <ChartTooltip
            cursor={{ fillOpacity: 0.4, stroke: "hsl(var(--primary))" }}
            content={<ChartTooltipContent className="bg-white" />}
          />
        </LineChart>
      </ChartContainer>
    );
  }

  return (
    <div>
      <p>このタイプ（{type}）のグラフは開発中です。</p>
    </div>
  );
};

export { Graph };
