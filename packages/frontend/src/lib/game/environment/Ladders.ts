export class Ladders extends Phaser.Physics.Arcade.StaticGroup {
  public constructor(scene: Phaser.Scene) {
    super(scene.physics.world, scene);
  }

  public createLadders(ladders: [number, number][]) {
    for (const ladder of ladders) {
      this.create(ladder[0], ladder[1], "ladder");
    }
  }
}
