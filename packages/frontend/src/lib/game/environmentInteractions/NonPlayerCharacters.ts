export class NPC extends Phaser.GameObjects.Sprite {
  public constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    key: string,
    public onInteraction: () => void,
  ) {
    super(scene, x, y, key);
    scene.add.existing(this);
  }
}

export type AllowedNonPlayerCharacter = "weapons";

export class NonPlayerCharacters extends Phaser.Physics.Arcade.StaticGroup {
  public constructor(scene: Phaser.Scene) {
    super(scene.physics.world, scene);
  }

  public createNPCs(npcs: [number, number, AllowedNonPlayerCharacter][]) {
    for (const npc of npcs) {
      const [x, y, key] = npc;
      const newNPC = new NPC(
        this.scene,
        x,
        y,
        key,
        this.getOnInteractionForNPC(key),
      );
      this.add(newNPC);
    }
  }

  private getOnInteractionForNPC(key: AllowedNonPlayerCharacter) {
    switch (key) {
      case "weapons":
        return () => {
          console.log("You picked up a weapon!");
        };
    }
  }
}
