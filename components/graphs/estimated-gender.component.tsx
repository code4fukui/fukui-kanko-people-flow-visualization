import { DataService } from "@/services/data.service";
import Card from "../card.component";
import { Graph } from "../graph.component";
import { Place } from "@/interfaces/place.interface";

export default async function EstimatedGenderGraph(props: { place: Place; date: Date }) {
  const dataService = new DataService();

  const year = props.date.getFullYear();
  const month = props.date.getMonth() + 1;
  const day = props.date.getDate();

  const data = (await dataService.get(props.place, year, month, day))
    .filter((row) => row[1] === "Face")
    .map((row) => (row[6] === "male" ? "男性" : row[6] === "female" ? "女性" : "その他"))
    .reduce(
      (p: { answer: string; count: number }[][], c) => {
        if (!p[0].map((v) => v.answer).includes(c)) p[0].push({ answer: c, count: 0 });
        p[0][p[0].map((v) => v.answer).indexOf(c)].count += 1;
        return p;
      },
      [[]],
    )[0]
    .sort(
      (a, b) =>
        (a.answer === "男性" ? 0 : a.answer === "女性" ? 1 : 2) -
        (b.answer === "男性" ? 0 : b.answer === "女性" ? 1 : 2),
    );
  const options = {
    series: data.map((v) => v.count),
    labels: data.map((v) => v.answer),
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
            },
          },
        },
      },
    },
  };

  return (
    <Card title="推定された性別の割合">
      <Graph type="donut" series={options.series} options={options} />
    </Card>
  );
}
