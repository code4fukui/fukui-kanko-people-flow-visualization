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
        y={y - 10}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="font-bold drop-shadow"
      >
        {props.percent > 0.05 ? `${(props.percent * 100).toFixed(1)}%` : undefined}
      </text>
      <text
        x={x}
        y={y + 10}
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
  const aggregbatedData = data.map((row) => {
    const newData: Record<string, string | number> = {
      "aggregate from": row["aggregate from"],
    };
    Object.keys(list)
      .map((listitem) => ({
        [`${listitem}`]: Object.keys(row)
          .filter((key) => key.startsWith(listitem) || key.endsWith(listitem))
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
  const chartData = aggregbatedData
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

  return (
    <div
      className={cn(
        "flex flex-col items-center grow w-full h-full max-h-full overflow-hidden",
        className,
      )}
    >
      <div className="flex flex-col gap-y-4 w-full min-w-full grow overflow-auto">
        <ChartContainer config={chartConfig} className="h-full w-full min-h-0">
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
              {Object.entries(chartData).map(([k]) => (
                <Cell key={k} fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />
              ))}
            </Pie>
            <ChartTooltip
              cursor={{ fillOpacity: 0.4, stroke: "hsl(var(--primary))" }}
              content={<ChartTooltipContent className="bg-white" />}
              wrapperStyle={{ zIndex: "var(--tooltip-z-index)" }}
            />
            {Object.keys(chartData).length <= 10 ? (
              <ChartLegend content={<ChartLegendContent />} />
            ) : undefined}
          </PieChart>
        </ChartContainer>
      </div>
    </div>
  );
}
