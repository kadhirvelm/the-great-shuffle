import { Gravity } from "../constants/enums";
import { PlayerAttack } from "./PlayerAttacks";
import { PlayerEnvironmentInteractions } from "./PlayerEnvironmentInteractions";
import { PlayerInteractions } from "./PlayerInteractions";
import { PlayerMovement } from "./PlayerMovement";
import { PlayerStatsHandler } from "./PlayerStatsHandler";

export interface DashingState {
  currentDashDistance: number;
  direction: "left" | "right";
  totalDashDistance: number;
  type: "dashing";
}

export interface RecentlyDamagedState {
  takenOn: number;
  invulnerableUntil: number;
  type: "recently-damaged";
}

export class Player extends Phaser.GameObjects.Sprite {
  public typedBody: Phaser.Physics.Arcade.Body;
  public currentState: DashingState | RecentlyDamagedState | undefined;

  public playerStatsHandler: PlayerStatsHandler;
  public playerAttack: PlayerAttack;
  public playerMovement: PlayerMovement;
  public playerEnvironmentInteractions: PlayerEnvironmentInteractions;

  public isFlashing = false;

  public lastTouchedPlatform: number | undefined = undefined;

  public closestLadder: Phaser.GameObjects.Sprite | undefined;
  public canClimb = false;
  public isClimbing = false;

  public playerDirection: "left" | "right" | undefined = undefined;
  public hangingOnWall: Phaser.GameObjects.Sprite | undefined = undefined;

  public constructor(
    scene: Phaser.Scene,
    public playerInteractions: PlayerInteractions,
  ) {
    super(scene, 0, 0, "idle");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.typedBody = this.body as Phaser.Physics.Arcade.Body;

    this.playerStatsHandler = new PlayerStatsHandler();
    this.playerAttack = new PlayerAttack(this);
    this.playerMovement = new PlayerMovement(this);
    this.playerEnvironmentInteractions = new PlayerEnvironmentInteractions(
      this,
    );

    this.setDepth(this.depth + 1);
    this.setActive(false);
    this.setVisible(false);

    this.setTint(0xeadbcb);

    this.initializePhysics();
    this.setAnimations();
  }

  private initializePhysics() {
    // this.typedBody.setBounce(0.05);
    this.typedBody.setCollideWorldBounds(true);

    this.typedBody.setGravityY(Gravity.playerY);
  }

  private setAnimations() {
    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("idle", { start: 0, end: 9 }),
      frameRate: 5,
      repeat: -1,
    });
    this.anims.create({
      key: "jump",
      frames: this.anims.generateFrameNumbers("jump", { start: 0, end: 2 }),
      frameRate: 3,
      repeat: -1,
    });
    this.anims.create({
      key: "run",
      frames: this.anims.generateFrameNumbers("run", { start: 0, end: 7 }),
      frameRate: 12,
      repeat: -1,
    });

    this.anims.create({
      key: "dash",
      frames: this.anims.generateFrameNumbers("dash", { start: 0, end: 6 }),
      frameRate: 3,
      repeat: -1,
    });

    this.anims.create({
      key: "climb_up",
      frames: this.anims.generateFrameNumbers("climb", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "climb_stay",
      frames: this.anims.generateFrameNumbers("climb", { start: 1, end: 1 }),
      repeat: -1,
    });
    this.anims.create({
      key: "climb_down",
      frames: this.anims.generateFrameNumbers("climb", { start: 3, end: 0 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "wall_hang",
      frames: this.anims.generateFrameNumbers("wall_hang", {
        start: 0,
        end: 5,
      }),
      frameRate: 3,
      repeat: -1,
    });
    this.anims.create({
      key: "wall_slide",
      frames: this.anims.generateFrameNumbers("wall_slide", {
        start: 0,
        end: 2,
      }),
      frameRate: 4,
      repeat: -1,
    });
  }

  public clearTint() {
    this.setTint(0xeadbcb);

    return this;
  }

  public spawnPlayer(x: number, y: number) {
    this.setActive(true);
    this.setVisible(true);
    this.setPosition(x, y);
  }

  public takeDamage(damage: number) {
    this.playerStatsHandler.takeDamage(damage);

    const invulnerableDuration =
      this.playerStatsHandler.defensiveAttributes.invulnerableDuration();

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
      this.clearTint();

      if (
        this.currentState?.type !== "recently-damaged" ||
        this.currentState.invulnerableUntil > this.scene.time.now
      ) {
        return;
      }

      flashEvent.remove();
      this.currentState = undefined;
    });
  }

  public updateClosestLadder(ladder: Phaser.GameObjects.Sprite) {
    this.closestLadder = ladder;
  }

  public update() {
    this.playerEnvironmentInteractions.update();

    if (this.currentState?.type === "dashing") {
      return this.handleDashing(this.currentState);
    }

    this.playerMovement.registerKeyboardInput();

    if (this.isClimbing && this.canClimb) {
      return this.playerMovement.handleClimbingMovement();
    }

    if (this.hangingOnWall !== undefined) {
      return this.playerMovement.handleWallHangMovement();
    }

    this.playerAttack.handleKeyboardInput();
    this.playerMovement.updateOtherMovements();
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

  public noChi() {
    if (this.isFlashing) {
      return;
    }

    this.isFlashing = true;
    const text = this.scene.add.text(this.x, this.y - 50, "No chi!", {
      color: "black",
    });

    const timeline = this.scene.add.timeline([
      {
        at: 0,
        tween: {
          targets: text,
          alpha: { from: 0.5, to: 1 },
          yoyo: true,
          duration: 100,
          repeat: 2,
          onComplete: () => {
            this.isFlashing = false;
            text.destroy();
          },
        },
      },
    ]);

    timeline.play();
  }

  public noStamina() {
    if (this.isFlashing) {
      return;
    }

    this.isFlashing = true;
    const text = this.scene.add.text(this.x, this.y - 50, "No stamina!", {
      color: "black",
    });

    const timeline = this.scene.add.timeline([
      {
        at: 0,
        tween: {
          targets: text,
          alpha: { from: 0.75, to: 1 },
          yoyo: true,
          duration: 100,
          repeat: 2,
          onComplete: () => {
            this.isFlashing = false;
            text.destroy();
          },
        },
      },
    ]);

    timeline.play();
  }
}
