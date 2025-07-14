import { linkPath } from "@/lib/utils";
import { GraphIcon } from "@primer/octicons-react";
import { ExternalNavigaton } from "./external-navigation.component";

export function Header() {
  return (
    <header className="border-separator flex h-12 w-full items-center justify-between gap-x-2 border-b-2 pb-2">
      <a
        className="group flex h-fit w-fit items-center justify-start gap-x-2 no-underline"
        href={linkPath("/")}
        rel="noopener noreferrer"
      >
        <GraphIcon
          size="medium"
          verticalAlign="top"
          className="group-hover:scale-120 fill-primary transition-all"
        />
        <h1 className="text-2xl font-bold transition-all group-hover:scale-110 group-hover:underline">
          福井観光DX:グラフ
        </h1>
      </a>
      <ExternalNavigaton />
    </header>
  );
}
