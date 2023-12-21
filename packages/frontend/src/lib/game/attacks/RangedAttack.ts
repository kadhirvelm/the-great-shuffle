export class RangedAttack extends Phaser.GameObjects.Sprite {
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
        if (body.gameObject === this) {
          this.setActive(false);
          this.setVisible(false);
        }
      },
    );

    this.setScale(0.15);

    this.setActive(false);
    this.setVisible(false);
  }

  public fire(x: number, y: number, angle: number) {
    this.setPosition(x, y);

    this.setActive(true);
    this.setVisible(true);

    this.scene.physics.velocityFromAngle(
      angle,
      1200,
      (this.body?.velocity ?? undefined) as Phaser.Math.Vector2 | undefined,
    );
  }
}
