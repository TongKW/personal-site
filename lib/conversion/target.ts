import {
  MinGoalNode,
  dbGoalToGoal,
  findMinGoalNode,
  isIdUnderGoalNode,
} from "./goals";

export const dbTargetsToTargets = (dbTargets: any[]): Target[] => {
  return dbTargets.map((dbTarget) => {
    // TODO: finish the following
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
  goalTree: MinGoalNode[];
  works: Work[];
}): number => {
  const { target, rule, goalTree, works } = args;
  let total = 0;

  for (const work of works) {
    const workingGoal = findMinGoalNode(goalTree, target.goal.id);
    if (!workingGoal) continue;
    const isTarget = isIdUnderGoalNode(workingGoal, work.item.parentGoalId);
    if (!isTarget) continue;
    total += rule.hourWork * work.duration;
    total += rule.finishItem * (work.isFinishing ? 1 : 0);
  }

  return total;
};

export const targetToProgressItem = (args: {
  target: Target;
  rule: TargetRule;
  goalTree: MinGoalNode[];
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
  goalTree: MinGoalNode[];
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
  let total = 0;
  for (const item of items) {
    total += Math.min(1, item.current / item.target);
  }
  return total / items.length;
};
