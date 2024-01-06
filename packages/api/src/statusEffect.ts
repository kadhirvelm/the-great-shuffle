import { RecursivePartial } from "./generics";
import { MonsterStats, MonsterStatsHandler } from "./monsterStats";

export interface StackingEffect {
  effect: (
    currentMonsterStats: MonsterStatsHandler,
    effect: StatusEffect & Pick<OngoingStatusEffect, "stacks">,
  ) => RecursivePartial<MonsterStats>;
  type: "stacking";
}

export interface NonStackingEffect {
  effect: (
    currentMonsterStats: MonsterStatsHandler,
    effect: StatusEffect,
  ) => RecursivePartial<MonsterStats>;
  type: "non-stacking";
}

export type ApplicationEffect = StackingEffect | NonStackingEffect;

export const isStackingEffect = (
  applicationEffect: ApplicationEffect,
): applicationEffect is StackingEffect => {
  return applicationEffect.type === "stacking";
};

export const isNonStackingEffect = (
  applicationEffect: ApplicationEffect,
): applicationEffect is NonStackingEffect => {
  return applicationEffect.type === "non-stacking";
};

export interface StatusEffect {
  name: string;
  description: string;
  duration: number;
  appliesEvery: number;
  application: ApplicationEffect;
  effectAsset: string;
}

export interface OngoingStatusEffect extends StatusEffect {
  startTime: number;
  lastAppliedAt: number | undefined;
  stacks: number;
}

export interface OngoingStatusEffects {
  [statusEffectName: string]: OngoingStatusEffect;
}
