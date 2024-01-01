import { MonsterStats, PushBack } from "@tower/api";
import { Monster } from "./Monster";

export class MonsterStatsHandler {
  public stats: MonsterStats;

  public constructor(private monster: Monster) {
    this.stats = this.monster.monsterTypeHandler.getBaseStats();
  }

  public takeDamage(damage: number) {
    const finalDamage =
      damage * (1 - this.stats.defensiveAttributes.defense / 100);
    this.stats.vitality.health.current = Math.max(
      this.stats.vitality.health.current - finalDamage,
      0,
    );
  }

  public isAlive() {
    return this.stats.vitality.health.current > 0;
  }

  public knockBack({ duration, velocity }: PushBack) {
    const finalDuration =
      (duration * this.stats.defensiveAttributes.defense) / 100;
    const finalVelocity =
      (velocity * this.stats.defensiveAttributes.defense) / 100;

    return { finalDuration, finalVelocity };
  }

  public getCollisionStrength() {
    return this.stats.offensiveAttributes.collisionStrength;
  }

  public getSpeedX() {
    return this.stats.defensiveAttributes.speed;
  }

  public getSpeedY() {
    return this.stats.defensiveAttributes.jump;
  }

  public getAggroRange() {
    return this.stats.offensiveAttributes.aggroRange;
  }
}
