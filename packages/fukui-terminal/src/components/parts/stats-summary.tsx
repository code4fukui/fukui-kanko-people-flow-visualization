import React from "react";

type StatsSummaryProps = {
  sum: number;
  avg: number;
};

export const StatsSummary: React.FC<StatsSummaryProps> = ({ sum, avg }) => (
  <div style={{ margin: "1rem 0", fontSize: "1.1rem", color: "#374151" }}>
    <div>合計人数: {Math.round(sum).toLocaleString()} 人</div>
    <div>平均人数: {Math.round(avg).toLocaleString()} 人</div>
  </div>
);
