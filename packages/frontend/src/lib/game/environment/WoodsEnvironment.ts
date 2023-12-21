const FIGMA_TRANSFORM = 1.346153846153846;

const convertToPixels = (num: number) => num * FIGMA_TRANSFORM;
const keepPixels = (num: number) => num / FIGMA_TRANSFORM;

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
    const platformCoordinates: [number, number, number][] = [
      [
        0,
        keepPixels(this.background.displayHeight - 10),
        keepPixels(this.background.displayWidth),
      ],
      [814, 630, 202],
      [85, 359, 70],
      [722, 545, 303],
      [618, 487, 407],
      [585, 414, 116],
      [536, 251, 145],
      [513, 386, 66],
      [457, 463, 244],
      [296, 408, 50],
      [0, 529, 447],
      [117, 492, 103],
      [0, 459, 112],
      [171, 318, 286],
      [302, 571, 260],
      [0, 601, 291],
      [564, 670, 234],
    ];

    for (const platform of platformCoordinates) {
      const width = convertToPixels(platform[2]);
      const bottom = this.create(
        convertToPixels(platform[0]) + width / 2,
        convertToPixels(platform[1]),
        undefined,
        undefined,
        false,
      );
      bottom.displayWidth = width;
      bottom.displayHeight = 5;
      bottom.refreshBody();
    }
  }
}
