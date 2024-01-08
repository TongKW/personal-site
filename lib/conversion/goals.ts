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

export interface MinGoalNode {
  id: string;
  children: string[]; // Array of goalId
}

export const getMinGoalTree = (goals: Goal[]): MinGoalNode[] => {
  const minGoalNodes: { [key: string]: MinGoalNode } = {};

  // Create nodes for each goal
  goals.forEach((goal) => {
    minGoalNodes[goal.id] = { id: goal.id, children: [] };
  });

  // Populate children for each node
  goals.forEach((goal) => {
    if (!goal.isRoot) {
      const parentNode = minGoalNodes[goal.parentGoalId];
      if (parentNode) {
        parentNode.children.push(goal.id);
      }
    }
  });

  // Return only root nodes as they contain all children recursively
  return goals
    .filter((goal) => goal.isRoot)
    .map((goal) => minGoalNodes[goal.id]);
};

export const findMinGoalNode = (
  tree: MinGoalNode[],
  goalId: string
): MinGoalNode | null => {
  for (const node of tree) {
    if (node.id === goalId) {
      return node;
    }
    const childNode = findMinGoalNode(
      node.children.map((id) => ({ id, children: [] })),
      goalId
    );
    if (childNode) {
      return childNode;
    }
  }
  return null;
};

export const isIdUnderGoalNode = (
  node: MinGoalNode,
  goalId: string
): boolean => {
  if (node.id === goalId) {
    return true;
  }
  for (const childId of node.children) {
    if (isIdUnderGoalNode({ id: childId, children: [] }, goalId)) {
      return true;
    }
  }
  return false;
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
