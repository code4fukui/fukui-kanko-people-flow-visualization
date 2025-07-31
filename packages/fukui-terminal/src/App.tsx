import { useEffect, useState } from "react";
import {
  AggregatedData,
  getRawData,
  Period,
  useDailyDataEffect,
  useFilteredData,
} from "@fukui-kanko/shared";
import { PeriodGraphPanel, TypeSelect } from "@fukui-kanko/shared/components/parts";
import { Checkbox, Label } from "@fukui-kanko/shared/components/ui";

function App() {
  // 開発環境かどうかを判定
  const isDev = import.meta.env.DEV;
  // ローカル開発時はランディングページのポート、本番時は相対パス
  const homeUrl = isDev ? "http://localhost:3004" : "../";

  const [isLoading, setIsLoading] = useState(false);
  const [compareIsLoading, setCompareIsLoading] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [compareCsvDailyData, setCompareCsvDailyData] = useState<AggregatedData[]>([]);

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

  // 本期間の集計データを期間・テーマ・データ変更時に再計算
  useFilteredData(type, period, csvData, csvDailyData, setFilteredData, setFilteredDailyData);

  // 比較期間の集計データを期間・テーマ・データ変更時に再計算
  useFilteredData(
    type,
    comparePeriod,
    csvData,
    compareCsvDailyData,
    setCompareFilteredData,
    setCompareFilteredDailyData,
  );

  // 本期間の時間別データを取得・更新
  useDailyDataEffect(type, period, setCsvDailyData, setIsLoading);

  // 比較期間の時間別データを取得・更新
  useDailyDataEffect(type, comparePeriod, setCompareCsvDailyData, setCompareIsLoading);

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
          <Checkbox
            checked={compareMode}
            onCheckedChange={(v) => setCompareMode(!!v)}
            className="bg-white"
          />
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
                isLoading={compareIsLoading}
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
