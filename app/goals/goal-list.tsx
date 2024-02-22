"use client";

import React, { useState } from "react";
import { AddItemDialogButton } from "./add-item-dialog";
import { TriangleRightIcon, TriangleDownIcon } from "@radix-ui/react-icons";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { WorkHistorySheetContent } from "@/components/work-history";

export function GoalList(props: {
  userId?: string;
  goals: Array<ExpandableGoal | UnitGoal>;
  readOnly?: boolean;
  depth?: number;
}) {
  const { goals, userId, readOnly = true, depth = 0 } = props;

  return (
    <div className="flex flex-col w-full group gap-4">
      {goals.map((goal) => (
        <ContextMenu
          key={goal.type === "ExpandableGoal" ? goal.goal.id : goal.item.id}
        >
          <ContextMenuTrigger className="flex w-full">
            {goal.type === "ExpandableGoal" ? (
              <ExpandableGoalItem
                data={goal}
                readOnly={readOnly}
                userId={userId}
                depth={depth}
              />
            ) : (
              <UnitGoalItem key={goal.item.id} data={goal} />
            )}
          </ContextMenuTrigger>
          <MenuContent goal={goal} />
        </ContextMenu>
      ))}
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
      className={`z-${depth} w-full relative shadow-md border px-3 py-2 rounded ${
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
        className="flexjustify-between items-center"
        onClick={toggleExpand}
        role="button"
        tabIndex={0}
      >
        <span>{data.goal.title}</span>
        {data.children.length ? (
          <span>
            {isExpanded ? <TriangleDownIcon /> : <TriangleRightIcon />}
          </span>
        ) : (
          <></>
        )}
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
    <div className={`border w-full p-2 shadow-inner rounded ${itemStyle}`}>
      <div className="flex justify-between items-center">
        <span>{data.item.title}</span>
        <span>{data.item.finished ? "" : "In progress"}</span>
      </div>
    </div>
  );
}

function MenuContent({ goal }: { goal: ExpandableGoal | UnitGoal }) {
  const [sheetOpen, setSheetOpen] = useState(false);
  console.log(`sheetOpen = ${sheetOpen}`);
  const onExpand = (goal: ExpandableGoal | UnitGoal) => {
    console.log(goal);
  };
  const onShowWorkHistory = (goal: ExpandableGoal | UnitGoal) => {
    console.log(goal);
  };

  return (
    <>
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="bg-white z-[999]">
          <WorkHistorySheetContent goal={goal} />
        </SheetContent>
      </Sheet>
      <ContextMenuContent className="w-60 bg-white z-[999]">
        <ContextMenuItem
          onClick={() => {
            onShowWorkHistory(goal);
            setSheetOpen(true);
          }}
        >
          Show Work History
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onExpand(goal)}>
          Expand All
        </ContextMenuItem>
      </ContextMenuContent>
    </>
  );
}
