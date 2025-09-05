import { useCallback, useMemo } from "react";
import {
  type AggregatedData,
  ATTRIBUTES,
  attributeValueText,
  cn,
  getLegendKey,
  type ObjectClassAttribute,
  useLegendControl,
} from "@fukui-kanko/shared";
import { ClickableLegend } from "@fukui-kanko/shared/components/parts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from "@fukui-kanko/shared/components/ui";
import { Cell, Pie, PieChart } from "recharts";

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
  focusedAttribute: ObjectClassAttribute;
}) => {
  const radius = props.innerRadius + (props.outerRadius - props.innerRadius) * 0.7;
  const x = props.cx + radius * Math.cos(-props.midAngle * RADIAN);
  const y = props.cy + radius * Math.sin(-props.midAngle * RADIAN);

  return props.percent > 0.05 ? (
    <g>
      <text
        x={x}
        y={y - 8}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="font-bold drop-shadow"
      >
        {
          ATTRIBUTES[props.focusedAttribute][
            props.name as keyof (typeof ATTRIBUTES)[ObjectClassAttribute]
          ]
        }
      </text>
      <text
        x={x}
        y={y + 8}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="font-bold drop-shadow"
      >
        {props.percent > 0.05 ? `${(props.percent * 100).toFixed(1)}%` : undefined}
      </text>
    </g>
  ) : undefined;
};

export function RainbowLinePieChart({
  data,
  focusedAttribute,
  className,
}: {
  data: AggregatedData[];
  focusedAttribute: ObjectClassAttribute;
  className?: string;
}) {
  const {
    instanceId,
    legendScrollTopRef,
    hiddenKeys,
    toggleKey,
    hoveredLegendKey,
    setHoveredLegendKeyStable,
  } = useLegendControl();
  const list = ATTRIBUTES[focusedAttribute];
  const aggregatedData = data.map((row) => {
    const newData: Record<string, string | number> = {
      "aggregate from": row["aggregate from"],
    };
    Object.keys(list)
      .map((listitem) => ({
        [`${listitem}`]: Object.keys(row)
          .filter(
            (key) =>
              (focusedAttribute === "prefectures" && key.startsWith(listitem)) ||
              (focusedAttribute === "carCategories" && key.endsWith(listitem)),
          )
          .map((key) => Number(row[key]))
          .reduce((sum, current) => sum + current, 0),
      }))
      .forEach((item) => {
        newData[Object.keys(item)[0]] = item[Object.keys(item)[0]];
      });
    return {
      ...newData,
    };
  });
  let chartData = aggregatedData
    .reduce(
      (acc, row) => {
        Object.entries(row).forEach(([key, value]) => {
          if (key === "aggregate from") return; // Skip the date key
          const index = acc.findIndex((item) => item.name === key);
          if (index === -1) {
            acc.push({ value: Number(value), name: key });
            return;
          } else {
            acc[index].value = Number(acc[index].value) + Number(value);
          }
        });
        return acc;
      },
      [] as Record<string, string | number>[],
    )
    .sort((a, b) => {
      if (typeof a.value === "number" && typeof b.value === "number") {
        return b.value - a.value; // Sort by value in descending order
      }
      return 0; // If not numbers, keep original order
    });
  chartData = [
    ...chartData.filter((data) => data.name !== "Other"),
    { name: "Other", value: chartData.find((data) => data.name === "Other")?.value ?? 0 },
  ];

  const visibleChartData = useMemo(() => {
    return chartData.filter((item) => {
      const legendKey = getLegendKey(String(item.name), instanceId);
      return !hiddenKeys.has(legendKey);
    });
  }, [chartData, hiddenKeys, instanceId]);

  const chartConfig: ChartConfig = {};
  Object.keys(list).forEach((key) => {
    chartConfig[key] = {
      label: attributeValueText(focusedAttribute, key),
    };
  });

  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"];

  const getColorByName = useCallback(
    (name: string) => {
      const index = chartData.findIndex((item) => item.name === name);
      return colors[index % colors.length];
    },
    [chartData, colors],
  );

  const shouldDimOthers = hoveredLegendKey !== undefined && !hiddenKeys.has(hoveredLegendKey);
  return (
    <ChartContainer config={chartConfig} className={cn("h-full w-full", className)}>
      <PieChart>
        <Pie
          dataKey="value"
          isAnimationActive={false}
          data={visibleChartData}
          cx="50%"
          cy="50%"
          startAngle={90}
          endAngle={-270}
          fill="#8884d8"
          labelLine={false}
          label={(props) => CustomizedLabel({ ...props, focusedAttribute })}
        >
          {visibleChartData.map((data) => {
            const legendKey = getLegendKey(String(data.name), instanceId);
            const isHovered = hoveredLegendKey === legendKey;
            const isDimmed = shouldDimOthers && !isHovered;
            const color = getColorByName(String(data.name));

            return (
              <Cell
                key={data.name}
                fill={color}
                fillOpacity={isDimmed ? 0.3 : 1}
                stroke={isHovered ? color : undefined}
                strokeWidth={isHovered ? 2 : 0}
              />
            );
          })}
        </Pie>
        <ChartTooltip
          cursor={{ fillOpacity: 0.4, stroke: "hsl(var(--primary))" }}
          content={<ChartTooltipContent className="bg-white" />}
          wrapperStyle={{ zIndex: "var(--tooltip-z-index)" }}
        />
        <ChartLegend
          content={() => (
            <ClickableLegend
              payload={chartData.map((item, index) => ({
                dataKey: String(item.name),
                value: String(item.name),
                color: colors[index % colors.length],
                type: "rect" as const,
              }))}
              hidden={hiddenKeys}
              onToggle={toggleKey}
              instanceSuffix={instanceId}
              savedScrollTop={legendScrollTopRef.current}
              onScrollPersist={(top) => {
                legendScrollTopRef.current = top;
              }}
              hoveredKey={hoveredLegendKey}
              onHoverKeyChange={setHoveredLegendKeyStable}
              config={chartConfig}
              className="max-h-32 pt-3"
            />
          )}
          layout={"vertical"}
          align={"right"}
          verticalAlign={"middle"}
          width={160}
        />
      </PieChart>
    </ChartContainer>
  );
}
