export interface Wall {
  x: number;
  y: number;
  height: number;
  width: number;
}

export class Walls extends Phaser.Physics.Arcade.StaticGroup {
  public constructor(scene: Phaser.Scene) {
    super(scene.physics.world, scene);
  }

  public createWalls(walls: Wall[]) {
    for (const wall of walls) {
      const newWall = this.create(wall.x, wall.y);
      newWall.displayWidth = wall.width;
      newWall.displayHeight = wall.height;
      newWall.setVisible(false);
      newWall.refreshBody();

      this.scene.add.tileSprite(
        wall.x,
        wall.y,
        wall.width,
        wall.height,
        "wall",
      );
    }
  }
}
