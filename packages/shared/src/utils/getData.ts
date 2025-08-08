import Papa from "papaparse";
import { AggregatedData, AggregatedRange, DateNumbers, ObjectClass, Placement } from "../types";

declare const __CSV_ORIGIN__: string;

type getRawDataProps<T extends AggregatedRange> = T extends "full"
  ? {
      placement: Placement;
      objectClass: ObjectClass;
      aggregateRange: T;
      kind?: "people-flow-data";
    }
  : {
      placement: Placement;
      objectClass: ObjectClass;
      aggregateRange: T;
      kind?: "people-flow-data";
      date: Date | DateNumbers<T>;
    };

export async function getRawData<T extends AggregatedRange>(params: getRawDataProps<T>) {
  const { placement, objectClass, aggregateRange, kind = "people-flow-data" } = params;
  let url = `${__CSV_ORIGIN__}${kind}/${aggregateRange}/${placement}/${objectClass}`;

  if (aggregateRange === "full") {
    url += ".csv";
  } else if (aggregateRange === "monthly") {
    const { year, month } =
      params.date instanceof Date
        ? { year: params.date.getFullYear(), month: params.date.getMonth() }
        : params.date;
    url += `/${year}/${year}-${month}.csv`;
  } else if (aggregateRange === "daily") {
    const { year, month, day } =
      params.date instanceof Date
        ? {
            year: params.date.getFullYear(),
            month: params.date.getMonth(),
            day: params.date.getDate(),
          }
        : params.date;
    url += `/${year}/${month}/${year}-${month}-${day}.csv`;
  } else {
    const { year, month, day, hour } =
      params.date instanceof Date
        ? {
            year: params.date.getFullYear(),
            month: params.date.getMonth(),
            day: params.date.getDate(),
            hour: params.date.getHours(),
          }
        : params.date;
    url += `/${year}/${month}/${day}/${year}-${month}-${day}-${hour}.csv`;
  }

  const csvResponse = await fetch(url);
  const csvRawText = await csvResponse.text();
  const csvFormattedText = csvRawText.replaceAll(/\n{2,}/g, "\n");

  const rawData = Papa.parse<AggregatedData>(csvFormattedText, { header: true }).data;
  return rawData;
}
