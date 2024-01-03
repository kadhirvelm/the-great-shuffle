import { PushBack } from "@tower/api";
import { DisplayStats } from "../display/DisplayStats";
import { Player } from "../player/Player";
import { MonsterStatsHandler } from "./MonsterStatsHandler";
import { MonsterTypeHandler, MonsterTypes } from "./MonsterType";
import { StatusEffectHandler } from "../statusEffect/MonsterStatusEffectHandler";

export interface MonsterInteraction {
  player: Player;
}

export class Monster extends Phaser.GameObjects.Sprite {
  public typedBody: Phaser.Physics.Arcade.Body;
  public displayStats: DisplayStats;

  public monsterTypeHandler: MonsterTypeHandler;
  public monsterStatsHandler: MonsterStatsHandler;
  public statusEffectHandler: StatusEffectHandler;

  public auraAttackTracker: { [auraAttackId: string]: number } = {};
  public swordAttackTracker: { [swordAttackId: string]: true } = {};
  public spearAttackTracker: { [spearAttackId: string]: true } = {};
  public rodAttackTracker: { [rodAttackId: string]: true } = {};

  public isBeingPushed: boolean = false;

  public damageEvent:
    | {
        flash: Phaser.Time.TimerEvent;
        timer: Phaser.Time.TimerEvent;
      }
    | undefined;

  public constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    public monsterType: MonsterTypes,
    public monsterInteractions: MonsterInteraction,
  ) {
    super(scene, x, y, monsterType);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.typedBody = this.body as Phaser.Physics.Arcade.Body;

    this.monsterTypeHandler = new MonsterTypeHandler(scene, this);
    this.monsterStatsHandler = new MonsterStatsHandler(this);
    this.statusEffectHandler = new StatusEffectHandler(
      this.scene,
      this.monsterStatsHandler,
    );

    this.displayStats = new DisplayStats(this, {
      health: this.monsterStatsHandler.stats.vitality.health,
    });

    this.initializePhysics();
    this.initializeSize();
  }

  private initializePhysics() {
    this.typedBody.setBounce(0.2);
    this.typedBody.setCollideWorldBounds(true);
  }

  private initializeSize() {
    switch (this.monsterType) {
      case "level_1":
        this.setScale(0.25);
        break;
      case "level_2":
        this.setScale(1);
        break;
      case "level_3":
        this.setScale(2);
        break;
    }
  }

  public update() {
    this.displayStats.update();
    this.statusEffectHandler.update();

    if (!this.isAlive()) {
      this.typedBody.setVelocity(0, 0);
      return;
    }

    if (this.isBeingPushed) {
      return;
    }

    this.monsterTypeHandler.attackPattern();
  }

  public takeDamage(
    damage: number,
    {
      auraAttackId,
      swordAttackId,
      spearAttackId,
      rodAttackId,
    }: {
      auraAttackId?: string;
      swordAttackId?: string;
      spearAttackId?: string;
      rodAttackId?: string;
    },
  ) {
    if (auraAttackId !== undefined) {
      this.auraAttackTracker[auraAttackId] = this.scene.time.now;
    }

    if (swordAttackId !== undefined) {
      this.swordAttackTracker[swordAttackId] = true;
    }

    if (spearAttackId !== undefined) {
      this.spearAttackTracker[spearAttackId] = true;
    }

    if (rodAttackId !== undefined) {
      this.rodAttackTracker[rodAttackId] = true;
    }

    this.monsterStatsHandler.takeDamage(damage);
  }

  public flashOrDestroy() {
    if (!this.monsterStatsHandler.isAlive()) {
      return this.fadeOutAndDestroy();
    }

    this.flashDamage();
  }

  private flashDamage() {
    if (this.damageEvent !== undefined) {
      this.damageEvent.flash.remove();
      this.damageEvent.timer.remove();
    }

    const flashDuration = 200;
    const flash = this.scene.time.addEvent({
      delay: flashDuration,
      repeat: 3,
      callback: () => {
        if (this.tint === 0xff0000) {
          this.clearTint();
        } else {
          this.setTint(0xff0000);
        }
      },
    });

    const timer = this.scene.time.delayedCall(flashDuration * 4, () => {
      flash.remove();
      this.setAlpha(1);
      this.clearTint();
      this.damageEvent = undefined;
    });

    this.damageEvent = { flash, timer };
  }

  private fadeOutAndDestroy() {
    const delay = 100;
    const fadeDuration = 700;

    const fadeEvent = this.scene.time.addEvent({
      delay: delay,
      repeat: fadeDuration / delay - 1,
      callback: () => {
        this.setAlpha(this.alpha - 1 / (fadeDuration / delay));
      },
    });

    this.scene.time.delayedCall(fadeDuration, () => {
      fadeEvent.remove();
      this.destroy();
    });
  }

  public isAlive() {
    return this.monsterStatsHandler.isAlive();
  }

  public canTakeDamageFromAuraAttack(auraAttackId: string) {
    const maybeExistingAttack = this.auraAttackTracker[auraAttackId];
    if (maybeExistingAttack === undefined) {
      return true;
    }

    return this.scene.time.now - maybeExistingAttack > 300;
  }

  public canTakeDamageFromSwordAttack(swordAttackId: string) {
    return this.swordAttackTracker[swordAttackId] === undefined;
  }

  public canTakeDamageFromSpearAttack(spearAttackId: string) {
    return this.spearAttackTracker[spearAttackId] === undefined;
  }

  public canTakeDamageFromRodAttack(rodAttackId: string) {
    return this.rodAttackTracker[rodAttackId] === undefined;
  }

  public pushBack(
    { duration, velocity }: PushBack,
    { x, y }: { x: number; y: number },
  ) {
    if (duration === 0 || velocity === 0) {
      return;
    }

    this.isBeingPushed = true;

    const direction = new Phaser.Math.Vector2(
      this.x - x,
      this.y - y,
    ).normalize();

    const { finalDuration, finalVelocity } = this.monsterStatsHandler.knockBack(
      { duration, velocity },
    );

    this.typedBody.setVelocityX(direction.x * finalVelocity);

    this.scene.time.delayedCall(finalDuration, () => {
      this.isBeingPushed = false;
    });
  }
}
