export class Ladders extends Phaser.Physics.Arcade.StaticGroup {
  public constructor(scene: Phaser.Scene) {
    super(scene.physics.world, scene);

    this.createLadders();
  }

  private createLadders() {
    // x, y, width
    const ladders: [number, number][] = [
      [182, 2780],
      [182, 2470],
    ];

    for (const ladder of ladders) {
      this.create(ladder[0], ladder[1], "ladder");
    }
  }
}
