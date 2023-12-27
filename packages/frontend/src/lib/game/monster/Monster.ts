import { Store } from "@reduxjs/toolkit";
import { State } from "../../store/configureStore";
import { getStore } from "../store/storeManager";
import { Player } from "../player/Player";
import { AllMonsterStats, MonsterStats } from "./MonsterStats";
import { Distance, Movement } from "../constants/enums";

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

  private store: Store<State>;
  private monsterStats: MonsterStats;
  private auraAttackTracker: { [auraAttackId: string]: number } = {};
  private swordAttackTracker: { [swordAttackId: string]: true } = {};
  private spearAttackTracker: { [spearAttackId: string]: true } = {};
  private rodAttackTracker: { [rodAttackId: string]: true } = {};

  private isBeingPushed: boolean = false;

  private damageEvent:
    | {
        flash: Phaser.Time.TimerEvent;
        timer: Phaser.Time.TimerEvent;
      }
    | undefined;

  public constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    private monsterInteractions: MonsterInteraction,
  ) {
    super(scene, x, y, "monster");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.typedBody = this.body as Phaser.Physics.Arcade.Body;
    this.store = getStore();
    this.monsterStats = new MonsterStats(this, this.stats);

    this.initializePhysics();
    this.setAnimations();
  }

  private initializePhysics() {
    this.typedBody.setBounce(0.2);
    this.typedBody.setCollideWorldBounds(true);
  }

  private setAnimations() {
    this.anims.create({
      key: "monster",
      frames: this.anims.generateFrameNumbers("monster", { start: 0, end: 11 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.play("monster", true);
  }

  public update() {
    this.monsterStats.update();

    if (!this.isAlive()) {
      this.typedBody.setVelocityX(0);
      return;
    }

    if (this.isBeingPushed) {
      return;
    }

    const distanceToPlayer = Phaser.Math.Distance.Between(
      this.x,
      this.y,
      this.monsterInteractions.player.x,
      this.monsterInteractions.player.y,
    );

    if (distanceToPlayer <= Distance.monster_aggro) {
      const direction = Math.sign(this.monsterInteractions.player.x - this.x);
      this.typedBody.setVelocityX(Movement.monster_x * direction);

      if (this.typedBody.touching.down && this.damageEvent === undefined) {
        this.typedBody.setVelocityY(-Movement.monster_y);
      }
    } else {
      this.typedBody.setVelocityX(0);
    }
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
