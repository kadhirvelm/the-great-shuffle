import { SwordAttack } from "./SwordAttack";
import { SwordAttackHitboxGroup } from "./SwordAttackHitbox";

export class SwordAttackGroup extends Phaser.Physics.Arcade.Group {
  public constructor(
    scene: Phaser.Scene,
    private swordAttackHitbox: SwordAttackHitboxGroup,
  ) {
    super(scene.physics.world, scene, {
      classType: SwordAttack,
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

    const swordAttack = new SwordAttack(
      this.scene,
      x,
      y,
      this.swordAttackHitbox,
    );
    this.add(swordAttack, true);
    return swordAttack;
  }

  public update() {
    this.getChildren().forEach((swordAttack) =>
      (swordAttack as SwordAttack).update(),
    );
  }
}
