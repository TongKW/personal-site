import { Skeleton } from "@/components/ui/skeleton";

export default function WorkSystemLoading() {
  return (
    <div className="flex flex-col w-full items-center p-4">
      <WorkProgressLoading />
      <WorkHistoryLoading />
    </div>
  );
}

export function WorkProgressLoading(props: { index?: number }) {
  const { index } = props;
  if (index === undefined) {
    return <Skeleton className="h-60 w-60 rounded-full mb-12" />;
  }
}

export function WorkHistoryLoading() {
  return (
    <>
      <div className="self-start mb-8">
        <Skeleton className="h-12 w-[200px]" />
      </div>
      <div className="flex flex-col self-start w-full gap-3">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-8 w-2/3" />
      </div>
    </>
  );
}
