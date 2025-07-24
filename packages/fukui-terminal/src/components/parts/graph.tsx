import React from "react";
import { AggregatedData } from "@fukui-kanko/shared";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@fukui-kanko/shared/components/ui";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

const chartConfig = {
  totalCount: { label: "人物検出回数" },
};

const CustomizedXAxisTick = ({
  x,
  y,
  payload,
}: {
  x: number;
  y: number;
  payload: { value: string };
}) => {
  const value = payload.value;
  const date = new Date(value);
  const days = ["日", "月", "火", "水", "木", "金", "土"];
  const dayOfWeek = !isNaN(date.getTime()) ? days[date.getDay()] : "";
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={0} textAnchor="middle" fill="#666" fontSize={12}>
        <tspan x={0} dy={5}>
          {value}
        </tspan>
        {dayOfWeek && (
          <tspan
            x={0}
            dy={16}
            fill={dayOfWeek === "土" ? "blue" : dayOfWeek === "日" ? "red" : undefined}
            fontSize={10}
          >
            {dayOfWeek}
          </tspan>
        )}
      </text>
    </g>
  );
};

type GraphProps = {
  data: AggregatedData[];
  xKey?: string;
  yKey?: string;
  type: "month" | "week" | "day" | "hour";
  width?: number;
  height?: number;
};

const Graph: React.FC<GraphProps> = ({
  data,
  xKey = "aggregateFrom",
  yKey = "totalCount",
  type,
}) => {
  if (type === "month" || type === "week" || type === "day") {
    return (
      <ChartContainer config={chartConfig}>
        <LineChart data={data}>
          <Line dataKey={yKey} />
          <CartesianGrid />
          <XAxis dataKey={xKey} tick={theme === "day" ? CustomizedXAxisTick : undefined} />
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

  return (
    <div>
      <p>このタイプ（{type}）のグラフは開発中です。</p>
    </div>
  );
};

export { Graph };
