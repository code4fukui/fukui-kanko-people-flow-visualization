import { ExternalNavigation } from "@fukui-kanko/shared/components/parts";
import { Tooltip, TooltipContent, TooltipTrigger } from "@fukui-kanko/shared/components/ui";
import { InfoIcon } from "@primer/octicons-react";

export function Header({ title }: { title: string }) {
  return (
    <header className="h-12 grid grid-cols-[1fr_auto_1fr] w-full items-center justify-center border-b-2 border-border pb-2">
      <div />
      <div className="flex items-center gap-2 justify-center">
        <h1 className="text-center text-4xl font-bold">{title}</h1>
        <Tooltip>
          <TooltipTrigger>
            <InfoIcon className="text-gray-400" size={28} />
          </TooltipTrigger>
          <TooltipContent
            className="bg-gray-300 text-black"
            arrowClassName="bg-gray-300 fill-gray-300"
          >
            <p className="font-sans">
              ※機器の不具合によりデータが正常に反映されない可能性があります
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="w-fit place-self-end">
        <ExternalNavigation />
      </div>
    </header>
  );
}
