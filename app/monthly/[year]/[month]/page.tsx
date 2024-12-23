import MonthlyDetectedPersonGraph from "@/components/graphs/monthly-detected-person.component";
import MonthlyEstimatedAgeGraph from "@/components/graphs/monthly-estimated-age.component";
import MonthlyEstimatedCarCategorySummaryGraph from "@/components/graphs/monthly-estimated-car-category-summary.component";
import MonthlyEstimatedCarCategoryGraph from "@/components/graphs/monthly-estimated-car-category.component";
import MonthlyEstimatedGenderGraph from "@/components/graphs/monthly-estimated-gender.component";
import MonthlyEstimatedPrefectureSummaryGraph from "@/components/graphs/monthly-estimated-prefecture-summary.component";
import MonthlyEstimatedPrefectureGraph from "@/components/graphs/monthly-estimated-prefecture.component";
import MonthlyPageNavigation from "@/components/monthly-page-navigation.component";

export async function generateStaticParams() {
  const routes = [];
  for (
    let i = new Date("2024-10-01");
    i.getTime() < new Date().getTime();
    i.setMonth(i.getMonth() + 1)
  ) {
    routes.push({
      year: i.getFullYear().toString(),
      month: (i.getMonth() + 1).toString().padStart(2, "0"),
    });
  }

  return routes;
}

export default async function Page({
  params,
}: {
  params: Promise<{ year: string; month: string }>;
}) {
  const date = new Date(((params) => `${params.year}-${params.month}-01`)(await params));
  return (
    <>
      <MonthlyPageNavigation year={date.getFullYear()} month={date.getMonth() + 1} />
      <article className="mb-4 flex flex-col items-center p-4">
        <h2 className="mb-2 text-xl font-bold">福井駅東口（観光案内所前）</h2>
        <div className="grid h-full w-full grid-cols-1 gap-4 xl:grid-cols-2">
          <MonthlyDetectedPersonGraph
            placement="fukui-station-east-entrance"
            year={date.getFullYear()}
            month={date.getMonth() + 1}
          ></MonthlyDetectedPersonGraph>
          <MonthlyEstimatedGenderGraph
            placement="fukui-station-east-entrance"
            year={date.getFullYear()}
            month={date.getMonth() + 1}
          ></MonthlyEstimatedGenderGraph>
          <MonthlyEstimatedAgeGraph
            placement="fukui-station-east-entrance"
            year={date.getFullYear()}
            month={date.getMonth() + 1}
          ></MonthlyEstimatedAgeGraph>
        </div>
      </article>
      <article className="mb-4 flex flex-col items-center p-4">
        <h2 className="mb-2 text-xl font-bold">東尋坊</h2>
        <div className="grid h-full w-full grid-cols-1 gap-4 xl:grid-cols-2">
          <MonthlyDetectedPersonGraph
            placement="tojinbo-shotaro"
            year={date.getFullYear()}
            month={date.getMonth() + 1}
          ></MonthlyDetectedPersonGraph>
          <MonthlyEstimatedGenderGraph
            placement="tojinbo-shotaro"
            year={date.getFullYear()}
            month={date.getMonth() + 1}
          ></MonthlyEstimatedGenderGraph>
          <MonthlyEstimatedAgeGraph
            placement="tojinbo-shotaro"
            year={date.getFullYear()}
            month={date.getMonth() + 1}
          ></MonthlyEstimatedAgeGraph>
        </div>
      </article>
      <article className="mb-4 flex flex-col items-center p-4">
        <h2 className="mb-2 text-xl font-bold">レインボーライン第一駐車場</h2>
        <div className="grid h-full w-full grid-cols-1 gap-4 xl:grid-cols-2">
          <MonthlyEstimatedPrefectureGraph
            placement="rainbow-line-parking-lot-1-gate"
            year={date.getFullYear()}
            month={date.getMonth() + 1}
          ></MonthlyEstimatedPrefectureGraph>
          <MonthlyEstimatedPrefectureSummaryGraph
            placement="rainbow-line-parking-lot-1-gate"
            year={date.getFullYear()}
            month={date.getMonth() + 1}
          ></MonthlyEstimatedPrefectureSummaryGraph>
          <MonthlyEstimatedCarCategoryGraph
            placement="rainbow-line-parking-lot-1-gate"
            year={date.getFullYear()}
            month={date.getMonth() + 1}
          ></MonthlyEstimatedCarCategoryGraph>
          <MonthlyEstimatedCarCategorySummaryGraph
            placement="rainbow-line-parking-lot-1-gate"
            year={date.getFullYear()}
            month={date.getMonth() + 1}
          ></MonthlyEstimatedCarCategorySummaryGraph>
        </div>
      </article>
    </>
  );
}