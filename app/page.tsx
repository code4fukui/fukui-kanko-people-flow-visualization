import DateNavigation from "@/components/date-navigation.component";
import DetectedFaceGraph from "@/components/graphs/detected-face.component";
import DetectedLisencePlateGraph from "@/components/graphs/detected-license-plate.component";
import DetectedPeopleGraph from "@/components/graphs/detected-people.component";
import EstimatedAgeGraph from "@/components/graphs/estimated-age.component";
import EstimatedGenderGraph from "@/components/graphs/estimated-gender.component";
import EstimatedRentalCarGraph from "@/components/graphs/estimated-rental-car.component";
import EstimatedARegionGraph from "@/components/graphs/estimated-a-region.component";

export default async function Home() {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return (
    <>
      <DateNavigation currentDate={date} className="mb-4"></DateNavigation>
      <article className="mb-4 flex flex-col items-center p-4">
        <h2 className="mb-2 text-xl font-bold">福井駅でのAIカメラによる解析</h2>
        <div className="grid h-full w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <DetectedPeopleGraph place={"fukui-terminal"} date={date} />
          <DetectedFaceGraph place={"fukui-terminal"} date={date} />
          <EstimatedAgeGraph place={"fukui-terminal"} date={date} />
          <EstimatedGenderGraph place={"fukui-terminal"} date={date} />
        </div>
      </article>
      <article className="mb-4 flex flex-col items-center p-4">
        <h2 className="mb-2 text-xl font-bold">東尋坊でのAIカメラによる解析</h2>
        <div className="grid h-full w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <DetectedPeopleGraph place={"tojinbo"} date={date} />
          <DetectedFaceGraph place={"tojinbo"} date={date} />
          <EstimatedAgeGraph place={"tojinbo"} date={date} />
          <EstimatedGenderGraph place={"tojinbo"} date={date} />
        </div>
      </article>
      <article className="mb-4 flex flex-col items-center p-4">
        <h2 className="mb-2 text-xl font-bold">
          レインボーライン第一駐車場入口でのAIカメラによる解析
        </h2>
        <div className="grid h-full w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <DetectedLisencePlateGraph place={"rainbow-one"} date={date} />
          <EstimatedARegionGraph place={"rainbow-one"} date={date} />
          <EstimatedRentalCarGraph place={"rainbow-one"} date={date} />
          <DetectedFaceGraph place={"rainbow-one"} date={date} />
          <EstimatedAgeGraph place={"rainbow-one"} date={date} />
          <EstimatedGenderGraph place={"rainbow-one"} date={date} />
        </div>
      </article>
    </>
  );
}
