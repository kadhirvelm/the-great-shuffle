import { Store } from "@reduxjs/toolkit";
import { State } from "../../store/configureStore";
import { getStore } from "../store/storeManager";
import { Player } from "../player/Player";

export interface MonsterInteraction {
  player: Player;
}

export class Monster extends Phaser.GameObjects.Sprite {
  public typedBody: Phaser.Physics.Arcade.Body;

  private store: Store<State>;

  public constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    private monsterInteractions: MonsterInteraction,
  ) {
    super(scene, x, y, "monster");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.typedBody = this.body as Phaser.Physics.Arcade.Body;
    this.store = getStore();

    this.initializePhysics();
    this.setAnimations();
  }

  public update() {
    const distanceToPlayer = Phaser.Math.Distance.Between(
      this.x,
      this.y,
      this.monsterInteractions.player.x,
      this.monsterInteractions.player.y,
    );

    if (distanceToPlayer < 200) {
      const direction = Math.sign(this.monsterInteractions.player.x - this.x);
      this.typedBody.setVelocityX(100 * direction);
    } else {
      this.typedBody.setVelocityX(0);
    }
  }

  private initializePhysics() {
    this.typedBody.setBounce(0.2);
    this.typedBody.setCollideWorldBounds(true);
  }

  private setAnimations() {
    this.anims.create({
      key: "monster",
      frames: this.anims.generateFrameNumbers("monster", { start: 0, end: 11 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.play("monster", true);
  }
}
