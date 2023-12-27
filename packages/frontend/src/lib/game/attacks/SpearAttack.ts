import { v4 } from "uuid";
import { PushBack } from "../monster/Monster";

export interface SpearAttackAttributes {
  damage: number;
  range: number;
  velocity: number;
  pushBack: PushBack;
}

export class SpearAttack extends Phaser.GameObjects.Sprite {
  public attributes: SpearAttackAttributes | undefined;
  public typedBody: Phaser.Physics.Arcade.Body;
  public spearAttackId = v4();
  public isDestroyed: boolean = false;

  private initialPosition: { x: number; y: number } | undefined;

  public constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "fire_spear");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.typedBody = this.body as Phaser.Physics.Arcade.Body;

    this.setScale(0.5);
    this.setOrigin(0, 0.5);

    this.setActive(false);
    this.setVisible(false);
  }

  public fire(
    x: number,
    y: number,
    direction: "left" | "right",
    attributes: SpearAttackAttributes,
  ) {
    this.attributes = attributes;
    this.spearAttackId = v4();
    this.initialPosition = { x, y };
    this.setPosition(x, y);

    this.setActive(true);
    this.setVisible(true);

    if (direction === "left") {
      this.setRotation(Phaser.Math.DegToRad(180));
    }

    this.scene.physics.velocityFromAngle(
      direction === "left" ? 180 : 0,
      this.attributes.velocity,
      (this.body?.velocity ?? undefined) as Phaser.Math.Vector2 | undefined,
    );
  }

  public update() {
    if (
      this.isDestroyed ||
      this.initialPosition === undefined ||
      this.attributes === undefined
    ) {
      return;
    }

    const distanceTraveled = Phaser.Math.Distance.Between(
      this.initialPosition.x,
      this.initialPosition.y,
      this.x,
      this.y,
    );

    if (distanceTraveled < this.attributes.range) {
      return;
    }

    this.destroy();
  }

  public destroy() {
    if (this.isDestroyed || this.attributes === undefined) {
      return;
    }

    this.isDestroyed = true;
    this.attributes.damage = 0;

    this.scene.tweens.add({
      targets: this,
      alpha: { from: 1, to: 0 },
      duration: 200,
      onComplete: () => {
        super.destroy();
      },
    });
  }
}
