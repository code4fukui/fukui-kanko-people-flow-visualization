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
  totalCount: { label: "人物検出回数" },
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
  xKey = "aggregateFrom",
  yKey = "totalCount",
  type,
}) => {
  if (type === "month" || type === "week" || type === "day") {
    return (
      <ChartContainer config={chartConfig}>
        <LineChart data={data} margin={{ top: 10, right: 40 }}>
          <Line dataKey={yKey} />
          <CartesianGrid />
          <XAxis
            dataKey={xKey}
            tick={type === "day" ? (props) => renderTick(props, data, xKey) : undefined}
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

  return (
    <div>
      <p>このタイプ（{type}）のグラフは開発中です。</p>
    </div>
  );
};

export { Graph };
