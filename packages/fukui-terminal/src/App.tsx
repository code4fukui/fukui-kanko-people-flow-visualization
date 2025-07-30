import { useEffect, useState } from "react";
import { AggregatedData, getRawData } from "@fukui-kanko/shared";
import { PeriodGraphPanel, TypeSelect } from "@fukui-kanko/shared/components/parts";
import { Checkbox, Label } from "@fukui-kanko/shared/components/ui";
import {
  aggregateDaily,
  aggregateHourly,
  aggregateMonthly,
  aggregateWeekly,
} from "@fukui-kanko/shared/utils";

function App() {
  // 開発環境かどうかを判定
  const isDev = import.meta.env.DEV;
  // ローカル開発時はランディングページのポート、本番時は相対パス
  const homeUrl = isDev ? "http://localhost:3004" : "../";

  const [isLoading, setIsLoading] = useState(false);
  const [compareMode, setCompareMode] = useState(false);

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [startMonth, setStartMonth] = useState<Date | undefined>(undefined);
  const [endMonth, setEndMonth] = useState<Date | undefined>(undefined);
  const [startWeekRange, setStartWeekRange] = useState<{ from: Date; to: Date } | undefined>(
    undefined,
  );
  const [endWeekRange, setEndWeekRange] = useState<{ from: Date; to: Date } | undefined>(undefined);

  const [type, setType] = useState<"month" | "week" | "day" | "hour">("month");
  const [csvData, setCsvData] = useState<AggregatedData[]>([]);
  const [csvDailyData, setCsvDailyData] = useState<AggregatedData[]>([]);

  const [filteredData, setFilteredData] = useState<AggregatedData[]>([]);
  const [filteredDailyData, setFilteredDailyData] = useState<AggregatedData[]>([]);

  const [compareStartDate, setCompareStartDate] = useState<Date | undefined>(undefined);
  const [compareEndDate, setCompareEndDate] = useState<Date | undefined>(undefined);
  const [compareStartMonth, setCompareStartMonth] = useState<Date | undefined>(undefined);
  const [compareEndMonth, setCompareEndMonth] = useState<Date | undefined>(undefined);
  const [compareStartWeekRange, setCompareStartWeekRange] = useState<
    { from: Date; to: Date } | undefined
  >(undefined);
  const [compareEndWeekRange, setCompareEndWeekRange] = useState<
    { from: Date; to: Date } | undefined
  >(undefined);
  const [compareFilteredData, setCompareFilteredData] = useState<AggregatedData[]>([]);
  const [compareFilteredDailyData, setCompareFilteredDailyData] = useState<AggregatedData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rawData = await getRawData({
          objectClass: "Person",
          placement: "fukui-station-east-entrance",
          aggregateRange: "full",
        });
        setCsvData(rawData);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("データの取得に失敗しました:", error);
        setCsvData([]);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (type !== "hour") {
      setIsLoading(false);
      return;
    }
    let isCurrent = true;
    const fetchData = async () => {
      if (startDate && endDate) {
        setIsLoading(true);
        const results: AggregatedData[] = [];
        const current = new Date(startDate);
        const end = new Date(endDate);

        while (current <= end) {
          // 1時間ごとに取得
          const rawData = await getRawData({
            objectClass: "Person",
            placement: "fukui-station-east-entrance",
            aggregateRange: "daily", // 1時間毎のデータはdailyに含まれています
            date: new Date(current),
          });
          results.push(...rawData);
          current.setDate(current.getDate() + 1);
        }

        if (isCurrent) {
          setCsvDailyData(results);
          setIsLoading(false);
        }
      }
    };
    fetchData();
    return () => {
      isCurrent = false;
    };
  }, [type, startDate, endDate]);

  useEffect(() => {
    let filtered = csvData;
    const filteredDaily = csvDailyData;

    if (type === "month" && startMonth && endMonth) {
      // 月末を取得
      const end = new Date(endMonth.getFullYear(), endMonth.getMonth() + 1, 0);
      filtered = aggregateMonthly(filtered, startMonth, end);
    }

    if (type === "week" && startWeekRange && endWeekRange) {
      filtered = aggregateWeekly(filtered, startWeekRange, endWeekRange);
    }

    if (type === "day" && startDate && endDate) {
      filtered = aggregateDaily(filtered, startDate, endDate);
    }

    if (type === "hour" && startDate && endDate) {
      setFilteredDailyData(aggregateHourly(filteredDaily));
    }

    setFilteredData(filtered);
  }, [
    type,
    startMonth,
    endMonth,
    startWeekRange,
    endWeekRange,
    startDate,
    endDate,
    csvData,
    csvDailyData,
  ]);

  useEffect(() => {
    if (type === "month" && compareStartMonth && compareEndMonth) {
      const end = new Date(compareEndMonth.getFullYear(), compareEndMonth.getMonth() + 1, 0);
      setCompareFilteredData(aggregateMonthly(csvData, compareStartMonth, end));
      return;
    }
    if (type === "week" && compareStartWeekRange && compareEndWeekRange) {
      setCompareFilteredData(aggregateWeekly(csvData, compareStartWeekRange, compareEndWeekRange));
      return;
    }
    if (type === "day" && compareStartDate && compareEndDate) {
      setCompareFilteredData(aggregateDaily(csvData, compareStartDate, compareEndDate));
      return;
    }
    if (type === "hour" && compareStartDate && compareEndDate) {
      setCompareFilteredDailyData(aggregateHourly(csvDailyData));
      return;
    }
    setCompareFilteredData(csvData);
    setCompareFilteredDailyData(csvDailyData);
  }, [
    type,
    compareStartMonth,
    compareEndMonth,
    compareStartWeekRange,
    compareEndWeekRange,
    compareStartDate,
    compareEndDate,
    csvData,
    csvDailyData,
  ]);

  return (
    <>
      <div className="min-h-screen w-screen bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center font-sans">
        <div className="text-center w-1/2">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">福井駅周辺データ可視化</h1>
          <div className="flex flex-col items-center gap-6 my-8">
            <TypeSelect
              type={type}
              onChange={(newType) => {
                setType(newType);
                // タイプ変更時に値をリセット
                setStartMonth(undefined);
                setEndMonth(undefined);
                setStartDate(undefined);
                setEndDate(undefined);
                setStartWeekRange(undefined);
                setEndWeekRange(undefined);
              }}
            />
            <Checkbox checked={compareMode} onCheckedChange={(v) => setCompareMode(!!v)} />
            <Label htmlFor="terms">2期間比較</Label>

            <div className="flex flex-row gap-8 justify-center">
              <PeriodGraphPanel
                type={type}
                startMonth={startMonth}
                endMonth={endMonth}
                setStartMonth={setStartMonth}
                setEndMonth={setEndMonth}
                startWeekRange={startWeekRange}
                endWeekRange={endWeekRange}
                setStartWeekRange={setStartWeekRange}
                setEndWeekRange={setEndWeekRange}
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                isLoading={isLoading}
                filteredData={filteredData}
                filteredDailyData={filteredDailyData}
              />
              {compareMode && (
                <PeriodGraphPanel
                  type={type}
                  startMonth={compareStartMonth}
                  endMonth={compareEndMonth}
                  setStartMonth={setCompareStartMonth}
                  setEndMonth={setCompareEndMonth}
                  startWeekRange={compareStartWeekRange}
                  endWeekRange={compareEndWeekRange}
                  setStartWeekRange={setCompareStartWeekRange}
                  setEndWeekRange={setCompareEndWeekRange}
                  startDate={compareStartDate}
                  endDate={compareEndDate}
                  setStartDate={setCompareStartDate}
                  setEndDate={setCompareEndDate}
                  isLoading={isLoading}
                  filteredData={compareFilteredData}
                  filteredDailyData={compareFilteredDailyData}
                />
              )}
            </div>
          </div>
          <a
            href={homeUrl}
            className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-6 rounded-md transition-colors cursor-pointer"
          >
            ← トップページに戻る
          </a>
        </div>
      </div>
    </>
  );
}

export default App;
