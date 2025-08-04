import { ExternalNavigaton } from "@fukui-kanko/shared/components/parts";
import { GraphIcon } from "@primer/octicons-react";

const isDev = import.meta.env.DEV;

const homeUrl = isDev ? "http://localhost:3004" : "../";

export function Header() {
  return (
    <header className="relative border-indigo-200 flex h-12 w-full items-center justify-between gap-x-2 border-b-2 pb-2">
      <div className="flex flex-col lg:flex-row w-full items-center justify-center lg:justify-start gap-x-2">
        <a
          className="group flex h-fit w-fit items-center justify-start gap-x-2 no-underline"
          href={homeUrl}
          rel="noopener noreferrer"
        >
          <GraphIcon
            size="medium"
            verticalAlign="top"
            className="w-6 h-6 lg:w-8 lg:h-8 fill-indigo-500 transition-all"
          />
          <h1 className="lg:text-2xl font-bold transition-all group-hover:scale-110 group-hover:underline">
            福井観光DX:グラフ
          </h1>
        </a>
        <h1 className="lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:text-4xl text-2xl font-bold whitespace-nowrap pb-3">
          福井駅東口案内所 人流データ
        </h1>
      </div>
      <ExternalNavigaton />
    </header>
  );
}
