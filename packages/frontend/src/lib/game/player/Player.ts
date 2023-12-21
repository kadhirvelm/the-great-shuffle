import { Store } from "@reduxjs/toolkit";
import { State } from "../../store/configureStore";
import { updateChi, updateHealth } from "../../store/reducer/gameState";
import { getStore } from "../store/storeManager";
import { RangedAttackGroup } from "../attacks/RangedAttackGroup";
import { Keyboard } from "../keyboard/Keyboard";
import { clamp } from "lodash-es";
import { Gravity } from "../constants/Gravity";
import { Movement } from "../constants/Movement";
import { RangedAttack } from "../attacks/RangedAttack";

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
    this.handleAttacking();

    if (!this.typedBody.touching.down) {
      return this.handleAirborneMovement();
    }

    this.handleGroundMovement();
    this.handleEnvironmentInteractions();
  }

  public takeDamage(damage: number) {
    this.store.dispatch(updateHealth(-damage));
  }

  private initializePhysics() {
    this.typedBody.setBounce(0.05);
    this.typedBody.setCollideWorldBounds(true);

    this.typedBody.setGravityY(Gravity.playerY);
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

  private handleAttacking() {
    if (
      Phaser.Input.Keyboard.JustDown(this.playerInteractions.keyboard.shift)
    ) {
      this.fireProjectile();
    }
  }

  private handleAirborneMovement() {
    this.anims.play("jump", true);

    const adjustDirection = (direction: "left" | "right") => {
      const intendedDiretion = direction === "left" ? -1 : 1;
      const deltaInSpeed = Math.abs(this.typedBody.velocity.x) * 0.05;
      const finalDelta = intendedDiretion * clamp(deltaInSpeed, 0.25, 1.25);

      return this.typedBody.velocity.x + finalDelta;
    };

    if (this.playerInteractions.keyboard.left.isDown) {
      this.typedBody.setVelocityX(adjustDirection("left"));
    } else if (this.playerInteractions.keyboard.right.isDown) {
      this.typedBody.setVelocityX(adjustDirection("right"));
    } else {
      this.typedBody.setVelocityX(this.typedBody.velocity.x * 0.995);
    }
  }

  private handleGroundMovement() {
    if (this.playerInteractions.keyboard.left.isDown) {
      this.typedBody.setVelocityX(-Movement.player_x);
      this.setFlipX(true);
      this.anims.play("walk", true);
    } else if (this.playerInteractions.keyboard.right.isDown) {
      this.typedBody.setVelocityX(Movement.player_x);
      this.setFlipX(false);
      this.anims.play("walk", true);
    } else {
      this.typedBody.setVelocityX(0);
      this.anims.play("idle", true);
    }
  }

  private handleEnvironmentInteractions() {
    if (
      this.playerInteractions.keyboard.space.isDown &&
      this.typedBody.touching.down
    ) {
      this.typedBody.setVelocityY(-Movement.player_y);
    }
  }

  private fireProjectile() {
    const playerChi = this.store.getState().gameState.player.chi;
    if (playerChi < 10) {
      return;
    }

    const maybeRangedAttack: RangedAttack | undefined =
      this.playerInteractions.rangedAttackGroup.get();
    if (maybeRangedAttack === undefined) {
      return;
    }

    maybeRangedAttack.fire(this.x, this.y, this.flipX ? 180 : 0);
    this.store.dispatch(updateChi(-10));
  }
}
