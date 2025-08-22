import { ExternalNavigation } from "@fukui-kanko/shared/components/parts";

export function Header({ title }: { title: string }) {
  return (
    <header className="h-12 grid grid-cols-[1fr_auto_1fr] w-full items-center justify-center border-b-2 border-border pb-2">
      <div />
      <h1 className="text-center text-4xl font-bold">{title}</h1>
      <div className="w-fit place-self-end">
        <ExternalNavigation />
      </div>
    </header>
  );
}
