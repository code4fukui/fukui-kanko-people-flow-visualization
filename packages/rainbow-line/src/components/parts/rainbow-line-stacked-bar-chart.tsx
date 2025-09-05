import { RAINBOW_LINE_LOTS } from "@/constants/parking-lots";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { cn, formatDate, getLegendKey, useLegendControl, WEEK_DAYS } from "@fukui-kanko/shared";
import { ClickableLegend, renderTick, XAxisTickProps } from "@fukui-kanko/shared/components/parts";
import {
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from "@fukui-kanko/shared/components/ui";
import {
  AGGREGATE_FROM_KEY,
  AggregatedData,
  ATTRIBUTES,
  GRAPH_VIEW_TYPES,
  ObjectClassAttribute,
  PLACEMENTS,
} from "@fukui-kanko/shared/types";
import * as holidayJP from "@holiday-jp/holiday_jp";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

/**
 * 指定した期間内のデータを日単位で集計（曜日・祝日名付き）
 */
function aggregateDaily(
  data: AggregatedData[],
  focusedAttribute: ObjectClassAttribute | "placement",
  type: keyof typeof GRAPH_VIEW_TYPES,
): AggregatedData[] {
  // 祝日の取得範囲
  const aggregateFromValues = data.map((row) => new Date(row[AGGREGATE_FROM_KEY]));
  const start = new Date(Math.min(...aggregateFromValues.map((d) => d.getTime())));
  const end = new Date(Math.max(...aggregateFromValues.map((d) => d.getTime())));

  // 祝日を事前に取得しMap化
  const holidays = holidayJP.between(start, end);
  const holidayMap = new Map<string, string>();
  holidays.forEach((h) => {
    holidayMap.set(formatDate(h.date, "-"), h.name);
  });

  return data.map((row) => {
    const date = new Date(row[AGGREGATE_FROM_KEY]);
    const totalCount = Number(row["total count"]) || 0;
    const dayKey =
      type === "month" ? formatDate(date).replace(/-\d{2}$/, "") : formatDate(date, "-");
    const dayOfWeek = WEEK_DAYS[date.getDay()];
    const holidayName = holidayMap.get(dayKey) ?? "";

    const data: AggregatedData = {
      ...row,
      aggregateFrom: dayKey,
      aggregateTo: dayKey,
      dayOfWeek,
      holidayName,
      "total count": totalCount,
      ...Object.values(RAINBOW_LINE_LOTS).reduce(
        (result, value) => {
          result[value] = Number(row[`${value}`]);
          return result;
        },
        {} as Record<string, number>,
      ),
    };

    const list =
      focusedAttribute === "placement" ? RAINBOW_LINE_LOTS : ATTRIBUTES[focusedAttribute];
    Object.keys(list).forEach((listitem) => {
      data[list[listitem as keyof typeof list]] = Object.keys(row)
        .filter((key) =>
          focusedAttribute === "placement"
            ? key.startsWith(listitem) || key.endsWith(listitem)
            : focusedAttribute === "prefectures"
              ? key.startsWith(listitem)
              : key.endsWith(listitem),
        )
        .map((key) => Number(row[key]))
        .reduce((sum, current) => (sum += Number(current)), 0);
    });
    return data;
  });
}

// chartConfigの定義
const chartConfig = {
  totalCount: { label: "検出回数" },
  ...Object.entries(RAINBOW_LINE_LOTS).reduce(
    (result, [key, value]) => {
      result[value] = { label: PLACEMENTS[key as keyof typeof PLACEMENTS].text };
      return result;
    },
    {} as Record<string, Record<string, string>>,
  ),
};

type RainbowLineStackedBarChartProps = {
  data: AggregatedData[];
  focusedAttribute: ObjectClassAttribute | "placement";
  type: keyof typeof GRAPH_VIEW_TYPES;
  className?: string;
  colorMap?: Record<string, string>;
};

/**
 * 積み上げ棒グラフ
 */
export const RainbowLineStackedBarChart: React.FC<RainbowLineStackedBarChartProps> = ({
  data,
  focusedAttribute,
  type,
  className,
  colorMap = {},
}) => {
  const [chartData, setChartData] = useState<AggregatedData[]>([]);
  const {
    instanceId,
    legendScrollTopRef,
    hiddenKeys,
    toggleKey,
    hoveredLegendKey,
    setHoveredLegendKeyStable,
  } = useLegendControl();

  useEffect(() => {
    const dailyData = aggregateDaily(data, focusedAttribute, type);
    setChartData(dailyData);
  }, [data, focusedAttribute, type]);

  const tickRenderer = useCallback(
    (props: XAxisTickProps) => renderTick(props, chartData, "aggregateFrom"),
    [chartData],
  );

  // 15日より多いデータ数の場合、日曜基準の目盛りを表示
  const sundayTicks = useMemo(() => {
    if (type !== "day") return undefined;
    const uniqueDays = new Set(data.map((row) => String(row["aggregateFrom"]))).size;
    if (uniqueDays <= 15) return undefined;
    const ticks = data
      .filter((row) => row.dayOfWeek !== undefined && row.dayOfWeek === "日")
      .map((row) => String(row["aggregateFrom"]));
    return ticks;
  }, [data, type]);

  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"];

  return (
    <ChartContainer config={chartConfig} className={cn("h-full w-full", className)}>
      <BarChart data={chartData} margin={{ top: 10, right: 40, left: 20, bottom: 10 }}>
        <CartesianGrid vertical={false} />
        {(focusedAttribute === "placement"
          ? Object.values(RAINBOW_LINE_LOTS)
          : Object.values(ATTRIBUTES[focusedAttribute])
        ).map((key, idx) => {
          const legendKey = getLegendKey(key, instanceId);
          const isHidden = hiddenKeys.has(legendKey);
          const shouldDimOthers =
            hoveredLegendKey !== undefined && !hiddenKeys.has(hoveredLegendKey);
          const isDimmed = shouldDimOthers && hoveredLegendKey !== legendKey;
          return (
            <Bar
              isAnimationActive={false}
              key={key}
              dataKey={key}
              stackId="a"
              fill={colorMap[key] ?? colors[idx % colors.length]}
              stroke={colorMap[key] ?? colors[idx % colors.length]}
              strokeWidth={hoveredLegendKey === legendKey ? 1.5 : 0}
              hide={isHidden}
              fillOpacity={isDimmed ? 0.1 : 1}
            />
          );
        })}
        <XAxis
          dataKey="aggregateFrom"
          tick={type === "day" ? tickRenderer : undefined}
          tickMargin={8}
          ticks={sundayTicks}
        />
        <YAxis />
        <ChartTooltip
          cursor={{ fillOpacity: 0.4, stroke: "hsl(var(--primary))" }}
          content={<ChartTooltipContent className="bg-white" />}
        />
        <ChartLegend
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
              config={chartConfig}
              className="max-h-12 mt-4 pt-3"
            />
          )}
        />
      </BarChart>
    </ChartContainer>
  );
};

export default RainbowLineStackedBarChart;
