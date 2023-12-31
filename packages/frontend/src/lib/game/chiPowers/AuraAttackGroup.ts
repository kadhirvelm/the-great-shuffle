import { AuraAttack } from "./AuraAttack";

export class AuraAttackGroup extends Phaser.Physics.Arcade.Group {
  public constructor(scene: Phaser.Scene) {
    super(scene.physics.world, scene, {
      classType: AuraAttack,
      maxSize: 5,
      runChildUpdate: true,
      collideWorldBounds: false,
      allowGravity: false,
    });
  }

  public update() {
    this.getChildren().forEach((auraAttack) =>
      (auraAttack as AuraAttack).update(),
    );
  }
}
