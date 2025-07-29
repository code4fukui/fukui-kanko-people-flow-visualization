import { StatsSummary } from "@/components/parts/stats-summary";
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
  "total count": { label: "人物検出回数" },
};

const lineColors = [
  "#E05B53",
  "#E063AA",
  "#E59562",
  "#E5C930",
  "#61C558",
  "#50AC6E",
  "#57CBD4",
  "#456DE1",
  "#3248A9",
  "#7E55E1",
];

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
  xKey = "aggregate from",
  yKey = "total count",
  theme,
}) => {
  if (theme === "hour") {
    // 日付ごとにグループ化し、xKeyを時間のみに変換
    const grouped: { [date: string]: AggregatedData[] } = {};
    data.forEach((row) => {
      const value = String(row[xKey]);
      const [date, hour] = value.split(" ");
      if (!grouped[date]) grouped[date] = [];
      // 新しいオブジェクトでxKeyを時間のみに
      grouped[date].push({
        ...row,
        [xKey]: hour, // "HH:00" のみ
        [`${date}_${yKey}`]: row[yKey],
      });
    });

    return (
      <div>
        <ChartContainer config={chartConfig}>
          <LineChart margin={{ top: 10, right: 40 }}>
            {Object.entries(grouped).map(([date, rows], idx) => (
              <Line
                key={date}
                data={rows}
                dataKey={`${date}_${yKey}`}
                name={date}
                stroke={lineColors[idx % lineColors.length]}
              />
            ))}
            <CartesianGrid />
            <XAxis dataKey={xKey} tickMargin={8} allowDuplicatedCategory={false} />
            <YAxis />
            <ChartTooltip
              cursor={{ fillOpacity: 0.4, stroke: "hsl(var(--primary))" }}
              content={<ChartTooltipContent className="bg-white" />}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </LineChart>
        </ChartContainer>
        <StatsSummary theme={theme} data={data} />
      </div>
    );
  }

  if (theme === "month" || theme === "week" || theme === "day") {
    return (
      <div>
        <ChartContainer config={chartConfig}>
          <LineChart data={data} margin={{ top: 10, right: 40 }}>
            <Line dataKey={yKey} />
            <CartesianGrid />
            <XAxis
              dataKey={xKey}
              tick={theme === "day" ? (props) => renderTick(props, data, xKey) : undefined}
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
        <StatsSummary theme={theme} data={data} />
      </div>
    );
  }
};

export { Graph };
