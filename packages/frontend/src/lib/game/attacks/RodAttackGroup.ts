import { RodAttack } from "./RodAttack";
import { RodAttackHitboxGroup } from "./RodAttackHitbox";

export class RodAttackGroup extends Phaser.Physics.Arcade.Group {
  public constructor(
    scene: Phaser.Scene,
    private rodAttackHitboxGroup: RodAttackHitboxGroup,
  ) {
    super(scene.physics.world, scene, {
      classType: RodAttack,
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

    const swordAttack = new RodAttack(
      this.scene,
      x,
      y,
      this.rodAttackHitboxGroup,
    );
    this.add(swordAttack, true);
    return swordAttack;
  }

  public update() {
    this.getChildren().forEach((rodAttack) =>
      (rodAttack as RodAttack).update(),
    );
  }
}
