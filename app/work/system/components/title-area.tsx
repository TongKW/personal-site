"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

export function TitleArea(props: { title: string; currentN: number }) {
  const router = useRouter();
  const setPreviousInterval = () => {
    const n = props.currentN + 1;
    router.push(`/work/system?n=${n}`);
  };

  const setNextInterval = () => {
    if (props.currentN === 0) return;
    const n = props.currentN - 1;
    router.push(`/work/system?n=${n}`);
  };

  return (
    <div className="flex gap-2 items-center select-none py-2 px-4 border border-gray-200 rounded-md">
      <ChevronLeftIcon
        className="text-gray-500 cursor-pointer"
        onClick={setPreviousInterval}
      />
      <span className="text-gray-500 text-sm font-medium">{props.title}</span>
      <ChevronRightIcon
        className="text-gray-500 cursor-pointer"
        onClick={setNextInterval}
      />
    </div>
  );
}
