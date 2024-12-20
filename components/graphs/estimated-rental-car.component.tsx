import { Place } from "@/interfaces/place.interface";
import { DataService } from "@/services/data.service";
import Card from "../card.component";
import { Graph } from "../graph.component";

export default async function EstimatedRentalCarGraph(props: { place: Place; date: Date }) {
  const dataService = new DataService();

  const year = props.date.getFullYear();
  const month = props.date.getMonth() + 1;
  const day = props.date.getDate();

  const data = (await dataService.get(props.place, year, month, day))
    .filter((row) => row[1] === "LicensePlate")
    .map((row) => (["れ", "わ"].includes(row[9]) ? "レンタカー" : "その他"))
    .reduce(
      (p: { answer: string; count: number }[][], c) => {
        if (!p[0].map((v) => v.answer).includes(c)) p[0].push({ answer: c, count: 0 });
        p[0][p[0].map((v) => v.answer).indexOf(c)].count += 1;
        return p;
      },
      [[]],
    )[0]
    .sort((a, b) => (a.answer === "レンタカー" ? 0 : 1) - (b.answer === "レンタカー" ? 0 : 1));

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
    <Card title="レンタカーと推測された車の割合">
      <Graph type="donut" series={options.series} options={options} />
    </Card>
  );
}
