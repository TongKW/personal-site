import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col w-full h-full items-center gap-6">
      <Skeleton className="h-[38px] w-[180px] rounded-md" />
      <Skeleton className="h-60 w-60 rounded-full" />
      <div className="flex w-full">
        <Skeleton className="h-[24px] w-[100px] rounded-md" />
      </div>
      <Skeleton className="h-[200px] flex-grow w-full rounded-lg" />
    </div>
  );
}
