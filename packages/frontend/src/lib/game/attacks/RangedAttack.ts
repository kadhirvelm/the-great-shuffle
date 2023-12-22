import { Movement } from "../constants/Movement";

export interface RangedAttackAttributes {
  damage: number;
  range: number;
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
    this.typedBody.setCollideWorldBounds(true);
    this.typedBody.onWorldBounds = true;
    this.typedBody.setAllowGravity(false);

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
      Movement.player_projectile_x,
      (this.body?.velocity ?? undefined) as Phaser.Math.Vector2 | undefined,
    );

    this.typedBody.setAngularVelocity(200);
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

  public destroy(fromScene?: boolean) {
    if (this.isDestroyed) {
      return;
    }

    if (this.attributes === undefined) {
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
