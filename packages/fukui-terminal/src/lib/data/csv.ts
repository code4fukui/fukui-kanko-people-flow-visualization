import {
  AggregatedData,
  ObjectClass
} from "@/interfaces/aggregated-data.interface";
import Papa from "papaparse";

const getUrlPrefix = () => `${location.origin}${location.pathname}`;

async function getRawData(
  objectClass: ObjectClass,
): Promise<AggregatedData[]> {
  const csvResponse = await fetch(getUrlPrefix() + `${objectClass}.csv`);
  const csvRawText = await csvResponse.text();
  const csvFormattedText = csvRawText.replaceAll(/\n{2,}/g, "\n");

  const rawData = Papa.parse<AggregatedData>(csvFormattedText, { header: true }).data;
  return rawData;
}

async function getHourlyRawData(
  objectClass: ObjectClass,
  startDate: Date,
  endDate: Date,
): Promise<AggregatedData[]> {
  const results: AggregatedData[] = [];
  for (
    let date = new Date(startDate);
    date <= endDate;
    date.setDate(date.getDate() + 1)
  ) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const csvUrl =
      getUrlPrefix() +
      `daily/fukui-station-east-entrance/${objectClass}/${yyyy}/${mm}/${yyyy}-${mm}-${dd}.csv`;
    const csvResponse = await fetch(csvUrl);
    if (csvResponse.ok) {
      const csvRawText = await csvResponse.text();
      const csvFormattedText = csvRawText.replaceAll(/\n{2,}/g, "\n");
      const rawData = Papa.parse<AggregatedData>(csvFormattedText, { header: true }).data;
      results.push(...rawData);
    }
  }
  return results;
}

export async function getData(
  objectClass: ObjectClass,
): Promise<AggregatedData[]> {
  const rawData = await getRawData(objectClass);

  return rawData;
}

export async function getDailyData(
  objectClass: ObjectClass,
  startDate: Date,
  endDate: Date,
): Promise<AggregatedData[]> {
  const rawData = await getHourlyRawData(objectClass, startDate, endDate);

  return rawData;
}
