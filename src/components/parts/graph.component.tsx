import {
  JAPANESE_ATTRIBUTE_NAME,
  ObjectClassAttribute,
} from "@/interfaces/aggregated-data.interface";
import { ChartGroup, getChartConfig } from "@/interfaces/graph-data.interface";
import { defaultSeriesName, GraphSeries } from "@/interfaces/graph-series.interface";
import { CARTESIAN_RENDER_THRESHOLD, cn } from "@/lib/utils";
import { ReactNode } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";

function MultiChartContainer(props: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        `grid overflow-x-hidden overflow-y-auto grid-cols-[repeat(auto-fit,_minmax(50%,_1fr))] grid-rows-1 w-full h-full`,
      )}
    >
      {props.children}
    </div>
  );
}

const RADIAN = Math.PI / 180;
const CustomizedLabel = (props: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
  name: string;
}) => {
  const radius = props.innerRadius + (props.outerRadius - props.innerRadius) * 0.7;
  const x = props.cx + radius * Math.cos(-props.midAngle * RADIAN);
  const y = props.cy + radius * Math.sin(-props.midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      className="font-bold drop-shadow"
    >
      {props.percent > 0.05 ? `${(props.percent * 100).toFixed(1)}%` : undefined}
    </text>
  );
};

type XAxisTickProps = {
  x: number;
  y: number;
  payload: {
    value: string;
  };
  data: Record<string, string | number>[];
};

const CustomizedXAxisTick = ({ x, y, payload, data }: XAxisTickProps) => {
  const dateRow = data.find((row) => row.date === payload.value);
  const dayOfWeek = dateRow?.dayOfWeek;
  const holidayName = dateRow?.holidayName;
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={0} textAnchor="middle" fill="#666" fontSize={12}>
        <tspan x={0} dy={5}>
          {payload.value}
        </tspan>
        {holidayName && holidayName !== "" ? (
          <tspan x={0} dy={16} fill="red" fontSize={10}>
            {holidayName}
          </tspan>
        ) : (
          dayOfWeek &&
          dayOfWeek !== "" && (
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

interface Props {
  chartGroup: ChartGroup;
  seriesAll: Record<string, GraphSeries>;
  className?: string;
}
export function Graph({ chartGroup, seriesAll, className }: Props) {
  const isCartesianRatioOnly = !Object.values(seriesAll).some(
    (item) => item.graphType === "stack" || item.graphType === "simple",
  );
  return (
    <MultiChartContainer className={className}>
      {Object.keys(chartGroup)
        .filter(
          (chartId) =>
            chartId !== "cartesian" ||
            Object.keys(chartGroup[chartId].at(-1) ?? {}).length > CARTESIAN_RENDER_THRESHOLD,
        )
        .map((chartId) => (
          <div key={chartId} className="h-full w-full first:col-span-2 flex flex-col items-center">
            {seriesAll && chartId !== "cartesian" ? (
              <p className="-mb-4 pt-4">
                {(() => {
                  const series = seriesAll[chartId];
                  if (!series) return undefined;
                  return series.name === undefined || series.name === ""
                    ? defaultSeriesName(series)
                    : series.name;
                })()}
              </p>
            ) : undefined}
            <ChartContainer
              config={getChartConfig(seriesAll, chartGroup[chartId], chartId)}
              className="h-full w-full"
            >
              {chartId === "cartesian" ? (
                <BarChart
                  data={chartGroup[chartId]}
                  stackOffset={isCartesianRatioOnly ? "expand" : "none"}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey={"date"}
                    tickLine={false}
                    tickMargin={7}
                    axisLine={false}
                    tick={(props: XAxisTickProps) => (
                      <CustomizedXAxisTick {...props} data={chartGroup[chartId]} />
                    )}
                  />
                  <YAxis
                    type="number"
                    tickLine={true}
                    tickCount={isCartesianRatioOnly ? 6 : 10}
                    domain={
                      isCartesianRatioOnly
                        ? [0, 1] // 比率グラフの場合は0〜1の範囲
                        : [0, "auto"] // それ以外の場合はdefault
                    }
                    tickFormatter={
                      isCartesianRatioOnly
                        ? (value: number) => `${Math.floor(value * 100)}%`
                        : undefined
                    }
                    allowDecimals={isCartesianRatioOnly ? true : false}
                  />
                  {Object.keys(chartGroup[chartId].at(-1) ?? {})
                    .filter(
                      (key) =>
                        key !== "date" &&
                        key !== "holidayName" &&
                        key !== "dayOfWeek" &&
                        !key.includes("categoryTotal"),
                    )
                    .map((key) => [key, ...key.split("#")])
                    .map(([key, id, attributeKey], i) => (
                      <Bar
                        type="linear"
                        key={key}
                        dataKey={key}
                        stackId={id}
                        name={
                          seriesAll
                            ? (() => {
                                const series = seriesAll[id];
                                if (!series) return undefined;
                                return series.name === undefined || series.name === ""
                                  ? defaultSeriesName(series)
                                  : series.name;
                              })() + attributeKey
                              ? JAPANESE_ATTRIBUTE_NAME[attributeKey as ObjectClassAttribute]
                              : ""
                            : key
                        }
                        fill={`hsl(var(--chart-${(i % 5) + 1}))`}
                        radius={id.split("#")[1] === "" ? 2 : 0}
                      />
                    ))}
                  <ChartTooltip
                    cursor={{ fillOpacity: 0.4, stroke: "hsl(var(--primary))" }}
                    content={
                      <ChartTooltipContent className="bg-white" isRatio={isCartesianRatioOnly} />
                    }
                    wrapperStyle={{ zIndex: "var(--tooltip-z-index)" }}
                  />
                  {Object.keys(chartGroup[chartId][0]).length <= 10 ? (
                    <ChartLegend content={<ChartLegendContent />} />
                  ) : undefined}
                </BarChart>
              ) : (
                <PieChart>
                  <Pie
                    dataKey="value"
                    isAnimationActive={false}
                    data={chartGroup[chartId]}
                    cx="50%"
                    cy="50%"
                    fill="#8884d8"
                    labelLine={false}
                    label={CustomizedLabel}
                  >
                    {chartGroup[chartId].map((_, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${(index % 5) + 1}))`} />
                    ))}
                  </Pie>
                  <ChartTooltip
                    cursor={{ fillOpacity: 0.4, stroke: "hsl(var(--primary))" }}
                    content={<ChartTooltipContent className="bg-white" />}
                    wrapperStyle={{ zIndex: "var(--tooltip-z-index)" }}
                  />
                  {Object.keys(chartGroup[chartId]).length <= 10 ? (
                    <ChartLegend content={<ChartLegendContent />} />
                  ) : undefined}
                </PieChart>
              )}
            </ChartContainer>
          </div>
        ))}
    </MultiChartContainer>
  );
}
