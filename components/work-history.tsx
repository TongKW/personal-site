export function WorkHistorySheetContent({
  goal,
}: {
  goal: ExpandableGoal | UnitGoal;
}) {
  // return <p>{JSON.stringify(goal)}</p>;
  if (goal.type === "UnitGoal") {
    return (
      <div className="flex flex-col">
        <span>{`all work under `}</span>
        <span className="font-medium">{goal.item.title}</span>
      </div>
    );
  }
  return (
    <div className="flex flex-col">
      <p>
        <span>{`all work under `}</span>
        <span className="font-medium">{goal.goal.title}</span>
      </p>
    </div>
  );
}
