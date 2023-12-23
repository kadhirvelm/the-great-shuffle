import { SpearAttack } from "./SpearAttack";

export class SpearAttackGroup extends Phaser.Physics.Arcade.Group {
  public constructor(scene: Phaser.Scene) {
    super(scene.physics.world, scene, {
      classType: SpearAttack,
      maxSize: 1,
      runChildUpdate: true,
      collideWorldBounds: false,
      allowGravity: false,
    });
  }

  public update() {
    this.getChildren().forEach((spearAttack) =>
      (spearAttack as SpearAttack).update(),
    );
  }
}
