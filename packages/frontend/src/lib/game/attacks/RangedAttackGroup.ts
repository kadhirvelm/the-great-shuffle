import { RangedAttack } from "./RangedAttack";

export class RangedAttackGroup extends Phaser.Physics.Arcade.Group {
  public constructor(scene: Phaser.Scene) {
    super(scene.physics.world, scene, {
      classType: RangedAttack,
      maxSize: 5,
      runChildUpdate: true,
      collideWorldBounds: true,
      allowGravity: false,
    });
  }
}
