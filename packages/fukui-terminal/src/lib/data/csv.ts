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

export async function getData(
  objectClass: ObjectClass,
): Promise<AggregatedData[]> {
  const rawData = await getRawData(objectClass);

  // let filteredData = [...rawData].filter((rawDataRow) =>
  //   isDateIncludedInRange(new Date(rawDataRow["aggregate from"]), date),
  // );

  return rawData;
}
