import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import clsx from "clsx";

export function TitleArea(props: { title: string; currentN: number }) {
  return (
    <div className="flex gap-2 items-center select-none py-2 px-4 border border-gray-200 rounded-md">
      <a href={`/work/system?n=${props.currentN + 1}`}>
        <ChevronLeftIcon className="text-gray-500 cursor-pointer" />
      </a>

      <span className="text-gray-500 text-sm font-medium">{props.title}</span>
      <a
        href={
          props.currentN <= 0
            ? undefined
            : `/work/system?n=${props.currentN - 1}`
        }
      >
        <ChevronRightIcon
          className={clsx("text-gray-500", {
            "cursor-pointer": props.currentN > 0,
          })}
        />
      </a>
    </div>
  );
}
