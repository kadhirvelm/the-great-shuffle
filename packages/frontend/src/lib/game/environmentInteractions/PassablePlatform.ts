export class PassablePlatform extends Phaser.Physics.Arcade.StaticGroup {
  public constructor(scene: Phaser.Scene) {
    super(scene.physics.world, scene);
  }

  public createPassablePlatforms(platforms: [number, number, number][]) {
    for (const platform of platforms) {
      const [x, y, width] = platform;
      const newPlatform = this.create(x, y);
      newPlatform.displayHeight = 20;
      newPlatform.displayWidth = width;
      newPlatform.setVisible(false);
      newPlatform.refreshBody();

      this.scene.add.tileSprite(x, y, width, 20, "passable_platform");
    }
  }
}
