import { range } from "lodash-es";

export class TreeEnvironment extends Phaser.Physics.Arcade.StaticGroup {
  public background: Phaser.GameObjects.Image;

  public constructor(scene: Phaser.Scene) {
    super(scene.physics.world, scene);

    this.background = scene.add.image(0, 0, "tree").setOrigin(0, 0).setScale(3);

    scene.physics.world.setBounds(
      0,
      0,
      this.background.displayWidth,
      this.background.displayHeight,
    );

    this.createPlatforms();
  }

  private createPlatforms() {
    const width = this.background.displayWidth;
    const height = this.background.displayHeight;

    const randomPlatforms = range(0, 20).map(() => {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(0, height);
      const size = Phaser.Math.Between(200, 600);
      return [x, y, size] as [number, number, number];
    });

    const platforms: [number, number, number][] = [
      [0, this.background.displayHeight - 40, this.background.displayWidth],
      ...randomPlatforms,
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
