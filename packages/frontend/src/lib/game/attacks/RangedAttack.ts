import { Movement } from "../constants/Movement";
import { PushBack } from "../monster/Monster";

export interface RangedAttackAttributes {
  damage: number;
  range: number;
  pushBack: PushBack;
}

export class RangedAttack extends Phaser.GameObjects.Sprite {
  public attributes: RangedAttackAttributes | undefined;
  public typedBody: Phaser.Physics.Arcade.Body;
  public isDestroyed: boolean = false;

  private initialPosition: { x: number; y: number } | undefined;

  public constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "ranged_attack");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.typedBody = this.body as Phaser.Physics.Arcade.Body;

    this.setScale(0.15);

    this.setActive(false);
    this.setVisible(false);

    this.initializePhysics();
  }

  private initializePhysics() {
    this.typedBody.onWorldBounds = true;

    this.typedBody.world.on(
      "worldbounds",
      (body: Phaser.Physics.Arcade.Body) => {
        if (body.gameObject !== this) {
          return;
        }

        this.destroy();
      },
    );
  }

  public fire(
    x: number,
    y: number,
    direction: "left" | "right",
    attributes: RangedAttackAttributes,
  ) {
    this.attributes = attributes;
    this.initialPosition = { x, y };
    this.setPosition(x, y);

    this.setActive(true);
    this.setVisible(true);

    this.scene.physics.velocityFromAngle(
      direction === "left" ? 180 : 0,
      Movement.player_projectile_x,
      (this.body?.velocity ?? undefined) as Phaser.Math.Vector2 | undefined,
    );

    this.typedBody.setAngularVelocity(200);
    this.scene.sound.play("ranged_attack");
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

  public destroy(fromScene?: boolean) {
    if (this.isDestroyed || this.attributes === undefined) {
      return;
    }

    this.isDestroyed = true;
    this.attributes.damage = 0;

    this.scene.tweens.add({
      targets: this,
      alpha: { from: 1, to: 0 },
      scale: { from: this.scale, to: this.scale * 1.2 },
      duration: 200,
      onComplete: () => {
        super.destroy(fromScene);
      },
    });
  }
}
