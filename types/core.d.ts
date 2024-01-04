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
  finished: boolean;
  deadline: number; // timestamp
  title: string;
}

interface Work {
  id: string;
  duration: number;
  title: string;
  itemId: string;
  createdAt: number; // timestamp
}