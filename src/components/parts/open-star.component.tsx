import { TrashIcon } from "@primer/octicons-react";
import { Button } from "../ui/button";

interface Props {
  title: string;
  seriesAll: string;
  removeStar: (title: string) => void;
}

export function OpenStar({ title, seriesAll, removeStar }: Props) {
  return (
    <div className="group mt-2 flex max-w-full items-center gap-x-2">
      <a
        className="block w-full max-w-full cursor-pointer overflow-hidden text-ellipsis text-nowrap pl-2 underline group-hover:text-primary"
        href={`/?${new URLSearchParams({ starTitle: title, starSeriesAll: seriesAll })}`}
      >
        {title}
      </a>
      <Button
        className="shrink-0"
        variant="destructive"
        size="icon"
        onClick={() => removeStar(title)}
      >
        <TrashIcon size="small" />
      </Button>
    </div>
  );
}
