"use client";

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
  userId?: string;
  goals: Array<ExpandableGoal | UnitGoal>;
  readOnly?: boolean;
  depth?: number;
}) {
  const { goals, userId, readOnly = true, depth = 0 } = props;

  return (
    <div className="flex flex-col w-full group">
      {goals.map((goal) =>
        goal.type === "ExpandableGoal" ? (
          <ExpandableGoalItem
            key={goal.goal.id}
            data={goal}
            readOnly={readOnly}
            userId={userId}
            depth={depth}
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
  userId?: string;
  depth?: number;
}) {
  const { data, readOnly = true, userId, depth = 0 } = props;
  const [isExpanded, setIsExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`z-${depth} relative shadow-md border px-3 py-2 mb-4 rounded ${
        hovered ? "border-gray-400" : ""
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {!readOnly && (
        <div
          className={`z-${depth} absolute -translate-x-20 flex items-center justify-center top-0 left-0 h-20 w-20 z-10 opacity-0 ${
            hovered ? "opacity-100" : ""
          }`}
        >
          <AddItemDialogButton
            goalId={data.goal.id}
            goalTitle={data.goal.title}
            defaultDeadline={data.goal.deadline}
            userId={userId}
          />
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

      {isExpanded && (
        <GoalList
          key={data.goal.id}
          readOnly={readOnly}
          userId={userId}
          goals={data.children}
          depth={depth + 1}
        />
      )}
    </div>
  );
}

export function UnitGoalItem(props: { data: UnitGoal }) {
  const { data } = props;

  const itemStyle = data.item.finished ? "bg-green-200" : "bg-gray-200";

  return (
    <div className={`border p-2 mb-2 shadow-inner rounded ${itemStyle}`}>
      <div className="flex justify-between items-center">
        <span>{data.item.title}</span>
        <span>{data.item.finished ? "" : "In progress"}</span>
      </div>
    </div>
  );
}
