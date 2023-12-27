import { Monster } from "./Monster";

export class MonsterGroup extends Phaser.Physics.Arcade.Group {
  public constructor(scene: Phaser.Scene) {
    super(scene.physics.world, scene, {
      classType: Monster,
      maxSize: 50,
      runChildUpdate: true,
      collideWorldBounds: true,
    });
  }

  public update() {
    this.getChildren().forEach((monster) => (monster as Monster).update());
  }
}
