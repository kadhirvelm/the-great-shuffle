import { PushBack } from "./generics";
import { OngoingStatusEffect } from "./statusEffect";

export interface MonsterStats {
  vitality: {
    health: {
      current: number;
      max: number;
    };
  };
  offensiveAttributes: {
    collisionStrength: number;
    aggroRange: number;
  };
  defensiveAttributes: {
    defense: number;
    speed: number;
    jump: number;
    resistance: number;
  };
}

export const DEFAULT_MONSTER_STATS: MonsterStats = {
  vitality: {
    health: {
      current: 0,
      max: 0,
    },
  },
  offensiveAttributes: {
    collisionStrength: 0,
    aggroRange: 0,
  },
  defensiveAttributes: {
    defense: 0,
    speed: 0,
    jump: 0,
    resistance: 0,
  },
};

export interface MonsterStatsHandler {
  stats: MonsterStats;
  takeDamage: (damage: number) => void;
  isAlive: () => boolean;
  knockBack: (pushBack: PushBack) => {
    finalDuration: number;
    finalVelocity: number;
  };
  getCollisionStrength: () => number;
  getSpeedX: () => number;
  getSpeedY: () => number;
  getAggroRange: () => number;
  applyStatusEffect: (statusEffect: OngoingStatusEffect) => void;
  removeStatusEffect: (statusEffect: OngoingStatusEffect) => void;
}
