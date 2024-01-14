// Conversion function
export const convertGoalsToExpandableGoals = (
  goals: Goal[],
  items: GoalItem[],
  parentId: string = ""
): Array<ExpandableGoal> => {
  return goals
    .filter((goal) => goal.parentGoalId === parentId)
    .map((goal) => {
      const childGoals = convertGoalsToExpandableGoals(goals, items, goal.id);
      const childItems = items
        .filter((item) => item.parentGoalId === goal.id)
        .map((item) => {
          return {
            type: "UnitGoal",
            progress: item.finished ? 1 : 0,
            item,
          } as UnitGoal;
        });

      let progress = 0;
      if (childGoals.length + childItems.length !== 0) {
        let progressSum = 0;
        for (const goal of childGoals) {
          progressSum += goal.progress;
        }
        for (const item of childItems) {
          progressSum += item.progress;
        }
        progress = progressSum / (childGoals.length + childItems.length);
      }

      return {
        type: "ExpandableGoal",
        goal: goal,
        progress: progress,
        children: [...childGoals, ...childItems] as Array<
          ExpandableGoal | UnitGoal
        >,
      } as ExpandableGoal;
    });
};

export interface GoalNode {
  id: string;
  children: GoalNode[]; // Array of goalId
}

// interface Goal {
//   type: "Goal";
//   id: string;
//   title: string;
//   recurrent?: boolean;
//   recurrentInterval?: string;
//   recurrentFreq?: number;
//   isRoot: boolean;
//   parentGoalId: string;
//   deadline?: number; // timestamp
// }

export const getGoalTree = (goals: Goal[]): GoalNode[] => {
  const goalNodes: { [key: string]: GoalNode } = {};
  const rootNodes: GoalNode[] = [];

  // First pass: create a node for each goal
  goals.forEach((goal) => {
    goalNodes[goal.id] = { id: goal.id, children: [] };
  });

  // Second pass: construct the tree
  goals.forEach((goal) => {
    if (goal.isRoot) {
      rootNodes.push(goalNodes[goal.id]);
    } else {
      const parentNode = goalNodes[goal.parentGoalId];
      if (parentNode) {
        parentNode.children.push(goalNodes[goal.id]);
      } else {
        // Handle the case where the parent goal does not exist in the input array
        // Depending on the use case, you might want to throw an error,
        // ignore the orphaned node, or handle it in some other way
        console.error(
          `Parent goal with ID ${goal.parentGoalId} not found for goal with ID ${goal.id}`
        );
      }
    }
  });
  return rootNodes;
};

export const findGoalNode = (
  tree: GoalNode[],
  goalId: string
): GoalNode | null => {
  let result: GoalNode | null = null;

  // Recursive function to search through the tree
  const searchTree = (nodes: GoalNode[]) => {
    for (const node of nodes) {
      if (node.id === goalId) {
        result = node;
        return; // Node found, finish search
      }
      if (node.children.length) {
        searchTree(node.children); // Search recursively in children
        if (result) return; // If the node was found in the subtree, finish search
      }
    }
  };

  searchTree(tree); // Start the search
  return result;
};

export const dbGoalToGoal = (dbGoal: any): Goal => {
  return {
    type: "Goal",
    id: dbGoal.id,
    title: dbGoal.title,
    recurrent: dbGoal.recurrent,
    recurrentInterval: dbGoal.recurrent_interval
      ? dbGoal.recurrent_interval
      : undefined,
    recurrentFreq: dbGoal.recurrent_freq ? dbGoal.recurrent_freq : undefined,
    isRoot: dbGoal.is_root,
    parentGoalId: dbGoal.parent_goal_id ? dbGoal.parent_goal_id : "",
    deadline: dbGoal.deadline
      ? new Date(dbGoal.deadline).getTime()
      : dbGoal.deadline,
  };
};

export const dbGoalsToGoals = (dbGoals: any[]): Goal[] => {
  return dbGoals.map((dbGoal) => dbGoalToGoal(dbGoal));
};

export const dbItemsToItems = (dbItems: any[]): GoalItem[] => {
  return dbItems.map((dbItem) => {
    return {
      type: "GoalItem",
      id: dbItem.id,
      title: dbItem.title,
      finished: dbItem.finished,
      deadline: dbItem.deadline
        ? new Date(dbItem.deadline).getTime()
        : dbItem.deadline,
      parentGoalId: dbItem.goal_id,
    };
  });
};
