import { GoalNode, dbGoalToGoal, findGoalNode } from "./goals";

export const dbTargetsToTargets = (dbTargets: any[]): Target[] => {
  return dbTargets.map((dbTarget) => {
    return {
      id: dbTarget.id,
      goal: dbGoalToGoal(dbTarget.goal),
      target: dbTarget.target,
      interval: dbTarget.interval,
    };
  });
};

export const dbTargetRuleToLocal = (dbRule: any): TargetRule => {
  return {
    finishItem: dbRule.finish_item,
    hourWork: dbRule.hr_rule,
  };
};

const getWorkScore = (args: {
  target: Target;
  rule: TargetRule;
  goalTree: GoalNode[];
  works: Work[];
}): number => {
  const { target, rule, goalTree, works } = args;
  let total = 0;

  for (const work of works) {
    const workingGoal = findGoalNode(goalTree, target.goal.id);
    if (!workingGoal) continue;

    const targetNode = findGoalNode([workingGoal], work.item.parentGoalId);
    if (!targetNode) continue;

    total += (rule.hourWork * work.duration) / 60;
    total += rule.finishItem * (work.isFinished ? 1 : 0);
  }

  return total;
};

export const targetToProgressItem = (args: {
  target: Target;
  rule: TargetRule;
  goalTree: GoalNode[];
  works: Work[];
}): ProgressItem => {
  const { target } = args;
  return {
    title: target.goal.title,
    current: getWorkScore(args),
    target: target.target,
  };
};

export const targetsToProgressItems = (args: {
  targets: Target[];
  rule: TargetRule;
  goalTree: GoalNode[];
  works: Work[];
}): ProgressItem[] => {
  const { targets, rule, goalTree, works } = args;
  return targets.map((target) =>
    targetToProgressItem({
      target,
      rule,
      goalTree,
      works,
    })
  );
};

export const progressItemsToProgress = (items: ProgressItem[]) => {
  let current = 0;
  let target = 0;
  for (const item of items) {
    current += Math.min(1, item.current / item.target) * item.target;
    target += item.target;
  }
  return current / target;
};
