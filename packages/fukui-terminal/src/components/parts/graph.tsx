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
          <XAxis dataKey={xKey} />
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
