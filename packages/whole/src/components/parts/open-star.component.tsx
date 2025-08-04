import { DeleteDialogTrigger } from "@/components/parts/delete-dialog.component";
import { linkPath } from "@/lib/utils";

interface Props {
  title: string;
  seriesAll: string;
  removeStar: (title: string) => void;
  defaultStarKey: string;
  removeDefaultStar: () => void;
}

export function OpenStar({
  title,
  seriesAll,
  removeStar,
  defaultStarKey,
  removeDefaultStar,
}: Props) {
  return (
    <div className="group flex w-full max-w-full items-center gap-x-2 overflow-hidden">
      <a
        className="block w-full max-w-full cursor-pointer overflow-hidden text-ellipsis text-nowrap pl-2 underline group-hover:text-primary"
        href={linkPath(`/?${new URLSearchParams({ starTitle: title, starSeriesAll: seriesAll })}`)}
      >
        {title}
      </a>
      <DeleteDialogTrigger
        title={title}
        removeStar={removeStar}
        defaultStarKey={defaultStarKey}
        removeDefaultStar={removeDefaultStar}
      />
    </div>
  );
}
