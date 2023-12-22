export class TreeEnvironment extends Phaser.Physics.Arcade.StaticGroup {
  public background: Phaser.GameObjects.Image;

  public constructor(scene: Phaser.Scene) {
    super(scene.physics.world, scene);

    this.background = scene.add.image(0, 0, "tree").setOrigin(0, 0).setScale(3);
    this.background.setAlpha(0.85);

    scene.physics.world.setBounds(
      0,
      0,
      this.background.displayWidth,
      this.background.displayHeight,
    );

    this.createPlatforms();
  }

  private createPlatforms() {
    const platforms: [number, number, number][] = [
      [0, this.background.displayHeight - 40, this.background.displayWidth],
    ];

    for (const platform of platforms) {
      const bottom = this.create(
        platform[0] + platform[2] / 2,
        platform[1] - 40,
        "platform_texture",
      );
      bottom.displayWidth = platform[2];
      bottom.displayHeight = 40;
      bottom.refreshBody();
    }
  }
}
