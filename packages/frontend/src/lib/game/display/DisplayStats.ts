import { difference, range } from "lodash-es";
import { MonsterStatsHandler } from "../monster/MonsterStatsHandler";

interface SingleStat {
  current: number;
  max: number;
}

export interface DisplayedStats {
  health: SingleStat;
}

const green = 0x3d7c47;
const yellow = 0xfbf579;
const red = 0xcd5554;

const HEALTH_BAR_SIZE = 75;

export class DisplayStats {
  private healthBar: Phaser.GameObjects.Graphics;
  private statusEffectContainer: Phaser.GameObjects.Container;

  private drawnStatusEffects: {
    [effectName: string]: Phaser.GameObjects.Image;
  } = {};

  public constructor(
    private rootSprite: Phaser.GameObjects.Sprite,
    private monsterStatsHandler: MonsterStatsHandler,
  ) {
    this.healthBar = this.rootSprite.scene.add.graphics();

    this.statusEffectContainer = this.rootSprite.scene.add.container(0, 0);
  }

  public update() {
    const centerX = this.rootSprite.x - HEALTH_BAR_SIZE / 2;
    const bottomY =
      this.rootSprite.y +
      (this.rootSprite.height * this.rootSprite.scaleY) / 1.8;

    this.drawHealthBar(centerX, bottomY);

    this.updateStatusEffects();
    this.drawStatusEffects(centerX, bottomY + 20);
  }

  private drawHealthBar(x: number, y: number) {
    const currentHealth =
      this.monsterStatsHandler.stats.vitality.health.current;
    const maxHealth = this.monsterStatsHandler.stats.vitality.health.max;

    this.healthBar.clear();
    this.setHealthBarColor(currentHealth / maxHealth);

    this.healthBar.fillRect(
      x,
      y,
      Math.round((currentHealth / maxHealth) * HEALTH_BAR_SIZE),
      10,
    );
  }

  private setHealthBarColor(healthPercentage: number) {
    if (healthPercentage >= 0.75) {
      this.healthBar.fillStyle(green, 1);
    } else if (healthPercentage >= 0.25) {
      this.healthBar.fillStyle(yellow, 1);
    } else {
      this.healthBar.fillStyle(red, 1);
    }
  }

  private updateStatusEffects() {
    const areNewEffects = this.updateNewEffects();
    const areRemovedEffects = this.updateRemovedEffects();

    if (!areNewEffects && !areRemovedEffects) {
      return;
    }

    this.updateEffectPositions();
  }

  private updateNewEffects() {
    const statusEffects = this.monsterStatsHandler.affectedStats;
    const effects = Object.keys(statusEffects);

    if (effects.length === 0) {
      return;
    }

    let haveStatusesChanged = false;

    for (const effect of effects) {
      if (this.drawnStatusEffects[effect] !== undefined) {
        continue;
      }

      haveStatusesChanged = true;

      const onGoingEffect = this.monsterStatsHandler.affectedStats[effect];
      const newEffect = this.rootSprite.scene.add.image(
        0,
        0,
        onGoingEffect.statusEffect.effectAsset,
      );
      newEffect.setScale(0.1);
      this.drawnStatusEffects[effect] = newEffect;
      this.statusEffectContainer.add(newEffect);
    }

    return haveStatusesChanged;
  }

  private updateRemovedEffects() {
    const statusEffects = this.monsterStatsHandler.affectedStats;
    const effects = Object.keys(statusEffects);

    const removedStatuses = difference(
      Object.keys(this.drawnStatusEffects),
      effects,
    );

    for (const removedStatus of removedStatuses) {
      this.drawnStatusEffects[removedStatus].destroy();
      this.statusEffectContainer.remove(this.drawnStatusEffects[removedStatus]);
      delete this.drawnStatusEffects[removedStatus];
    }

    return removedStatuses.length > 0;
  }

  private updateEffectPositions() {
    const displayedEffects = Object.keys(this.drawnStatusEffects);
    for (const index of range(0, displayedEffects.length)) {
      const drawnEffect = displayedEffects[index];
      this.drawnStatusEffects[drawnEffect].x = index * 20;
    }
  }

  private drawStatusEffects(x: number, y: number) {
    this.statusEffectContainer.setPosition(x, y);
  }
}
