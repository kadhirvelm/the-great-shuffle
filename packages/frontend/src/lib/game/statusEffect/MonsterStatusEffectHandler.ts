import {
  OngoingStatusEffects,
  StatusEffect,
  isStackingEffect,
} from "@tower/api";
import { MonsterStatsHandler } from "../monster/MonsterStatsHandler";

export class StatusEffectHandler {
  public currentStatusEffects: OngoingStatusEffects = {};

  public constructor(
    private scene: Phaser.Scene,
    private monsterStatsHandler: MonsterStatsHandler,
  ) {}

  public applyStatusEffect(statusEffect: StatusEffect) {
    const currentStatusEffect = this.currentStatusEffects[statusEffect.name];
    if (currentStatusEffect === undefined) {
      this.currentStatusEffects[statusEffect.name] = {
        ...statusEffect,
        startTime: this.scene.time.now,
        lastAppliedAt: this.scene.time.now,
        stacks: 1,
      };
      return;
    }

    currentStatusEffect.startTime = this.scene.time.now;
    currentStatusEffect.lastAppliedAt = this.scene.time.now;

    if (isStackingEffect(currentStatusEffect.application)) {
      currentStatusEffect.stacks += 1;
    }

    this.monsterStatsHandler.applyStatusEffect(currentStatusEffect);
  }

  public update() {
    Object.values(this.currentStatusEffects).forEach((statusEffect) => {
      if (
        statusEffect.lastAppliedAt === undefined ||
        statusEffect.lastAppliedAt + statusEffect.appliesEvery <
          this.scene.time.now
      ) {
        this.monsterStatsHandler.applyStatusEffect(statusEffect);
        statusEffect.lastAppliedAt = this.scene.time.now;
      }

      if (
        statusEffect.startTime + statusEffect.duration <
        this.scene.time.now
      ) {
        this.monsterStatsHandler.removeStatusEffect(statusEffect);
        delete this.currentStatusEffects[statusEffect.name];
      }
    });
  }
}
