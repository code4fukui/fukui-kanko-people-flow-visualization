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

const chartConfig = {
  "total count": { label: "人物検出回数" },
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
  theme: "month" | "week" | "day" | "hour";
};

const Graph: React.FC<GraphProps> = ({
  data,
  xKey = "aggregate from",
  yKey = "total count",
  theme,
}) => {
  if (theme === "month" || theme === "week" || theme === "day") {
    return (
      <ChartContainer config={chartConfig}>
        <LineChart width={500} height={300} data={data} margin={{ top: 10, right: 40 }}>
          <Line dataKey={yKey} />
          <CartesianGrid />
          <XAxis
            dataKey={xKey}
            tick={theme === "day" ? CustomizedXAxisTick : undefined}
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
