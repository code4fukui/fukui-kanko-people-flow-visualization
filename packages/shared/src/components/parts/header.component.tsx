import { ExternalNavigaton } from "@fukui-kanko/shared/components/parts";

export function Header() {
  return (
    <header className="relative border-b-gray-500 flex h-12 w-full items-center justify-between gap-x-2 border-b-2 pb-2">
      <div className="flex flex-col lg:flex-row w-full items-center justify-center lg:justify-start gap-x-2">
        <h1 className="sm:absolute sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:text-4xl text-2xl font-bold whitespace-nowrap pb-3">
          福井駅東口案内所 人流データ
        </h1>
      </div>
      <ExternalNavigaton />
    </header>
  );
}
