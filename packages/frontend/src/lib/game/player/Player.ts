import { AuraAttack } from "../attacks/AuraAttack";
import { AuraAttackGroup } from "../attacks/AuraAttackGroup";
import { RangedAttack } from "../attacks/RangedAttack";
import { RangedAttackGroup } from "../attacks/RangedAttackGroup";
import { RodAttack } from "../attacks/RodAttack";
import { RodAttackGroup } from "../attacks/RodAttackGroup";
import { Shield } from "../attacks/Shield";
import { ShieldGroup } from "../attacks/ShieldGroup";
import { SpearAttack } from "../attacks/SpearAttack";
import { SpearAttackGroup } from "../attacks/SpearAttackGroup";
import { SwordAttack } from "../attacks/SwordAttack";
import { SwordAttackGroup } from "../attacks/SwordAttackGroup";
import { Gravity } from "../constants/enums";
import { Keyboard } from "../keyboard/Keyboard";
import { PlayerStatsHandler } from "./PlayerStatsHandler";

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

  private playerStatsHandler: PlayerStatsHandler;

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
    this.playerStatsHandler = new PlayerStatsHandler();

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
      frames: this.anims.generateFrameNumbers("idle", { start: 0, end: 3 }),
      frameRate: 2,
      repeat: -1,
    });

    this.anims.create({
      key: "dash",
      frames: this.anims.generateFrameNumbers("dash", { start: 0, end: 0 }),
    });
  }

  public takeDamage(damage: number) {
    this.playerStatsHandler.takeDamage(damage);

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
      this.handleAirborneMovement();
    } else {
      this.handleGroundMovement();
      this.handleEnvironmentInteractions();
    }
  }

  private handleDashing(dashingState: DashingState) {
    this.anims.play("dash", true);

    const direction = dashingState.direction === "left" ? -1 : 1;
    const dashSpeed = this.playerStatsHandler.dash.dashSpeed();
    this.typedBody.setVelocityX(direction * dashSpeed);
    dashingState.currentDashDistance +=
      dashSpeed / this.scene.game.loop.actualFps;

    if (dashingState.currentDashDistance < dashingState.totalDashDistance) {
      return;
    }

    this.currentState = undefined;
  }

  private handleAirborneMovement() {
    this.anims.play("jump", true);

    if (this.playerInteractions.keyboard.left.isDown) {
      this.typedBody.setVelocityX(
        this.playerStatsHandler.movement.movementVelocityXAirborne(
          "left",
          this.typedBody.velocity.x,
        ),
      );
    } else if (this.playerInteractions.keyboard.right.isDown) {
      this.typedBody.setVelocityX(
        this.playerStatsHandler.movement.movementVelocityXAirborne(
          "right",
          this.typedBody.velocity.x,
        ),
      );
    } else {
      this.typedBody.setVelocityX(this.typedBody.velocity.x * 0.995);
    }
  }

  private handleGroundMovement() {
    const maybeDash = this.maybeStartDashing();
    if (maybeDash !== undefined) {
      this.currentState = maybeDash;
      this.scene.sound.play("dash");
      this.playerStatsHandler.dash.consumeStaminaForDash();
      return;
    }

    if (this.playerInteractions.keyboard.left.isDown) {
      this.typedBody.setVelocityX(
        -this.playerStatsHandler.movement.movementVelocityX(),
      );
      this.setFlipX(true);
      this.anims.play("walk", true);
    } else if (this.playerInteractions.keyboard.right.isDown) {
      this.typedBody.setVelocityX(
        this.playerStatsHandler.movement.movementVelocityX(),
      );
      this.setFlipX(false);
      this.anims.play("walk", true);
    } else {
      this.typedBody.setVelocityX(0);
      this.anims.play("idle", true);
    }
  }

  private maybeStartDashing(): DashingState | undefined {
    if (
      !this.playerInteractions.keyboard.shift.isDown ||
      !this.playerStatsHandler.dash.canDash()
    ) {
      return;
    }

    if (this.playerInteractions.keyboard.left.isDown) {
      return {
        currentDashDistance: 0,
        totalDashDistance: this.playerStatsHandler.dash.dashDistance(),
        direction: "left",
        type: "dashing",
      };
    }

    if (this.playerInteractions.keyboard.right.isDown) {
      return {
        currentDashDistance: 0,
        totalDashDistance: this.playerStatsHandler.dash.dashDistance(),
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
      this.typedBody.setVelocityY(
        -this.playerStatsHandler.movement.movementVelocityY(),
      );
    }
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

  private fireRangedAttack() {
    if (!this.playerStatsHandler.rangedAttack.canFire()) {
      return;
    }

    const maybeRangedAttack: RangedAttack | null =
      this.playerInteractions.rangedAttackGroup.get();
    if (maybeRangedAttack == null) {
      return;
    }

    maybeRangedAttack.fire(this.x, this.y, this.flipX ? "left" : "right", {
      damage: this.playerStatsHandler.rangedAttack.damage(),
      range: this.playerStatsHandler.rangedAttack.range(),
      velocity: this.playerStatsHandler.rangedAttack.velocity(),
      pushBack: {
        duration: 100,
        velocity: 10,
      },
    });

    this.playerStatsHandler.rangedAttack.consumeChi();
  }

  private fireAuraAttack() {
    if (!this.playerStatsHandler.auraAttack.canFire()) {
      return;
    }

    const maybeAuraAttack: AuraAttack | null =
      this.playerInteractions.auraAttackGroup.get();
    if (maybeAuraAttack == null) {
      return;
    }

    maybeAuraAttack.fire(this.x, this.y, {
      damage: this.playerStatsHandler.auraAttack.damage(),
      duration: this.playerStatsHandler.auraAttack.duration(),
      scale: this.playerStatsHandler.auraAttack.scale(),
      pushBack: {
        duration: 0,
        velocity: 0,
      },
    });
    this.playerStatsHandler.auraAttack.consumeChi();
  }

  private fireSwordAttack() {
    if (!this.playerStatsHandler.swordAttack.canFire()) {
      return;
    }

    const maybeSwordAttack: SwordAttack | null =
      this.playerInteractions.swordAttackGroup.get();
    if (maybeSwordAttack == null) {
      return;
    }

    maybeSwordAttack.fire(this, this.flipX ? "left" : "right", {
      damage: this.playerStatsHandler.swordAttack.damage(),
      pushBack: {
        duration: 0,
        velocity: 0,
      },
    });
    this.playerStatsHandler.swordAttack.consumeStamina();
  }

  private fireSpearAttack() {
    if (!this.playerStatsHandler.spearAttack.canFire()) {
      return;
    }

    const maybeSpearAttack: SpearAttack | null =
      this.playerInteractions.spearAttackGroup.get();
    if (maybeSpearAttack == null) {
      return;
    }

    maybeSpearAttack.fire(this.x, this.y, this.flipX ? "left" : "right", {
      damage: this.playerStatsHandler.spearAttack.damage(),
      range: this.playerStatsHandler.spearAttack.range(),
      velocity: this.playerStatsHandler.spearAttack.velocity(),
      pushBack: {
        duration: 100,
        velocity: 10,
      },
    });
    this.playerStatsHandler.spearAttack.consumeStamina();
  }

  private fireRodAttack() {
    if (!this.playerStatsHandler.rodAttack.canFire()) {
      return;
    }

    const maybeRodAttack: RodAttack | undefined =
      this.playerInteractions.rodAttackGroup.get();
    if (maybeRodAttack == null) {
      return;
    }

    maybeRodAttack.fire(this, this.flipX ? "left" : "right", {
      damage: this.playerStatsHandler.rodAttack.damage(),
      pushBack: this.playerStatsHandler.rodAttack.pushBack(),
    });
    this.playerStatsHandler.rodAttack.consumeStamina();
  }

  private fireShield() {
    if (!this.playerStatsHandler.shield.canFire()) {
      return;
    }

    const maybeShield: Shield | undefined =
      this.playerInteractions.shieldGroup.get();
    if (maybeShield == null) {
      return;
    }

    maybeShield.fire(this.x, this.y, {
      duration: this.playerStatsHandler.shield.duration(),
      pushBack: this.playerStatsHandler.shield.pushBack(),
      direction: this.flipX ? "left" : "right",
      scale: this.playerStatsHandler.shield.scale(),
    });
    this.playerStatsHandler.shield.consumeStamina();
  }
}
