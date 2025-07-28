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
  totalCount: { label: "人物検出回数" },
};

type GraphProps = {
  data: AggregatedData[];
  xKey?: string;
  yKey?: string;
  theme: "month" | "week" | "day" | "hour";
  width?: number;
  height?: number;
};

const Graph: React.FC<GraphProps> = ({
  data,
  xKey = "aggregateFrom",
  yKey = "totalCount",
  theme,
  width = 500,
  height = 300,
}) => {
  if (theme === "month") {
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
    <div
      style={{
        width: width,
        height: height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid #eee",
      }}
    >
      <span>このテーマ（{theme}）のグラフは開発中です。</span>
    </div>
  );
};

export { Graph };
