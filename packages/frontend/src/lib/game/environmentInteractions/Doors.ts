export class Door extends Phaser.GameObjects.Sprite {
  public constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    public onInteraction: () => void,
  ) {
    super(scene, x, y, "door");
    scene.add.existing(this);
  }
}

export class Doors extends Phaser.Physics.Arcade.StaticGroup {
  public constructor(scene: Phaser.Scene) {
    super(scene.physics.world, scene);
  }

  public createDoors(doors: [number, number, () => void][]) {
    for (const door of doors) {
      const [x, y, onInteraction] = door;
      const newDoor = new Door(this.scene, x, y, onInteraction);
      this.add(newDoor);
    }
  }
}
