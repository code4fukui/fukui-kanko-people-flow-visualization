import { AggregatedData } from "@/interfaces/aggregated-data.interface";
import React from "react";
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";

type GraphProps = {
  data: AggregatedData[];
  xKey?: string;
  yKey?: string;
};

const Graph: React.FC<GraphProps> = ({ data, xKey = "aggregate from", yKey = "total count" }) => (
  <LineChart width={500} height={300} data={data}>
    <Line type="monotone" dataKey={yKey} />
    <CartesianGrid />
    <XAxis dataKey={xKey} />
    <YAxis />
    <Tooltip />
    <Legend />
  </LineChart>
);

export { Graph };
