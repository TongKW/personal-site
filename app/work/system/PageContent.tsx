import { WorkProgressRing } from "./WorkProgress/components/Ring";

export function WorkSystemContent(props: {
  userId?: string;
  rule: TargetRule;
  targets: Target[];
  goals: Goal[];
  progressItems: ProgressItem[];
}) {
  const { userId, rule, targets, goals, progressItems } = props;

  console.log("progressItems: ");
  console.log(progressItems);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-center">
        <WorkProgressRing progressItems={progressItems} />
      </div>
      <p className="text-left">Work History</p>
    </div>
  );
}
