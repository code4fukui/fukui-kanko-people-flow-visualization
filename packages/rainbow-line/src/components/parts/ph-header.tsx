import { ExternalNavigatonPlaceHolder } from "./ph-external-navigation.component";

export function HeaderPlaceHolder({ title }: { title: string }) {
  return (
    <header className="h-12 flex w-full items-center justify-center border-b-2 border-border pb-2">
      <h1 className="grow text-center">{title}</h1>
      <ExternalNavigatonPlaceHolder className="self-end" />
    </header>
  );
}
