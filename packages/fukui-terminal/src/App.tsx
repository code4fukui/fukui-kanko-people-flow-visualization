import { useEffect, useState } from "react";
import {
  AggregatedData,
  getRawData,
  GRAPH_VIEW_TYPES,
  Period,
  useDailyDataEffect,
  useFilteredData,
} from "@fukui-kanko/shared";
import { PeriodGraphPanel, TypeSelect } from "@fukui-kanko/shared/components/parts";
import { Checkbox, Label } from "@fukui-kanko/shared/components/ui";

function App() {
  const placement = "fukui-station-east-entrance";

  const [type, setType] = useState<keyof typeof GRAPH_VIEW_TYPES>("day");
  const [csvData, setCsvData] = useState<AggregatedData[]>([]);
  const [csvDailyData, setCsvDailyData] = useState<AggregatedData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [compareCsvDailyData, setCompareCsvDailyData] = useState<AggregatedData[]>([]);
  const [compareIsLoading, setCompareIsLoading] = useState(false);

  // 本期間の状態
  const [period, setPeriod] = useState<Period>(() => {
    const end = new Date();
    end.setDate(end.getDate() - 1); // 今日の前日を設定
    end.setHours(0, 0, 0, 0);
    const start = new Date(end);
    start.setMonth(end.getMonth() - 3); // 3ヶ月前を設定
    start.setHours(0, 0, 0, 0);
    return {
      startDate: start,
      endDate: end,
      startMonth: undefined,
      endMonth: undefined,
      startWeekRange: undefined,
      endWeekRange: undefined,
    };
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
          placement,
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
  useDailyDataEffect(placement, type, period, setCsvDailyData, setIsLoading);

  // 比較期間の時間別データを取得・更新
  useDailyDataEffect(placement, type, comparePeriod, setCompareCsvDailyData, setCompareIsLoading);

  return (
    <div className="h-full w-full max-w-full text-center flex flex-col items-center gap-2 mt-3">
      <div className="flex flex-row items-center gap-[4.25rem] mr-24">
        <TypeSelect
          type={type}
          onChange={(newType) => {
            setType(newType);
          }}
        />
        <div className="flex flex-row items-center gap-2">
          <Checkbox
            id="terms"
            checked={compareMode}
            onCheckedChange={(v) => setCompareMode(!!v)}
            className="bg-white border-black hover:bg-gray-100"
          />
          <Label htmlFor="terms" className="text-base">
            2期間比較
          </Label>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row w-full gap-8 justify-center">
        <PeriodGraphPanel
          type={type}
          period={period}
          setPeriod={setPeriod}
          isCompareMode={compareMode}
          isLoading={isLoading}
          filteredData={filteredData}
          filteredDailyData={filteredDailyData}
        />
        {compareMode && (
          <PeriodGraphPanel
            type={type}
            period={comparePeriod}
            setPeriod={setComparePeriod}
            isCompareMode={compareMode}
            isLoading={compareIsLoading}
            filteredData={compareFilteredData}
            filteredDailyData={compareFilteredDailyData}
          />
        )}
      </div>
    </div>
  );
}

export default App;
