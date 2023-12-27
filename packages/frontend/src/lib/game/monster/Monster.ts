import { Player } from "../player/Player";
import { AllMonsterStats, MonsterStats } from "./MonsterStats";
import { MonsterTypeHandler, MonsterTypes } from "./MonsterType";

export interface MonsterInteraction {
  player: Player;
}

export interface PushBack {
  velocity: number;
  duration: number;
}

export class Monster extends Phaser.GameObjects.Sprite {
  public typedBody: Phaser.Physics.Arcade.Body;
  public stats: AllMonsterStats = {
    damage: 20,
    health: { current: 100, max: 100 },
  };

  public monsterStats: MonsterStats;
  public monsterTypeHandler: MonsterTypeHandler;

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

    this.monsterStats = new MonsterStats(this, this.stats);
    this.monsterTypeHandler = new MonsterTypeHandler(scene, this);

    this.initializePhysics();
    this.monsterTypeHandler.loadAssets();
  }

  private initializePhysics() {
    this.typedBody.setBounce(0.2);
    this.typedBody.setCollideWorldBounds(true);
  }

  public update() {
    this.monsterStats.update();

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
    this.stats.health.current = Math.max(this.stats.health.current - damage, 0);

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

    if (this.stats.health.current > 0) {
      this.flashDamage();
      return;
    }

    this.fadeOutAndDestroy();
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
    return this.stats.health.current > 0;
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

    this.typedBody.setVelocityX(direction.x * velocity);

    this.scene.time.delayedCall(duration, () => {
      this.isBeingPushed = false;
    });
  }
}
