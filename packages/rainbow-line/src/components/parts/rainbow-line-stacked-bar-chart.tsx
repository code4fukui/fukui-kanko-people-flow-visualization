import React, { useCallback, useEffect, useMemo, useState } from "react";
import { formatDate, WEEK_DAYS } from "@fukui-kanko/shared";
import { renderTick, XAxisTickProps } from "@fukui-kanko/shared/components/parts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@fukui-kanko/shared/components/ui";
import {
  AGGREGATE_FROM_KEY,
  AggregatedData,
  ATTRIBUTES,
  GRAPH_VIEW_TYPES,
  ObjectClassAttribute,
} from "@fukui-kanko/shared/types";
import * as holidayJP from "@holiday-jp/holiday_jp";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

/**
 * 指定した期間内のデータを日単位で集計（曜日・祝日名付き）
 */
function aggregateDaily(
  data: AggregatedData[],
  focusedAttribute: ObjectClassAttribute,
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
    const dayKey = formatDate(date, "-");
    const dayOfWeek = WEEK_DAYS[date.getDay()];
    const holidayName = holidayMap.get(dayKey) ?? "";

    const data: AggregatedData = {
      ...row,
      aggregateFrom: dayKey,
      aggregateTo: dayKey,
      dayOfWeek,
      holidayName,
    };

    const list = ATTRIBUTES[focusedAttribute];
    Object.keys(list).forEach((listitem) => {
      data[list[listitem as keyof typeof list]] = Object.keys(row)
        // TODO: 厳密でないフィルタなので、もっと壊れづらいものを考える
        .filter((key) => key.startsWith(listitem) || key.endsWith(listitem))
        .map((key) => Number(row[key]))
        .reduce((sum, current) => (sum += current), 0);
    });
    return data;
  });
}

// chartConfigの定義
const chartConfig = {
  totalCount: { label: "検出回数" },
};

type RainbowLineStackedBarChartProps = {
  data: AggregatedData[];
  focusedAttribute: ObjectClassAttribute;
  type: keyof typeof GRAPH_VIEW_TYPES;
};

/**
 * 積み上げ棒グラフ
 */
export const RainbowLineStackedBarChart: React.FC<RainbowLineStackedBarChartProps> = ({
  data,
  focusedAttribute,
  type,
}) => {
  const [chartData, setChartData] = useState<AggregatedData[]>([]);

  useEffect(() => {
    const chartData = aggregateDaily(data, focusedAttribute);
    setChartData(chartData);
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
    <ChartContainer config={chartConfig} className="h-80 w-full">
      <BarChart data={chartData} margin={{ top: 10, right: 40, left: 20, bottom: 10 }}>
        {Object.values(ATTRIBUTES[focusedAttribute]).map((key, idx) => {
          return (
            <Bar
              key={key}
              dataKey={key}
              stackId="a"
              fill={colors[idx % colors.length]}
              stroke={colors[idx % colors.length]}
              strokeWidth={0}
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
      </BarChart>
    </ChartContainer>
  );
};

export default RainbowLineStackedBarChart;
