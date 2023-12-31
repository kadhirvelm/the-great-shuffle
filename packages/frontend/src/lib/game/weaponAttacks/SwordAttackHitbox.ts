import { SwordAttack } from "./SwordAttack";

export interface SwordAttackHitboxAttributes {
  x: number;
  y: number;
  direction: "left" | "right";
  width: number;
  height: number;
}

export class SwordAttackHitbox extends Phaser.Physics.Arcade.Sprite {
  public constructor(
    scene: Phaser.Scene,
    swordAttackAttributes: SwordAttackHitboxAttributes,
    public swordAttackDetails: SwordAttack,
  ) {
    super(
      scene,
      swordAttackAttributes.x,
      swordAttackAttributes.y,
      "platform_texture",
    );

    this.setVisible(false);

    this.displayWidth = swordAttackAttributes.width;
    this.displayHeight = swordAttackAttributes.height;

    if (swordAttackAttributes.direction === "left") {
      this.setOrigin(1, 0.5);
    } else {
      this.setOrigin(0, 0.5);
    }
  }
}

export class SwordAttackHitboxGroup extends Phaser.Physics.Arcade.StaticGroup {
  public constructor(scene: Phaser.Scene) {
    super(scene.physics.world, scene);
  }

  public createHitbox(
    swordAttackAttributes: SwordAttackHitboxAttributes,
    swordAttack: SwordAttack,
  ) {
    const hitbox = new SwordAttackHitbox(
      this.scene,
      swordAttackAttributes,
      swordAttack,
    );

    this.add(hitbox, true);
    hitbox.refreshBody();

    return hitbox;
  }
}
