import { Player } from "./Player";

export class PlayerEnvironmentInteractions {
  public constructor(private playerSprite: Player) {}

  public update() {
    this.handleUpdatingGravity();
    this.updateCanClimbStatus();
  }

  private handleUpdatingGravity() {
    if (
      this.playerSprite.isClimbing ||
      this.playerSprite.currentState?.type === "dashing" ||
      this.playerSprite.hangingOnWallState !== undefined
    ) {
      this.playerSprite.typedBody.setAllowGravity(false);
    } else {
      this.playerSprite.typedBody.setAllowGravity(true);
    }
  }

  private updateCanClimbStatus() {
    if (this.playerSprite.closestLadder === undefined) {
      return;
    }

    this.playerSprite.canClimb = Phaser.Geom.Intersects.RectangleToRectangle(
      this.playerSprite.getBounds(),
      this.playerSprite.closestLadder.getBounds(),
    );

    if (!this.playerSprite.canClimb) {
      this.playerSprite.isClimbing = false;
    }
  }
}
