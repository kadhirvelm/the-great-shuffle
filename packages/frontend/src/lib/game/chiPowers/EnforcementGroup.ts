import { Enforcement } from "./Enforcement";

export class EnforcementGroup extends Phaser.Physics.Arcade.Group {
  public constructor(scene: Phaser.Scene) {
    super(scene.physics.world, scene, {
      classType: Enforcement,
      maxSize: 1,
      runChildUpdate: true,
      collideWorldBounds: false,
      allowGravity: false,
    });
  }

  public update() {
    this.getChildren().forEach((enforcement) =>
      (enforcement as Enforcement).update(),
    );
  }
}
