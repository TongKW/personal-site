import { WorkProgressRing } from "./components/progress-ring";
import { WorkHistoryTable } from "./components/work-history";
import { TitleArea } from "./components/title-area";

export function WorkSystemContent(props: {
  userId?: string;
  rule: TargetRule;
  targets: Target[];
  goals: Goal[];
  goalItems: GoalItem[];
  progressItems: ProgressItem[];
  works: Work[];
  title: string;
  currentN: number;
}) {
  const {
    userId,
    rule,
    targets,
    goalItems,
    goals,
    progressItems,
    works,
    title,
    currentN,
  } = props;

  const getTotalDuration = () => {
    let total = 0;
    for (const work of works) total += work.duration;
    return total / 60;
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex w-full justify-center">
        <TitleArea currentN={currentN} title={title} />
      </div>
      <div className="flex justify-center">
        <WorkProgressRing
          userId={userId}
          goalItems={goalItems}
          progressItems={progressItems}
          currentN={currentN}
        />
      </div>
      <p className="text-left">
        <span className="font-semibold">Work History</span>
        <span className="font-normal text-sm text-gray-500 pl-4">{`(total duration: ${parseFloat(
          getTotalDuration().toFixed(2)
        )} hours)`}</span>
      </p>

      <WorkHistoryTable works={works} />
    </div>
  );
}
