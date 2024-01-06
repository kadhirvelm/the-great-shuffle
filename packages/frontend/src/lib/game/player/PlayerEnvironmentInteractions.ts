import { Player } from "./Player";

export class PlayerEnvironmentInteractions {
  public constructor(private playerSprite: Player) {}

  public update() {
    this.handleUpdatingGravity();
    this.updateCanClimbStatus();
    this.maybeInteractWithDoor();
  }

  private handleUpdatingGravity() {
    if (this.playerSprite.isClimbing) {
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

  private maybeInteractWithDoor() {
    if (this.playerSprite.lastInteractableDoor === undefined) {
      return;
    }

    if (
      !Phaser.Geom.Intersects.RectangleToRectangle(
        this.playerSprite.getBounds(),
        this.playerSprite.lastInteractableDoor.getBounds(),
      )
    ) {
      this.playerSprite.lastInteractableDoor = undefined;
    }

    if (
      Phaser.Input.Keyboard.JustDown(
        this.playerSprite.playerInteractions.keyboard.enter,
      ) &&
      this.playerSprite.lastInteractableDoor !== undefined
    ) {
      this.playerSprite.lastInteractableDoor.onInteraction();
    }
  }
}
