import { WorkProgressRing } from "./components/progress-ring";
import { WorkHistoryTable } from "./components/work-history";

export function WorkSystemContent(props: {
  userId?: string;
  rule: TargetRule;
  targets: Target[];
  goals: Goal[];
  goalItems: GoalItem[];
  progressItems: ProgressItem[];
  works: Work[];
}) {
  const { userId, rule, targets, goalItems, goals, progressItems, works } =
    props;

  console.log("progressItems: ");
  console.log(progressItems);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-center">
        <WorkProgressRing
          userId={userId}
          goalItems={goalItems}
          progressItems={progressItems}
        />
      </div>
      <p className="text-left font-semibold">Work History</p>

      <WorkHistoryTable works={works} />
    </div>
  );
}
