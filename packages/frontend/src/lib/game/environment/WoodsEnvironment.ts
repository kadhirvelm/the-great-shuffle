export class WoodsEnvironment extends Phaser.Physics.Arcade.StaticGroup {
  public background: Phaser.GameObjects.Image;

  public constructor(scene: Phaser.Scene) {
    super(scene.physics.world, scene);

    this.background = scene.add.image(0, 0, "woods").setOrigin(0, 0);

    scene.physics.world.setBounds(
      0,
      0,
      this.background.displayWidth,
      this.background.displayHeight,
    );

    this.createPlatforms();
  }

  private createPlatforms() {
    const bottom = this.create(
      this.background.displayWidth / 2,
      this.background.displayHeight - 100,
      undefined,
      undefined,
      false,
    );
    bottom.displayWidth = this.background.displayWidth;
    bottom.displayHeight = 5;
    bottom.refreshBody();
  }
}
