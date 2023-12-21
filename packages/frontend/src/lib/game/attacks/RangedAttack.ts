import { Movement } from "../constants/Movement";

export interface RangedAttackAttributes {
  damage: number;
  range: number;
}

export class RangedAttack extends Phaser.GameObjects.Sprite {
  public attributes: RangedAttackAttributes | undefined;

  private initialPosition: { x: number; y: number } | undefined;

  public constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "ranged_attack");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    (this.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);
    (this.body as Phaser.Physics.Arcade.Body).onWorldBounds = true;
    (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

    (this.body as Phaser.Physics.Arcade.Body).world.on(
      "worldbounds",
      (body: Phaser.Physics.Arcade.Body) => {
        if (body.gameObject !== this) {
          return;
        }

        this.destroy();
      },
    );

    this.setScale(0.15);

    this.setActive(false);
    this.setVisible(false);
  }

  public fire(
    x: number,
    y: number,
    angle: number,
    attributes: RangedAttackAttributes,
  ) {
    this.attributes = attributes;
    this.initialPosition = { x, y };
    this.setPosition(x, y);

    this.setActive(true);
    this.setVisible(true);

    this.scene.physics.velocityFromAngle(
      angle,
      Movement.projectile_x,
      (this.body?.velocity ?? undefined) as Phaser.Math.Vector2 | undefined,
    );

    (this.body as Phaser.Physics.Arcade.Body).setAngularVelocity(200);
  }

  public update() {
    if (this.initialPosition === undefined || this.attributes === undefined) {
      return;
    }

    const distanceTraveled = Phaser.Math.Distance.Between(
      this.initialPosition.x,
      this.initialPosition.y,
      this.x,
      this.y,
    );

    const percentageDistanceTraveled = distanceTraveled / this.attributes.range;

    if (percentageDistanceTraveled >= 1) {
      this.destroy();
    }

    if (percentageDistanceTraveled >= 0.75) {
      this.setAlpha(
        (1 * (1 - percentageDistanceTraveled)) / percentageDistanceTraveled,
      );
    }
  }
}
