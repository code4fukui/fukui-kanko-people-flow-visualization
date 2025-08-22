import { ExternalNavigation } from "@fukui-kanko/shared/components/parts";

export function Header({ title }: { title: string }) {
  return (
    <header className="h-12 grid grid-cols-3 w-full items-center justify-center border-b-2 border-border pb-2">
      <span></span>
      <h1 className="w-full text-center text-2xl font-bold">{title}</h1>
      <div className="w-fit place-self-end">
        <ExternalNavigation />
      </div>
    </header>
  );
}
