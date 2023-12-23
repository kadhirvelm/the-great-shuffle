import { Shield } from "./Shield";

export class ShieldGroup extends Phaser.Physics.Arcade.Group {
  public constructor(scene: Phaser.Scene) {
    super(scene.physics.world, scene, {
      classType: Shield,
      maxSize: 1,
      runChildUpdate: true,
      collideWorldBounds: false,
      allowGravity: false,
      immovable: true,
    });
  }

  public update() {
    this.getChildren().forEach((shield) => (shield as Shield).update());
  }
}
