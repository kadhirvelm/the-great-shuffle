import { Store } from "@reduxjs/toolkit";
import { State } from "../../store/configureStore";
import { getStore } from "../store/reduxStore";

export class Monster extends Phaser.GameObjects.Sprite {
  public typedBody: Phaser.Physics.Arcade.Body;

  private store: Store<State>;

  public constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "monster");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.typedBody = this.body as Phaser.Physics.Arcade.Body;
    this.store = getStore();

    this.initializePhysics();
    this.setAnimations();
  }

  private initializePhysics() {
    this.typedBody.setBounce(0.2);
    this.typedBody.setCollideWorldBounds(true);

    this.typedBody.setMass(10);
    this.typedBody.setMaxVelocityX(10);
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
