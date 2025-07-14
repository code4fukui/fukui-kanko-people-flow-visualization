import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TrashIcon } from "@primer/octicons-react";

interface Props {
  title: string;
  removeStar: (title: string) => void;
  defaultStarKey: string;
  removeDefaultStar: () => void;
}

export function DeleteDialogTrigger({
  title,
  removeStar,
  defaultStarKey,
  removeDefaultStar,
}: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="shrink-0" variant="destructive" size="icon">
          <TrashIcon size="small" />
        </Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex justify-center">お気に入りの削除</DialogTitle>
            <DialogDescription className="text-center text-foreground break-words max-w-md mx-auto">
              「{title}」をお気に入りから削除しますか？
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              className="transition-all mx-auto w-fit"
              variant="destructive"
              onClick={() => {
                if (title === defaultStarKey) {
                  removeDefaultStar();
                }
                removeStar(title);
              }}
            >
              削除する
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
