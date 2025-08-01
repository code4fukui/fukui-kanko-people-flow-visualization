import {
  AggregatedData,
  ObjectClass
} from "@/interfaces/aggregated-data.interface";
import Papa from "papaparse";

const getUrlPrefix = () => `${location.origin}${location.pathname}`;

export async function getRawData(
  objectClass: ObjectClass,
): Promise<AggregatedData[]> {
  const csvResponse = await fetch(getUrlPrefix() + `${objectClass}.csv`);
  
  if (!csvResponse.ok) {
    throw new Error(`CSVファイルの取得に失敗しました: ${csvResponse.status} ${csvResponse.statusText}`);
  }
  
  const csvRawText = await csvResponse.text();
  const csvFormattedText = csvRawText.replaceAll(/\n{2,}/g, "\n");

  const rawData = Papa.parse<AggregatedData>(csvFormattedText, { header: true }).data;
  return rawData;
}