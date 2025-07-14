import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  DatabaseIcon,
  FileCodeIcon,
  LinkExternalIcon,
  MarkGithubIcon,
  ThreeBarsIcon,
} from "@primer/octicons-react";

export function ExternalNavigaton() {
  return (
    <>
      <nav className="md:hidden">
        <Popover>
          <PopoverTrigger>
            <ThreeBarsIcon size="medium" />
          </PopoverTrigger>
          <PopoverContent className="flex w-fit flex-col items-center gap-y-4">
            <a
              className="flex items-center gap-x-2 underline hover:font-bold"
              href="https://github.com/code4fukui/fukui-kanko-people-flow-data"
              target="_blank"
            >
              <DatabaseIcon size="small" />
              データソース
            </a>
            <a
              className="flex items-center gap-x-2 underline hover:font-bold"
              href="https://github.com/code4fukui/fukui-kanko-people-flow-visualization"
              target="_blank"
            >
              <FileCodeIcon size="small" />
              ページソース
            </a>
            <a href="https://code4fukui.github.io/" target="_blank">
              <img
                aria-hidden
                src="https://code4fukui.github.io/code4fukui_logo.svg"
                alt="code4fukui logo"
                width={42}
                height={32}
              />
            </a>
          </PopoverContent>
        </Popover>
      </nav>
      <nav className="hidden gap-x-4 md:flex">
        <Popover>
          <PopoverTrigger className="cursor-pointer transition-all hover:scale-110">
            <MarkGithubIcon size="medium" />
          </PopoverTrigger>
          <PopoverContent className="flex w-40 flex-col gap-y-4">
            <a
              className="flex items-center gap-x-2 underline hover:font-bold"
              href="https://github.com/code4fukui/fukui-kanko-people-flow-data"
              target="_blank"
            >
              <DatabaseIcon size="small" />
              データソース
            </a>
            <a
              className="flex items-center gap-x-2 underline hover:font-bold"
              href="https://github.com/code4fukui/fukui-kanko-people-flow-visualization"
              target="_blank"
            >
              <FileCodeIcon size="small" />
              ページソース
            </a>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger className="cursor-pointer transition-all hover:scale-110">
            <img
              aria-hidden
              src="https://code4fukui.github.io/code4fukui_logo.svg"
              alt="code4fukui logo"
              width={42}
              height={32}
            />
          </PopoverTrigger>
          <PopoverContent className="flex w-56 items-center">
            <a
              href="https://code4fukui.github.io/"
              target="_blank"
              className="flex items-center gap-x-2 underline hover:font-bold"
            >
              Code for FUKUI とは
              <LinkExternalIcon size="small" />
            </a>
          </PopoverContent>
        </Popover>
      </nav>
    </>
  );
}
