import {
  DEFAULT_MONSTER_STATS,
  MonsterStats,
  OngoingStatusEffect,
  PushBack,
  RecursivePartial,
} from "@tower/api";
import { Monster } from "./Monster";
import { cloneDeep, compact } from "lodash-es";

export interface AffectedStats {
  [statusEffectName: string]: {
    deltaInStats: RecursivePartial<MonsterStats>;
    statusEffect: OngoingStatusEffect;
  };
}

export class MonsterStatsHandler {
  public stats: MonsterStats;
  public affectedStats: AffectedStats = {};

  public constructor(private monster: Monster) {
    this.stats = cloneDeep(this.monster.monsterTypeHandler.getBaseStats());
  }

  public takeDamage(damage: number) {
    const finalDamage =
      damage * (1 - this.stats.defensiveAttributes.defense / 100);
    this.stats.vitality.health.current = Math.max(
      this.stats.vitality.health.current - finalDamage,
      0,
    );

    this.monster.flashOrDestroy();
  }

  public isAlive() {
    return this.stats.vitality.health.current > 0;
  }

  public knockBack({ duration, velocity }: PushBack) {
    const finalDefense = Math.min(
      this.stats.defensiveAttributes.defense -
        this._getDeltaInStats("defensiveAttributes").defense,
      0,
    );
    const finalDuration = (duration * finalDefense) / 100;
    const finalVelocity = (velocity * finalDefense) / 100;

    return { finalDuration, finalVelocity };
  }

  public getCollisionStrength() {
    return Math.min(
      this.stats.offensiveAttributes.collisionStrength -
        this._getDeltaInStats("offensiveAttributes").collisionStrength,
      0,
    );
  }

  public getSpeedX() {
    return Math.min(
      this.stats.defensiveAttributes.speed -
        this._getDeltaInStats("defensiveAttributes").speed,
      0,
    );
  }

  public getSpeedY() {
    return (
      this.stats.defensiveAttributes.jump -
        this._getDeltaInStats("defensiveAttributes").jump,
      0
    );
  }

  public getAggroRange() {
    return (
      this.stats.offensiveAttributes.aggroRange -
        this._getDeltaInStats("offensiveAttributes").aggroRange,
      0
    );
  }

  public applyStatusEffect(statusEffect: OngoingStatusEffect) {
    const deltaInStats = statusEffect.application.effect(this, statusEffect);

    if (deltaInStats.vitality?.health?.current !== undefined) {
      this.takeDamage(deltaInStats.vitality.health.current);
    }

    this.affectedStats[statusEffect.name] = { deltaInStats, statusEffect };
  }

  public removeStatusEffect(statusEffect: OngoingStatusEffect) {
    delete this.affectedStats[statusEffect.name];
  }

  public _getDeltaInStats<Key extends keyof MonsterStats>(
    key: Key,
  ): MonsterStats[Key] {
    const defaultStatsForKey = cloneDeep(DEFAULT_MONSTER_STATS[key]);
    const allRelevantValues = compact(
      Object.values(this.affectedStats).map((stats) => stats.deltaInStats[key]),
    );

    for (const relevantValues of allRelevantValues) {
      for (const key of Object.keys(relevantValues ?? {})) {
        (defaultStatsForKey as any)[key] +=
          (relevantValues as any | undefined)?.[key as any] ?? 0;
      }
    }

    return defaultStatsForKey;
  }
}
