"use client";

import { Store } from "@reduxjs/toolkit";
import { Game, Scene } from "phaser";
import { State } from "../store/configureStore";
import { setStore, removeStore, getStore } from "./store/reduxStore";

export class PrimaryGame {
  private game: Game;

  constructor(
    private parent: HTMLElement,
    store: Store<State>,
  ) {
    setStore(store);

    this.game = new Game({
      type: Phaser.AUTO,
      parent: this.parent,
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 300 },
        },
      },
      backgroundColor: "#000",
      scene: TutorialScene,
    });
  }

  public destroyGame() {
    removeStore();
    this.game.destroy(true);
  }
}

class TutorialScene extends Scene {
  private store: Store<State>;
  private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | undefined;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;

  public constructor() {
    super();

    this.store = getStore();
  }

  public preload() {
    this.load.setBaseURL("http://localhost:8080");

    this.load.image("woods", "woods.jpg");
    this.load.image("temple", "temple.jpg");
    this.load.image("lava", "lava.jpg");

    this.load.image("block", "block.png");

    this.load.spritesheet("idle", "idle.png", {
      frameWidth: 55,
      frameHeight: 70,
    });
    this.load.spritesheet("jump", "jump.png", {
      frameWidth: 55,
      frameHeight: 70,
    });
    this.load.spritesheet("walk", "walk.png", {
      frameWidth: 55,
      frameHeight: 70,
    });

    this.load.spritesheet("monster", "monster.png", {
      frameWidth: 40,
      frameHeight: 40,
    });
  }

  public create() {
    const background = this.add.image(0, 0, "woods").setOrigin(0, 0);
    this.physics.world.setBounds(
      0,
      0,
      background.displayWidth,
      background.displayHeight,
    );

    const platforms = this.createPlatforms(background);
    this.player = this.createPlayer();

    this.physics.add.collider(this.player, platforms);

    this.createKeyboard();

    this.cameras.main.setBounds(
      0,
      0,
      background.displayWidth,
      background.displayHeight,
    );
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setZoom(1);
  }

  private createPlatforms(background: Phaser.GameObjects.Image) {
    const platforms = this.physics.add.staticGroup();

    const bottom = platforms.create(
      background.displayWidth / 2,
      background.displayHeight,
      undefined,
      undefined,
      false,
    );
    bottom.displayWidth = background.displayWidth;
    bottom.displayHeight = 5;
    bottom.refreshBody();

    return platforms;
  }

  private createPlayer() {
    const player = this.physics.add.sprite(500, 800, "idle");

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers("walk", { start: 0, end: 7 }),
      frameRate: 25,
      repeat: -1,
    });

    this.anims.create({
      key: "jump",
      frames: this.anims.generateFrameNumbers("jump", { start: 0, end: 1 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("idle", { start: 0, end: 0 }),
    });

    return player;
  }

  private createKeyboard() {
    this.cursors = this.input.keyboard?.createCursorKeys();
  }

  public update() {
    if (this.cursors === undefined || this.player === undefined) {
      return;
    }

    if (!this.player.body.touching.down) {
      this.player.setVelocityX(this.player.body.velocity.x * 0.995);
      this.player.anims.play("jump", true);
      return;
    }

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-300);
      this.player.setFlipX(true);
      this.player.anims.play("walk", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(300);
      this.player.setFlipX(false);
      this.player.anims.play("walk", true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play("idle", true);
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
      return;
    }
  }
}
