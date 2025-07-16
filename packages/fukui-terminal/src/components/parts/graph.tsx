import React from "react";
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";

type GraphProps = {
  data: Array<{ day: string; サイト訪問者数: number }>;
};

const Graph: React.FC<GraphProps> = ({ data }) => (
  <LineChart width={500} height={300} data={data}>
    <Line type="monotone" dataKey="サイト訪問者数" />
    <CartesianGrid />
    <XAxis dataKey="day" />
    <YAxis />
    <Tooltip />
    <Legend />
  </LineChart>
);

export { Graph };
