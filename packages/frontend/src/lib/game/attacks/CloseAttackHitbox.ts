import { CloseAttack } from "./CloseAttack";

export interface CloseAttackHitboxAttributes {
  x: number;
  y: number;
  direction: "left" | "right";
  width: number;
  height: number;
}

export class CloseAttackHitbox extends Phaser.Physics.Arcade.Sprite {
  public constructor(
    scene: Phaser.Scene,
    closeAttackAttributes: CloseAttackHitboxAttributes,
    public closeAttackDetails: CloseAttack,
  ) {
    super(
      scene,
      closeAttackAttributes.x,
      closeAttackAttributes.y,
      "platform_texture",
    );

    this.setVisible(false);

    this.displayWidth = closeAttackAttributes.width;
    this.displayHeight = closeAttackAttributes.height;

    if (closeAttackAttributes.direction === "left") {
      this.setOrigin(1, 0.5);
    } else {
      this.setOrigin(0, 0.5);
    }
  }
}

export class CloseAttackHitboxGroup extends Phaser.Physics.Arcade.StaticGroup {
  public constructor(scene: Phaser.Scene) {
    super(scene.physics.world, scene);
  }

  public createHitbox(
    closeAttackAttributes: CloseAttackHitboxAttributes,
    closeAttack: CloseAttack,
  ) {
    const hitbox = new CloseAttackHitbox(
      this.scene,
      closeAttackAttributes,
      closeAttack,
    );

    console.log("Created hitbox!");

    this.add(hitbox, true);
    hitbox.refreshBody();

    return hitbox;
  }
}
