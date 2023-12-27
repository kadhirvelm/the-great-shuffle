import { DashingState, Player } from "./Player";

export class PlayerMovement {
  public constructor(private playerSprite: Player) {}

  public handleClimbingMovement() {
    if (this.playerSprite.playerInteractions.keyboard.up.isDown) {
      this.playerSprite.typedBody.setVelocityY(
        -this.playerSprite.playerStatsHandler.movement.movementVelocityX(),
      );
    } else if (this.playerSprite.playerInteractions.keyboard.down.isDown) {
      this.playerSprite.typedBody.setVelocityY(
        this.playerSprite.playerStatsHandler.movement.movementVelocityX(),
      );
    } else {
      this.playerSprite.typedBody.setVelocityY(0);
    }

    if (
      this.playerSprite.playerInteractions.keyboard.left.isDown ||
      this.playerSprite.playerInteractions.keyboard.right.isDown
    ) {
      this.playerSprite.isClimbing = false;
    } else if (this.playerSprite.playerInteractions.keyboard.space.isDown) {
      this.playerSprite.isClimbing = false;
      this.playerSprite.typedBody.setVelocityY(
        -this.playerSprite.playerStatsHandler.movement.movementVelocityY(),
      );
    } else {
      this.playerSprite.anims.play("climb", true);
      this.playerSprite.typedBody.setVelocityX(0);
    }
  }

  public updateOtherMovements() {
    const maybeDashing = this.handleMaybeDashing();
    if (maybeDashing !== undefined) {
      return;
    }

    if (!this.playerSprite.typedBody.touching.down) {
      return this.handleAirborneMovement();
    }

    this.handleGroundMovement();
    this.handleEnvironmentInteractions();
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
    }
  }

  private handleEnvironmentInteractions() {
    if (
      this.playerSprite.playerInteractions.keyboard.space.isDown &&
      this.playerSprite.typedBody.touching.down
    ) {
      this.playerSprite.typedBody.setVelocityY(
        -this.playerSprite.playerStatsHandler.movement.movementVelocityY(),
      );
    }
  }
}
