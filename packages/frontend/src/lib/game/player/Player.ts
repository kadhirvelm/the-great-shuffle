import { Store } from "@reduxjs/toolkit";
import { State } from "../../store/configureStore";
import {
  updateChi,
  updateHealth,
  updateStamina,
} from "../../store/reducer/gameState";
import { getStore } from "../store/storeManager";
import { RangedAttackGroup } from "../attacks/RangedAttackGroup";
import { Keyboard } from "../keyboard/Keyboard";
import { clamp } from "lodash-es";
import { Gravity } from "../constants/Gravity";
import { Movement } from "../constants/Movement";
import { RangedAttack } from "../attacks/RangedAttack";
import { Distance } from "../constants/Distance";
import { AuraAttack } from "../attacks/AuraAttack";
import { AuraAttackGroup } from "../attacks/AuraAttackGroup";
import { Scale } from "../constants/Scale";
import { SwordAttackGroup } from "../attacks/SwordAttackGroup";
import { SwordAttack } from "../attacks/SwordAttack";
import { ShieldGroup } from "../attacks/ShieldGroup";
import { Shield } from "../attacks/Shield";
import { SpearAttackGroup } from "../attacks/SpearAttackGroup";
import { SpearAttack } from "../attacks/SpearAttack";
import { RodAttackGroup } from "../attacks/RodAttackGroup";
import { RodAttack } from "../attacks/RodAttack";

export interface PlayerInteractions {
  keyboard: Keyboard;
  rangedAttackGroup: RangedAttackGroup;
  auraAttackGroup: AuraAttackGroup;
  swordAttackGroup: SwordAttackGroup;
  shieldGroup: ShieldGroup;
  spearAttackGroup: SpearAttackGroup;
  rodAttackGroup: RodAttackGroup;
}

interface DashingState {
  currentDashDistance: number;
  direction: "left" | "right";
  totalDashDistance: number;
  type: "dashing";
}

interface RecentlyDamagedState {
  takenOn: number;
  invulnerableUntil: number;
  type: "recently-damaged";
}

export class Player extends Phaser.GameObjects.Sprite {
  public typedBody: Phaser.Physics.Arcade.Body;
  public currentState: DashingState | RecentlyDamagedState | undefined;

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

    this.setDepth(this.depth + 1);

    this.initializePhysics();
    this.setAnimations();
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

    this.anims.create({
      key: "dash",
      frames: this.anims.generateFrameNumbers("dash", { start: 0, end: 0 }),
    });
  }

  public takeDamage(damage: number) {
    this.store.dispatch(updateHealth(-damage));

    const invulnerableDuration = 1000;

    this.currentState = {
      takenOn: this.scene.time.now,
      invulnerableUntil: this.scene.time.now + invulnerableDuration,
      type: "recently-damaged",
    };

    let isFlashing = true;
    const flashEvent = this.scene.time.addEvent({
      delay: 200,
      repeat: invulnerableDuration / 200 - 1,
      callback: () => {
        this.setTint(isFlashing ? 0xff0000 : 0xffffff);
        isFlashing = !isFlashing;
      },
    });

    this.scene.time.delayedCall(invulnerableDuration, () => {
      if (
        this.currentState?.type !== "recently-damaged" ||
        this.currentState.invulnerableUntil > this.scene.time.now
      ) {
        return;
      }

      flashEvent.remove();
      this.clearTint();
      this.currentState = undefined;
    });
  }

  public update() {
    if (this.currentState?.type === "dashing") {
      return this.handleDashing(this.currentState);
    }

    this.handleKeyboardInput();

    if (!this.typedBody.touching.down) {
      return this.handleAirborneMovement();
    }

    this.handleGroundMovement();
    this.handleEnvironmentInteractions();
  }

  private handleDashing(dashingState: DashingState) {
    this.anims.play("dash", true);

    const direction = dashingState.direction === "left" ? -1 : 1;
    this.typedBody.setVelocityX(direction * Movement.player_dash_x);
    dashingState.currentDashDistance +=
      Movement.player_dash_x / this.scene.game.loop.actualFps;

    if (dashingState.currentDashDistance < dashingState.totalDashDistance) {
      return;
    }

    this.currentState = undefined;
  }

  private handleKeyboardInput() {
    if (
      Phaser.Input.Keyboard.JustDown(
        this.playerInteractions.keyboard.ranged_attack,
      )
    ) {
      this.fireRangedAttack();
    }

    if (
      Phaser.Input.Keyboard.JustDown(
        this.playerInteractions.keyboard.aura_attack,
      )
    ) {
      this.fireAuraAttack();
    }

    if (
      Phaser.Input.Keyboard.JustDown(
        this.playerInteractions.keyboard.sword_attack,
      )
    ) {
      this.fireSwordAttack();
    }

    if (
      Phaser.Input.Keyboard.JustDown(
        this.playerInteractions.keyboard.spear_attack,
      )
    ) {
      this.fireSpearAttack();
    }

    if (
      Phaser.Input.Keyboard.JustDown(
        this.playerInteractions.keyboard.rod_attack,
      )
    ) {
      this.fireRodAttack();
    }

    if (
      Phaser.Input.Keyboard.JustDown(this.playerInteractions.keyboard.shield)
    ) {
      this.fireShield();
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
    const maybeDash = this.maybeStartDashing();
    if (maybeDash !== undefined) {
      this.currentState = maybeDash;
      this.scene.sound.play("dash");
      this.store.dispatch(updateStamina(-10));
      return;
    }

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

  private maybeStartDashing(): DashingState | undefined {
    if (!this.playerInteractions.keyboard.shift.isDown) {
      return;
    }

    const canDash = this.store.getState().gameState.player.stamina.current > 10;
    if (!canDash) {
      return;
    }

    if (this.playerInteractions.keyboard.left.isDown) {
      return {
        currentDashDistance: 0,
        totalDashDistance: 250,
        direction: "left",
        type: "dashing",
      };
    }

    if (this.playerInteractions.keyboard.right.isDown) {
      return {
        currentDashDistance: 0,
        totalDashDistance: 250,
        direction: "right",
        type: "dashing",
      };
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

  private fireRangedAttack() {
    const playerChi = this.store.getState().gameState.player.chi.current;
    if (playerChi < 10) {
      return;
    }

    const maybeRangedAttack: RangedAttack | null =
      this.playerInteractions.rangedAttackGroup.get();
    if (maybeRangedAttack == null) {
      return;
    }

    maybeRangedAttack.fire(this.x, this.y, this.flipX ? "left" : "right", {
      damage: 15,
      range: Distance.player_projectile,
    });
    this.store.dispatch(updateChi(-10));
  }

  private fireAuraAttack() {
    const playerChi = this.store.getState().gameState.player.chi.current;
    if (playerChi < 20) {
      return;
    }

    const maybeAuraAttack: AuraAttack | null =
      this.playerInteractions.auraAttackGroup.get();
    if (maybeAuraAttack == null) {
      return;
    }

    maybeAuraAttack.fire(this.x, this.y, {
      damage: 25,
      duration: 300,
      scale: Scale.player_aura_attack,
    });
    this.store.dispatch(updateChi(-20));
  }

  private fireSwordAttack() {
    const playerStamina =
      this.store.getState().gameState.player.stamina.current;
    if (playerStamina < 2) {
      return;
    }

    const maybeSwordAttack: SwordAttack | null =
      this.playerInteractions.swordAttackGroup.get();
    if (maybeSwordAttack == null) {
      return;
    }

    maybeSwordAttack.fire(this, this.flipX ? "left" : "right", {
      damage: 5,
    });
    this.store.dispatch(updateStamina(-2));
  }

  private fireSpearAttack() {
    const playerStamina =
      this.store.getState().gameState.player.stamina.current;
    if (playerStamina < 2) {
      return;
    }

    const maybeSpearAttack: SpearAttack | null =
      this.playerInteractions.spearAttackGroup.get();
    if (maybeSpearAttack == null) {
      return;
    }

    maybeSpearAttack.fire(this.x, this.y, this.flipX ? "left" : "right", {
      damage: 5,
      range: Distance.player_spear_x,
    });
    this.store.dispatch(updateStamina(-2));
  }

  private fireRodAttack() {
    const playerStamina =
      this.store.getState().gameState.player.stamina.current;
    if (playerStamina < 2) {
      return;
    }

    const maybeRodAttack: RodAttack | undefined =
      this.playerInteractions.rodAttackGroup.get();
    if (maybeRodAttack == null) {
      return;
    }

    maybeRodAttack.fire(this, this.flipX ? "left" : "right", {
      damage: 2,
      pushBack: {
        velocity: 400,
        duration: 500,
      },
    });
  }

  private fireShield() {
    const playerStamina =
      this.store.getState().gameState.player.stamina.current;
    if (playerStamina < 2) {
      return;
    }

    const maybeShield: Shield | undefined =
      this.playerInteractions.shieldGroup.get();
    if (maybeShield == null) {
      return;
    }

    maybeShield.fire(this.x, this.y, {
      duration: 350,
      pushBackDuration: 500,
      direction: this.flipX ? "left" : "right",
    });
    this.store.dispatch(updateStamina(-2));
  }
}
