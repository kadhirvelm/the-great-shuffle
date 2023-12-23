import { CloseAttack } from "./CloseAttack";
import { CloseAttackHitboxGroup } from "./CloseAttackHitbox";

export class CloseAttackGroup extends Phaser.Physics.Arcade.Group {
  public constructor(
    scene: Phaser.Scene,
    private closeAttackHitbox: CloseAttackHitboxGroup,
  ) {
    super(scene.physics.world, scene, {
      classType: CloseAttack,
      maxSize: 1,
      runChildUpdate: true,
      collideWorldBounds: false,
      allowGravity: false,
    });
  }

  public create(x: number, y: number) {
    if (this.children.size >= this.maxSize) {
      return;
    }

    const closeAttack = new CloseAttack(
      this.scene,
      x,
      y,
      this.closeAttackHitbox,
    );
    this.add(closeAttack, true);
    return closeAttack;
  }

  public update() {
    this.getChildren().forEach((closeAttack) =>
      (closeAttack as CloseAttack).update(),
    );
  }
}
