import { useEffect, useState } from "react";
import { AggregatedData, getRawData, Period } from "@fukui-kanko/shared";
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

  const [type, setType] = useState<"month" | "week" | "day" | "hour">("month");
  const [csvData, setCsvData] = useState<AggregatedData[]>([]);
  const [csvDailyData, setCsvDailyData] = useState<AggregatedData[]>([]);

  // 本期間の状態
  const [period, setPeriod] = useState<Period>({
    startDate: undefined,
    endDate: undefined,
    startMonth: undefined,
    endMonth: undefined,
    startWeekRange: undefined,
    endWeekRange: undefined,
  });

  const [filteredData, setFilteredData] = useState<AggregatedData[]>([]);
  const [filteredDailyData, setFilteredDailyData] = useState<AggregatedData[]>([]);

  // 比較期間の状態
  const [comparePeriod, setComparePeriod] = useState<Period>({
    startDate: undefined,
    endDate: undefined,
    startMonth: undefined,
    endMonth: undefined,
    startWeekRange: undefined,
    endWeekRange: undefined,
  });
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
      if (period.startDate && period.endDate) {
        setIsLoading(true);
        const results: AggregatedData[] = [];
        const current = new Date(period.startDate);
        const end = new Date(period.endDate);

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
  }, [type, period.startDate, period.endDate]);

  // 本期間の集計データを期間・テーマ・データ変更時に再計算
  useEffect(() => {
    let filtered = csvData;
    const filteredDaily = csvDailyData;

    if (type === "month" && period.startMonth && period.endMonth) {
      // 月末を取得
      const end = new Date(period.endMonth.getFullYear(), period.endMonth.getMonth() + 1, 0);
      filtered = aggregateMonthly(filtered, period.startMonth, end);
    }

    if (type === "week" && period.startWeekRange && period.endWeekRange) {
      filtered = aggregateWeekly(filtered, period.startWeekRange, period.endWeekRange);
    }

    if (type === "day" && period.startDate && period.endDate) {
      filtered = aggregateDaily(filtered, period.startDate, period.endDate);
    }

    if (type === "hour" && period.startDate && period.endDate) {
      setFilteredDailyData(aggregateHourly(filteredDaily));
    }

    setFilteredData(filtered);
  }, [
    type,
    period.startMonth,
    period.endMonth,
    period.startWeekRange,
    period.endWeekRange,
    period.startDate,
    period.endDate,
    csvData,
    csvDailyData,
  ]);

  // 比較期間の集計データを期間・テーマ・データ変更時に再計算
  useEffect(() => {
    if (type === "month" && comparePeriod.startMonth && comparePeriod.endMonth) {
      const end = new Date(
        comparePeriod.endMonth.getFullYear(),
        comparePeriod.endMonth.getMonth() + 1,
        0,
      );
      setCompareFilteredData(aggregateMonthly(csvData, comparePeriod.startMonth, end));
      return;
    }
    if (type === "week" && comparePeriod.startWeekRange && comparePeriod.endWeekRange) {
      setCompareFilteredData(
        aggregateWeekly(csvData, comparePeriod.startWeekRange, comparePeriod.endWeekRange),
      );
      return;
    }
    if (type === "day" && comparePeriod.startDate && comparePeriod.endDate) {
      setCompareFilteredData(
        aggregateDaily(csvData, comparePeriod.startDate, comparePeriod.endDate),
      );
      return;
    }
    if (type === "hour" && comparePeriod.startDate && comparePeriod.endDate) {
      setCompareFilteredDailyData(aggregateHourly(csvDailyData));
      return;
    }
    setCompareFilteredData(csvData);
    setCompareFilteredDailyData(csvDailyData);
  }, [
    type,
    comparePeriod.startMonth,
    comparePeriod.endMonth,
    comparePeriod.startWeekRange,
    comparePeriod.endWeekRange,
    comparePeriod.startDate,
    comparePeriod.endDate,
    csvData,
    csvDailyData,
  ]);

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center font-sans">
      <div className="text-center w-1/2">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">福井駅周辺データ可視化</h1>
        <div className="flex flex-col items-center gap-6 my-8">
          <TypeSelect
            type={type}
            onChange={(newType) => {
              setType(newType);
              // タイプ変更時に値をリセット
              setPeriod({
                startDate: undefined,
                endDate: undefined,
                startMonth: undefined,
                endMonth: undefined,
                startWeekRange: undefined,
                endWeekRange: undefined,
              });
              setComparePeriod({
                startDate: undefined,
                endDate: undefined,
                startMonth: undefined,
                endMonth: undefined,
                startWeekRange: undefined,
                endWeekRange: undefined,
              });
            }}
          />
          <Checkbox checked={compareMode} onCheckedChange={(v) => setCompareMode(!!v)} />
          <Label htmlFor="terms">2期間比較</Label>
          <div className="flex flex-row gap-8 justify-center">
            <PeriodGraphPanel
              type={type}
              period={period}
              setPeriod={setPeriod}
              isLoading={isLoading}
              filteredData={filteredData}
              filteredDailyData={filteredDailyData}
            />
            {compareMode && (
              <PeriodGraphPanel
                type={type}
                period={comparePeriod}
                setPeriod={setComparePeriod}
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
  );
}

export default App;
