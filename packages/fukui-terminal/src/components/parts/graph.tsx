import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AggregatedData } from "@/interfaces/aggregated-data.interface";
import React from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

type GraphProps = {
  data: AggregatedData[];
  xKey?: string;
  yKey?: string;
  theme: "month" | "week" | "day" | "hour";
};

type XAxisTickProps = {
  x: number;
  y: number;
  payload: { value: string };
  index?: number;
};

const chartConfig = {
  "total count": { label: "人物検出回数" },
};

const weekdayColors: Record<string, string> = {
  日: "#F44336",
  月: "#000000",
  火: "#FF9800",
  水: "#00BCD4",
  木: "#4CAF50",
  金: "#FFEB3B",
  土: "#2196F3",
};

function renderTick(props: XAxisTickProps, data: AggregatedData[], xKey: string) {
  const d = data.find((row) => row[xKey] === props.payload.value);
  return <CustomizedXAxisTick {...props} dayOfWeek={d?.dayOfWeek} holidayName={d?.holidayName} />;
}

const CustomizedXAxisTick = ({
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

const Graph: React.FC<GraphProps> = ({
  data,
  xKey = "aggregate from",
  yKey = "total count",
  theme,
}) => {
  if (theme === "hour") {
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
        theme,
      });
    });

    return (
      <ChartContainer config={chartConfig}>
        <LineChart margin={{ top: 10, right: 40 }}>
          {Object.entries(grouped).map(([date, rows]) => {
            const isHoliday = rows[0]?.holidayName !== "";
            const strokeColor = isHoliday
              ? "#F44336"
              : (weekdayColors[rows[0]?.dayOfWeek as string] ?? "#888");
            return (
              <Line
                key={date}
                data={rows}
                dataKey={`${date}_${yKey}`}
                name={`${date}(${rows[0]?.dayOfWeek})`}
                stroke={strokeColor}
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
          <ChartLegend content={<ChartLegendContent />} />
        </LineChart>
      </ChartContainer>
    );
  }

  if (theme === "month" || theme === "week" || theme === "day") {
    return (
      <ChartContainer config={chartConfig}>
        <LineChart data={data} margin={{ top: 10, right: 40 }}>
          <Line dataKey={yKey} />
          <CartesianGrid />
          <XAxis
            dataKey={xKey}
            tick={theme === "day" ? (props) => renderTick(props, data, xKey) : undefined}
            tickMargin={8}
          />
          <YAxis />
          <ChartTooltip
            cursor={{ fillOpacity: 0.4, stroke: "hsl(var(--primary))" }}
            content={<ChartTooltipContent className="bg-white" />}
          />
          <ChartLegend content={<ChartLegendContent />} />
        </LineChart>
      </ChartContainer>
    );
  }
};

export { Graph };
