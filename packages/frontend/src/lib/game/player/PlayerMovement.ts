import { DashingState, Player } from "./Player";

const COYOTE_TIME_IN_MS = 300;
const JUMP_DELAY_IN_MS = 300;

export class PlayerMovement {
  private lastJump = 0;

  public constructor(private playerSprite: Player) {}

  public registerKeyboardInput() {
    if (
      Phaser.Input.Keyboard.JustDown(
        this.playerSprite.playerInteractions.keyboard.space,
      )
    ) {
      this.lastJump = this.playerSprite.scene.time.now;
    }
  }

  private isValidJump() {
    // We can give a little bit of a jump buffer to the player so they can time their jumps a tad off
    return this.playerSprite.scene.time.now - this.lastJump < JUMP_DELAY_IN_MS;
  }

  public handleClimbingMovement() {
    if (this.isValidJump()) {
      this.playerSprite.isClimbing = false;
      this.playerSprite.typedBody.setVelocityY(
        -this.playerSprite.playerStatsHandler.movement.movementVelocityY(),
      );
      return;
    }

    if (this.playerSprite.playerInteractions.keyboard.up.isDown) {
      this.playerSprite.typedBody.setVelocityY(
        -this.playerSprite.playerStatsHandler.movement.movementVelocityX(),
      );
      this.playerSprite.anims.play("climb_up", true);
    } else if (this.playerSprite.playerInteractions.keyboard.down.isDown) {
      this.playerSprite.typedBody.setVelocityY(
        this.playerSprite.playerStatsHandler.movement.movementVelocityX(),
      );
      this.playerSprite.anims.play("climb_down", true);
    } else {
      this.playerSprite.typedBody.setVelocityY(0);
      this.playerSprite.anims.play("climb_stay", true);
    }

    this.playerSprite.typedBody.setVelocityX(0);
  }

  public handleWallHangMovement() {
    if (this.isValidJump()) {
      const direction = this.playerSprite.playerDirection === "left" ? 1 : -1;
      this.playerSprite.typedBody.setVelocityY(
        -this.playerSprite.playerStatsHandler.movement.movementVelocityY(),
      );
      this.playerSprite.typedBody.setVelocityX(
        direction *
          this.playerSprite.playerStatsHandler.movement.movementVelocityX(),
      );
      this.playerSprite.setFlipX(direction === -1);
      this.playerSprite.hangingOnWall = undefined;
      return;
    }

    if (this.playerSprite.hangingOnWall === undefined) {
      return;
    }

    const hasOverShotWall = (() => {
      if (this.playerSprite.playerDirection === "left") {
        return (
          (this.playerSprite.getLeftCenter().x ?? 0) <
          (this.playerSprite.hangingOnWall.getLeftCenter().x ?? 0)
        );
      }

      return (
        (this.playerSprite.getRightCenter().x ?? 0) >
        (this.playerSprite.hangingOnWall.getRightCenter().x ?? 0)
      );
    })();

    const hasSlippedFromWall =
      (this.playerSprite.hangingOnWall.getBottomCenter().y ?? 0) <
      (this.playerSprite.getTopCenter().y ?? 0);
    const hasSlippedAboveWall =
      (this.playerSprite.hangingOnWall.getTopCenter().y ?? 0) >
      (this.playerSprite.getBottomCenter().y ?? 0);

    if (hasOverShotWall || hasSlippedFromWall || hasSlippedAboveWall) {
      this.playerSprite.hangingOnWall = undefined;
      return;
    }

    if (this.playerSprite.playerDirection === "left") {
      this.playerSprite.setFlipX(true);
    } else {
      this.playerSprite.setFlipX(false);
    }

    if (this.playerSprite.playerInteractions.keyboard.down.isDown) {
      this.playerSprite.typedBody.setVelocityY(
        this.playerSprite.playerStatsHandler.movement.wallSlideVelocityY(),
      );
      this.playerSprite.anims.play("wall_slide", true);
    } else {
      this.playerSprite.typedBody.setVelocityY(0);
      this.playerSprite.anims.play("wall_hang", true);
    }

    this.playerSprite.typedBody.setVelocityX(0);
  }

  public updateOtherMovements() {
    const maybeDashing = this.handleMaybeDashing();
    if (maybeDashing !== undefined) {
      return;
    }

    this.handleEnvironmentInteractions();

    if (!this.playerSprite.typedBody.touching.down) {
      return this.handleAirborneMovement();
    }

    this.handleGroundMovement();
  }

  private handleAirborneMovement() {
    this.playerSprite.anims.play("jump", true);

    if (this.playerSprite.playerInteractions.keyboard.left.isDown) {
      this.playerSprite.typedBody.setVelocityX(
        this.playerSprite.playerStatsHandler.movement.movementVelocityXAirborne(
          "left",
          this.playerSprite.typedBody.velocity.x,
        ),
      );
    } else if (this.playerSprite.playerInteractions.keyboard.right.isDown) {
      this.playerSprite.typedBody.setVelocityX(
        this.playerSprite.playerStatsHandler.movement.movementVelocityXAirborne(
          "right",
          this.playerSprite.typedBody.velocity.x,
        ),
      );
    } else {
      this.playerSprite.typedBody.setVelocityX(
        this.playerSprite.typedBody.velocity.x * 0.995,
      );
    }
  }

  private handleMaybeDashing() {
    const maybeDash = this.maybeStartDashing();
    if (maybeDash === undefined) {
      return;
    }

    this.playerSprite.currentState = maybeDash;
    this.playerSprite.scene.sound.play("dash");
    this.playerSprite.playerStatsHandler.dash.consumeStaminaForDash();
  }

  private maybeStartDashing(): DashingState | undefined {
    if (!this.playerSprite.playerInteractions.keyboard.shift.isDown) {
      return;
    }

    if (!this.playerSprite.playerStatsHandler.dash.canDash()) {
      this.playerSprite.noStamina();
      return;
    }

    if (this.playerSprite.playerInteractions.keyboard.left.isDown) {
      return {
        currentDashDistance: 0,
        totalDashDistance:
          this.playerSprite.playerStatsHandler.dash.dashDistance(),
        direction: "left",
        type: "dashing",
      };
    }

    if (this.playerSprite.playerInteractions.keyboard.right.isDown) {
      return {
        currentDashDistance: 0,
        totalDashDistance:
          this.playerSprite.playerStatsHandler.dash.dashDistance(),
        direction: "right",
        type: "dashing",
      };
    }
  }

  private handleGroundMovement() {
    if (this.playerSprite.currentState?.type === "dashing") {
      return;
    }

    if (this.playerSprite.playerInteractions.keyboard.left.isDown) {
      this.playerSprite.typedBody.setVelocityX(
        -this.playerSprite.playerStatsHandler.movement.movementVelocityX(),
      );
      this.playerSprite.setFlipX(true);
      this.playerSprite.anims.play("run", true);
    } else if (this.playerSprite.playerInteractions.keyboard.right.isDown) {
      this.playerSprite.typedBody.setVelocityX(
        this.playerSprite.playerStatsHandler.movement.movementVelocityX(),
      );
      this.playerSprite.setFlipX(false);
      this.playerSprite.anims.play("run", true);
    } else {
      this.playerSprite.typedBody.setVelocityX(0);
      this.playerSprite.anims.play("idle", true);
    }

    if (
      (this.playerSprite.playerInteractions.keyboard.up.isDown ||
        this.playerSprite.playerInteractions.keyboard.down.isDown) &&
      this.playerSprite.canClimb
    ) {
      this.playerSprite.isClimbing = true;
      this.playerSprite.x =
        this.playerSprite.closestLadder?.x ?? this.playerSprite.x;
    }
  }

  private handleEnvironmentInteractions() {
    if (this.playerSprite.typedBody.velocity.y < 0) {
      return;
    }

    // We can give a little bit of buffer to the player so they can jump a bit after the platform
    const isValidTouchingDown =
      this.playerSprite.typedBody.touching.down ||
      this.playerSprite.scene.time.now -
        (this.playerSprite.lastTouchedPlatform ?? 0) <
        COYOTE_TIME_IN_MS;

    if (this.isValidJump() && isValidTouchingDown) {
      this.playerSprite.typedBody.setVelocityY(
        -this.playerSprite.playerStatsHandler.movement.movementVelocityY(),
      );
      this.lastJump = 0;
    }
  }
}
