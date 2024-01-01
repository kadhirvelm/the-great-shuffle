import { ShieldAttack } from "./ShieldAttack";

export class ShieldAttackGroup extends Phaser.Physics.Arcade.Group {
  public constructor(scene: Phaser.Scene) {
    super(scene.physics.world, scene, {
      classType: ShieldAttack,
      maxSize: 1,
      runChildUpdate: true,
      collideWorldBounds: false,
      allowGravity: false,
      immovable: true,
    });
  }

  public update() {
    this.getChildren().forEach((shield) => (shield as ShieldAttack).update());
  }
}
