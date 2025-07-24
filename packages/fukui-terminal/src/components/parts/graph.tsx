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
        <LineChart width={500} height={300} data={data}>
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
};

export { Graph };
