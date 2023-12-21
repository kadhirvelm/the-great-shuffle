import { Store } from "@reduxjs/toolkit";
import { State } from "../../store/configureStore";
import { updateChi, updateHealth } from "../../store/reducer/gameState";
import { getStore } from "../store/storeManager";
import { RangedAttackGroup } from "../attacks/RangedAttackGroup";
import { Keyboard } from "../keyboard/Keyboard";

export interface PlayerInteractions {
  keyboard: Keyboard;
  rangedAttackGroup: RangedAttackGroup;
}

export class Player extends Phaser.GameObjects.Sprite {
  public typedBody: Phaser.Physics.Arcade.Body;

  private store: Store<State>;

  public constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    private playerInteractions: PlayerInteractions,
  ) {
    super(scene, x, y, "idle");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.typedBody = this.body as Phaser.Physics.Arcade.Body;
    this.store = getStore();

    this.initializePhysics();
    this.setAnimations();
  }

  public update() {
    if (
      Phaser.Input.Keyboard.JustDown(this.playerInteractions.keyboard.shift)
    ) {
      this.fireProjectile();
    }

    if (!this.typedBody.touching.down) {
      this.typedBody.setVelocityX(this.typedBody.velocity.x * 0.995);
      this.anims.play("jump", true);
      return;
    }

    if (this.playerInteractions.keyboard.left.isDown) {
      this.typedBody.setVelocityX(-300);
      this.setFlipX(true);
      this.anims.play("walk", true);
    } else if (this.playerInteractions.keyboard.right.isDown) {
      this.typedBody.setVelocityX(300);
      this.setFlipX(false);
      this.setAngle(0);
      this.anims.play("walk", true);
    } else {
      this.typedBody.setVelocityX(0);
      this.anims.play("idle", true);
    }

    if (
      this.playerInteractions.keyboard.space.isDown &&
      this.typedBody.touching.down
    ) {
      this.typedBody.setVelocityY(-350);
      return;
    }
  }

  public takeDamage(damage: number) {
    this.store.dispatch(updateHealth(-damage));
  }

  private initializePhysics() {
    this.typedBody.setBounce(0.2);
    this.typedBody.setCollideWorldBounds(true);
  }

  private setAnimations() {
    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers("walk", { start: 0, end: 7 }),
      frameRate: 25,
      repeat: -1,
    });

    this.anims.create({
      key: "jump",
      frames: this.anims.generateFrameNumbers("jump", { start: 0, end: 1 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("idle", { start: 0, end: 0 }),
    });
  }

  private fireProjectile() {
    const playerChi = this.store.getState().gameState.player.chi;
    if (playerChi < 10) {
      return;
    }

    const maybeRangedAttack = this.playerInteractions.rangedAttackGroup.get();
    if (maybeRangedAttack === undefined) {
      return;
    }

    maybeRangedAttack.fire(this.x, this.y, this.flipX ? 180 : 0);
    this.store.dispatch(updateChi(-10));
  }
}
