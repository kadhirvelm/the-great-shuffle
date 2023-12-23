import { v4 } from "uuid";
import { CloseAttackHitboxGroup } from "./CloseAttackHitbox";

export interface CloseAttackAttributes {
  damage: number;
}

export class CloseAttack extends Phaser.GameObjects.Sprite {
  public attributes: CloseAttackAttributes | undefined;
  public typedBody: Phaser.Physics.Arcade.Body;
  public closeAttackId = v4();
  public hitbox: Phaser.GameObjects.Rectangle | undefined;

  public constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    private closeAttackHitbox: CloseAttackHitboxGroup,
  ) {
    super(scene, x, y, "fire_sword");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.typedBody = this.body as Phaser.Physics.Arcade.Body;

    this.setScale(0.25);

    this.setActive(false);
    this.setVisible(false);

    this.initializePhysics();
  }

  private initializePhysics() {
    this.typedBody.setAllowGravity(false);
    this.typedBody.setCollideWorldBounds(false);
  }

  public fire(
    x: number,
    y: number,
    direction: "left" | "right",
    attributes: CloseAttackAttributes,
  ) {
    this.attributes = attributes;
    this.setOrigin(0.5, 1);
    this.setPosition(x, y);

    this.setActive(true);
    this.setVisible(true);

    const squareDimension = this.height * this.scaleY;

    const hitbox = this.closeAttackHitbox.createHitbox(
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
          duration: 200,
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
