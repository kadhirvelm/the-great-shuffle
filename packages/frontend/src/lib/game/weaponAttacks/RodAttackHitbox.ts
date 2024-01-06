import { RodAttack } from "./RodAttack";

export interface RodAttackHitboxAttributes {
  x: number;
  y: number;
  direction: "left" | "right";
  width: number;
  height: number;
}

export class RodAttackHitbox extends Phaser.Physics.Arcade.Sprite {
  public constructor(
    scene: Phaser.Scene,
    rodAttackAttributes: RodAttackHitboxAttributes,
    public rodAttackDetails: RodAttack,
  ) {
    super(scene, rodAttackAttributes.x, rodAttackAttributes.y, "platform");

    this.setVisible(false);
    this.setActive(false);

    this.displayWidth = rodAttackAttributes.width;
    this.displayHeight = rodAttackAttributes.height;

    if (rodAttackAttributes.direction === "left") {
      this.setOrigin(1, 0.5);
    } else {
      this.setOrigin(0, 0.5);
    }
  }
}

export class RodAttackHitboxGroup extends Phaser.Physics.Arcade.StaticGroup {
  public constructor(scene: Phaser.Scene) {
    super(scene.physics.world, scene);
  }

  public createHitbox(
    rodAttackAttributes: RodAttackHitboxAttributes,
    rodAttack: RodAttack,
  ) {
    const hitbox = new RodAttackHitbox(
      this.scene,
      rodAttackAttributes,
      rodAttack,
    );

    this.add(hitbox, true);
    hitbox.refreshBody();

    return hitbox;
  }
}
