export class Ladders extends Phaser.Physics.Arcade.StaticGroup {
  public constructor(scene: Phaser.Scene) {
    super(scene.physics.world, scene);
  }

  public createLadders(ladders: [number, number, number, number][]) {
    for (const ladder of ladders) {
      const [x, y, width, height] = ladder;
      const newLadder = this.create(x, y);

      newLadder.displayHeight = height;
      newLadder.displayWidth = width;
      newLadder.setVisible(false);
      newLadder.refreshBody();

      this.scene.add.tileSprite(x, y, width, height, "ladder");
    }
  }
}
