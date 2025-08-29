import {
  type AggregatedData,
  ATTRIBUTES,
  attributeValueText,
  cn,
  type ObjectClassAttribute,
} from "@fukui-kanko/shared";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
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
  const chartData = aggregatedData
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
  const chartConfig: ChartConfig = {};
  Object.keys(list).forEach((key) => {
    chartConfig[key] = {
      label: attributeValueText(focusedAttribute, key),
    };
  });

  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"];

  return (
    <ChartContainer config={chartConfig} className={cn("h-full w-full", className)}>
      <PieChart>
        <Pie
          dataKey="value"
          isAnimationActive={false}
          data={chartData}
          cx="50%"
          cy="50%"
          startAngle={90}
          endAngle={-270}
          fill="#8884d8"
          labelLine={false}
          label={(props) => CustomizedLabel({ ...props, focusedAttribute })}
        >
          {Object.entries(chartData).map(([k], i) => (
            <Cell key={k} fill={colors[i % colors.length]} />
          ))}
        </Pie>
        <ChartTooltip
          cursor={{ fillOpacity: 0.4, stroke: "hsl(var(--primary))" }}
          content={<ChartTooltipContent className="bg-white" />}
          wrapperStyle={{ zIndex: "var(--tooltip-z-index)" }}
        />
        <ChartLegend
          content={<ChartLegendContent />}
          layout={"vertical"}
          align={"right"}
          verticalAlign={"middle"}
          width={160}
        />
      </PieChart>
    </ChartContainer>
  );
}
