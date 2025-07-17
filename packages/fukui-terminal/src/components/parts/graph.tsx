import { AggregatedData } from "@/interfaces/aggregated-data.interface";
import React from "react";
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";

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
  if (theme === "month") {
    return (
      <LineChart width={500} height={300} data={data}>
        <Line type="monotone" dataKey={yKey} />
        <CartesianGrid />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        <Legend />
      </LineChart>
    );
  }
};

export { Graph };
