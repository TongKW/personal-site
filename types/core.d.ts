type TimeInterval = "day" | "week" | "month" | "year";

interface Goal {
  type: "Goal";
  id: string;
  title: string;
  recurrent?: boolean;
  recurrentInterval?: string;
  recurrentFreq?: number;
  isRoot: boolean;
  parentGoalId: string;
  deadline?: number; // timestamp
}

interface GoalItem {
  type: "GoalItem";
  id: string;
  parentGoalId: string;
  parentGoalTitle?: string;
  finished: boolean;
  deadline: number; // timestamp
  title: string;
}

// UI interface for Goal
interface ExpandableGoal {
  type: "ExpandableGoal";
  goal: Goal;
  progress: number;
  children: Array<ExpandableGoal | UnitGoal>;
  parent?: ExpandableGoal;
}

// UI interface for GoalItem
interface UnitGoal {
  type: "UnitGoal";
  item: GoalItem;
  // parent?: ExpandableGoal;
  progress: number;
}

interface Work {
  id: string;
  duration: number;
  title: string;
  item: GoalItem;
  createdAt: number; // timestamp
  isFinished?: boolean;
}

// UI interface for Work progress
interface WorkProgress {
  type: "idle" | "loading" | "ready";
  progress?: number;
}

interface ProgressItem {
  title: string; // Title of the goal attached to a target
  target: number; // the target score of the target
  current: number; // current score to the target
}

interface WorkTimer {
  work: Work;
  goal: Goal;
  duration: number;
  fastForward?: boolean;
}
interface Target {
  id: string;
  goal: Goal;
  target: number;
  interval: TimeInterval;
}

interface TargetRule {
  finishItem: number;
  hourWork: number;
  consistency?: number;
}
