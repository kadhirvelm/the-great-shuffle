import { Store } from "@reduxjs/toolkit";
import { State } from "../../store/configureStore";
import { getStore } from "../store/storeManager";
import { Player } from "../player/Player";
import { AllMonsterStats, MonsterStats } from "./MonsterStats";

export interface MonsterInteraction {
  player: Player;
}

export class Monster extends Phaser.GameObjects.Sprite {
  public typedBody: Phaser.Physics.Arcade.Body;
  public stats: AllMonsterStats = {
    damage: 20,
    health: { current: 100, max: 100 },
  };

  private store: Store<State>;
  private monsterStats: MonsterStats;

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

    const distanceToPlayer = Phaser.Math.Distance.Between(
      this.x,
      this.y,
      this.monsterInteractions.player.x,
      this.monsterInteractions.player.y,
    );

    if (distanceToPlayer < 100) {
      const direction = Math.sign(this.monsterInteractions.player.x - this.x);
      this.typedBody.setVelocityX(100 * direction);
    } else {
      this.typedBody.setVelocityX(0);
    }
  }

  public takeDamage(damage: number) {
    this.stats.health.current = Math.max(this.stats.health.current - damage, 0);

    if (this.stats.health.current > 0) {
      return;
    }

    this.fadeOutAndDestroy();
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
}
