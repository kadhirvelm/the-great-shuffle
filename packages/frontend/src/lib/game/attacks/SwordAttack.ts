import { v4 } from "uuid";
import { SwordAttackHitboxGroup } from "./SwordAttackHitbox";

export interface SwordAttackAttributes {
  damage: number;
}

export class SwordAttack extends Phaser.GameObjects.Sprite {
  public attributes: SwordAttackAttributes | undefined;
  public typedBody: Phaser.Physics.Arcade.Body;
  public swordAttackId = v4();
  public hitbox: Phaser.GameObjects.Rectangle | undefined;

  public constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    private swordAttackHitbox: SwordAttackHitboxGroup,
  ) {
    super(scene, x, y, "fire_sword");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.typedBody = this.body as Phaser.Physics.Arcade.Body;

    this.setScale(0.5);

    this.setActive(false);
    this.setVisible(false);
  }

  public fire(
    x: number,
    y: number,
    direction: "left" | "right",
    attributes: SwordAttackAttributes,
  ) {
    this.attributes = attributes;
    this.swordAttackId = v4();

    this.setOrigin(0.5, 1);
    this.setPosition(x, y);

    this.setActive(true);
    this.setVisible(true);

    const squareDimension = this.height * this.scaleY;

    const hitbox = this.swordAttackHitbox.createHitbox(
      {
        x: this.x,
        y: this.y,
        direction,
        width: squareDimension,
        height: squareDimension * 2,
      },
      this,
    );

    const timeline = this.scene.add.timeline([
      {
        at: 0,
        tween: {
          targets: this,
          rotation: {
            from: Phaser.Math.DegToRad(0),
            to:
              direction === "right"
                ? Phaser.Math.DegToRad(180)
                : Phaser.Math.DegToRad(-180),
          },
          duration: 125,
          onComplete: () => {
            hitbox.destroy();
            this.destroy();
          },
          ease: "Sine.easeInOut",
        },
      },
    ]);

    timeline.play();
  }
}
