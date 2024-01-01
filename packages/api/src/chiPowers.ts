import { PushBack, RecursivePartial } from "./generics";
import { PlayerStats } from "./playerStats";

export type ChiPower = "aura" | "ranged" | "enforcement";

export type ChiLevel = "1" | "2" | "3";

interface BasePlayerChiPower {
  name: string;
  chiElement: string;
  level: ChiLevel;
  type: ChiPower;
}

export const isAura = (
  playerChiPower: PlayerChiPower,
): playerChiPower is AuraChiPower => {
  return playerChiPower.type === "aura";
};

export const isRanged = (
  playerChiPower: PlayerChiPower,
): playerChiPower is RangedChiPower => {
  return playerChiPower.type === "ranged";
};

export const isEnforcement = (
  playerChiPower: PlayerChiPower,
): playerChiPower is EnforcementChiPower => {
  return playerChiPower.type === "enforcement";
};

export interface AuraAttackAttributes {
  damage: number;
  duration: number;
  scale: number;
  pushBack: PushBack;
}

export interface AuraChiPower extends BasePlayerChiPower {
  attributes: AuraAttackAttributes;
  type: "aura";
}

export interface RangedAttackAttributes {
  damage: number;
  range: number;
  velocity: number;
  pushBack: PushBack;
}

export interface RangedChiPower extends BasePlayerChiPower {
  attributes: RangedAttackAttributes;
  type: "ranged";
}

export interface EnforcementAttributes {
  duration: number;
  enforcement: RecursivePartial<PlayerStats>;
}

export interface EnforcementChiPower extends BasePlayerChiPower {
  attributes: EnforcementAttributes;
  type: "enforcement";
}

export type PlayerChiPower =
  | AuraChiPower
  | RangedChiPower
  | EnforcementChiPower;
