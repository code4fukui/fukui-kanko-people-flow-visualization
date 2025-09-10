import { useEffect, useState } from "react";
import { PeriodGraphPanel, TypeSelect } from "@fukui-kanko/shared/components/parts";
import { Checkbox, Label } from "@fukui-kanko/shared/components/ui";
import { useDailyDataEffect, useFilteredData } from "@fukui-kanko/shared/hooks";
import { AggregatedData, GRAPH_VIEW_TYPES, Period } from "@fukui-kanko/shared/types";
import { createInitialPeriod, getRawData } from "@fukui-kanko/shared/utils";

function App() {
  const placement = "tojinbo-shotaro";
  const objectClass = "Person";

  const [type, setType] = useState<keyof typeof GRAPH_VIEW_TYPES>("day");
  const [csvData, setCsvData] = useState<AggregatedData[]>([]);
  const [csvDailyData, setCsvDailyData] = useState<AggregatedData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [compareCsvDailyData, setCompareCsvDailyData] = useState<AggregatedData[]>([]);
  const [compareIsLoading, setCompareIsLoading] = useState(false);

  // 本期間の状態
  const [period, setPeriod] = useState<Period>(createInitialPeriod);
  const [filteredData, setFilteredData] = useState<AggregatedData[]>([]);
  const [filteredDailyData, setFilteredDailyData] = useState<AggregatedData[]>([]);

  // 比較期間の状態
  const [comparePeriod, setComparePeriod] = useState<Period>(createInitialPeriod);
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
  useDailyDataEffect(objectClass, placement, type, period, setCsvDailyData, setIsLoading);

  // 比較期間の時間別データを取得・更新
  useDailyDataEffect(
    objectClass,
    placement,
    type,
    comparePeriod,
    setCompareCsvDailyData,
    setCompareIsLoading,
  );

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
            className="
            bg-white 
            border-[#6eba2c] 
            hover:bg-gray-100 
            data-[state=checked]:bg-[#6eba2c]
            data-[state=checked]:border-[#6eba2c]
            data-[state=checked]:text-white"
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
          placement={placement}
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
            placement={placement}
          />
        )}
      </div>
    </div>
  );
}

export default App;
