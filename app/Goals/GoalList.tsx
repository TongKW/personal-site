"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AddItemDialogButton } from "./AddItemDialog";

export interface ExpandableGoal {
  type: "ExpandableGoal";
  goal: Goal;
  progress: number;
  children: Array<ExpandableGoal | UnitGoal>;
  parent?: ExpandableGoal;
}

export interface UnitGoal {
  type: "UnitGoal";
  item: GoalItem;
  // parent?: ExpandableGoal;
  progress: number;
}

export function GoalList(props: {
  goals: Array<ExpandableGoal | UnitGoal>;
  readOnly?: boolean;
}) {
  const { goals, readOnly = true } = props;

  return (
    <div className="flex flex-col w-full">
      {goals.map((goal) =>
        goal.type === "ExpandableGoal" ? (
          <ExpandableGoalItem
            key={goal.goal.id}
            data={goal}
            readOnly={readOnly}
          />
        ) : (
          <UnitGoalItem key={goal.item.id} data={goal} />
        )
      )}
    </div>
  );
}

export function ExpandableGoalItem(props: {
  data: ExpandableGoal;
  readOnly?: boolean;
}) {
  const { data, readOnly = true } = props;
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="relative border px-3 py-2 mb-2 rounded group">
      {!readOnly && (
        <div className="absolute -translate-x-20 flex items-center justify-center top-0 left-0 h-20 w-20 z-10 opacity-0 group-hover:opacity-100">
          <AddItemDialogButton goalId={data.goal.id} />
        </div>
      )}
      <div
        className="flex mb-2 justify-between items-center"
        onClick={toggleExpand}
        role="button"
        tabIndex={0}
      >
        <span>{data.goal.title}</span>
        {data.children.length ? <span>{isExpanded ? "▼" : "►"}</span> : <></>}
      </div>

      <div className="w-full mb-4 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div
          className="bg-green-600 h-2.5 rounded-full"
          style={{ width: `${data.progress * 100}%` }}
        />
      </div>

      {isExpanded && <GoalList goals={data.children} />}
    </div>
  );
}

export function UnitGoalItem(props: { data: UnitGoal }) {
  const { data } = props;

  const itemStyle = data.item.finished ? "bg-green-200" : "bg-gray-200";

  return (
    <div className={`border p-2 mb-2 rounded ${itemStyle}`}>
      <div className="flex justify-between items-center">
        <span>{data.item.title}</span>
        <span>{data.item.finished ? "Done" : "Pending"}</span>
      </div>
    </div>
  );
}
