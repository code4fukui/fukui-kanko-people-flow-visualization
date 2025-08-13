import { ChartGroup, getChartConfig } from "@/interfaces/graph-data.interface";
import { defaultSeriesName, GraphSeries } from "@/interfaces/graph-series.interface";
import { CARTESIAN_RENDER_THRESHOLD, cn, SCROLL_BOTTOM_THRESHOLD } from "@/lib/utils";
import { Children, ReactNode, useEffect, useRef, useState } from "react";
import { JAPANESE_ATTRIBUTE_NAME, ObjectClassAttribute } from "@fukui-kanko/shared";
import { ChevronDownIcon } from "@primer/octicons-react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";

function MultiChartContainer(props: { children: ReactNode; className?: string }) {
  // 子要素（グラフ）の数を取得
  const childCount = Children.count(props.children);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollIcon, setShowScrollIcon] = useState(false);

  // スクロールイベントを監視
  useEffect(() => {
    const checkOverflow = () => {
      if (!containerRef.current) return;

      const { scrollHeight, clientHeight } = containerRef.current;
      // コンテンツがコンテナより大きい場合にのみアイコンを表示
      const hasOverflow = scrollHeight > clientHeight;
      setShowScrollIcon(hasOverflow);
    };

    const handleScroll = () => {
      if (!containerRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      // スクロール位置が下部に近づいたらアイコンを非表示
      const isBottom = scrollTop + clientHeight >= scrollHeight - SCROLL_BOTTOM_THRESHOLD;
      setShowScrollIcon(!isBottom);
    };

    checkOverflow();

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [childCount]);

  // グラフの数に応じてレイアウトを変更
  let gridLayout = "";
  if (childCount === 1) {
    // 1つの場合は全画面表示
    gridLayout = "grid-cols-1 grid-rows-1";
  } else if (childCount === 2) {
    // 2つの場合は縦に並べる
    gridLayout = "grid-cols-1 grid-rows-2";
  } else if (childCount === 3) {
    // 3つの場合は上に1つ、下に2つ
    gridLayout = "grid-cols-2 grid-rows-2";
  } else {
    // 4つ以上の場合は2×2のグリッドで固定高さ
    gridLayout = "grid-cols-2 grid-rows-[repeat(auto-fill,_minmax(356px,_1fr))] overflow-y-auto";
  }
  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className={cn(`grid w-full h-full ${gridLayout}`, props.className)}>
        {props.children}
        {showScrollIcon && (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 animate-bounce pointer-events-none">
            <ChevronDownIcon size={30} className="text-primary" />
          </div>
        )}
      </div>
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
  const chartIds = Object.keys(chartGroup).filter(
    (chartId) =>
      (chartId !== "cartesian" && chartId !== "ratio") ||
      Object.keys(chartGroup[chartId].at(-1) ?? {}).length > CARTESIAN_RENDER_THRESHOLD,
  );

  // グラフの種類を判定
  const hasCartesian = chartIds.includes("cartesian");
  const hasRatio = chartIds.includes("ratio");

  return (
    <MultiChartContainer className={className}>
      {chartIds.map((chartId) => {
        // 3つ以上円グラフのみの場合、3種類のグラフがある場合、均等配置
        const spanClass =
          (!hasCartesian && !hasRatio) || (hasCartesian && hasRatio) ? "" : "first:col-span-2";

        return (
          <div
            key={chartId}
            className={`h-full w-full flex ${spanClass} flex-col items-center border border-muted rounded-md shadow-sm`}
          >
            {seriesAll && chartId !== "cartesian" && chartId !== "ratio" ? (
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
              className="h-full w-full min-h-0"
            >
              {chartId === "cartesian" ? (
                <BarChart data={chartGroup[chartId]}>
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
                  <YAxis type="number" tickLine={true} tickCount={10} allowDecimals={false} />
                  {Object.keys(chartGroup[chartId].at(-1) ?? {})
                    .filter(
                      (key) =>
                        key !== "date" &&
                        key !== "holidayName" &&
                        key !== "dayOfWeek" &&
                        !key.includes("categoryTotal"),
                    )
                    .map((key) => [key, ...key.split("#")])
                    .reverse()
                    .map(([key, id, attributeKey], i) => (
                      <Bar
                        id={id}
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
                    content={<ChartTooltipContent className="bg-white" />}
                    wrapperStyle={{ zIndex: "var(--tooltip-z-index)" }}
                  />
                  {Object.keys(chartGroup[chartId][0]).length <= 10 ? (
                    <ChartLegend content={<ChartLegendContent />} />
                  ) : undefined}
                </BarChart>
              ) : chartId === "ratio" ? (
                <BarChart data={chartGroup[chartId]} stackOffset={"expand"}>
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
                    tickCount={6}
                    domain={[0, 1]}
                    tickFormatter={(value: number) => `${Math.floor(value * 100)}%`}
                    allowDecimals={true}
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
                    .reverse()
                    .map(([key, id, attributeKey], i) => (
                      <Bar
                        id={id}
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
                    content={<ChartTooltipContent className="bg-white" isRatio={true} />}
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
                    startAngle={90}
                    endAngle={-270}
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
        );
      })}
    </MultiChartContainer>
  );
}
