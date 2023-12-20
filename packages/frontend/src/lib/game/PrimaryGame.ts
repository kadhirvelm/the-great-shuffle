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
    this.load.image("sky", "sky.png");
    this.load.image("ground", "platform.png");
    this.load.image("star", "star.png");
    this.load.image("bomb", "bomb.png");

    this.load.spritesheet("run", "run.png", {
      frameWidth: 48,
      frameHeight: 48,
    });
    this.load.spritesheet("idle", "idle.png", {
      frameWidth: 48,
      frameHeight: 48,
    });
  }

  public create() {
    const background = this.add.image(0, 0, "sky").setOrigin(0, 0);

    const platforms = this.createPlatforms();
    this.player = this.createPlayer();
    const stars = this.createStars();

    this.physics.add.collider(this.player, platforms);
    this.physics.add.collider(stars, platforms);

    this.physics.add.overlap(
      this.player,
      stars,
      (_player, star) => (star as any).disableBody(true, true),
      undefined,
      this,
    );

    this.createKeyboard();

    this.cameras.main.setBounds(
      0,
      0,
      background.displayWidth,
      background.displayHeight,
    );
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setZoom(1.5);
  }

  private createPlatforms() {
    const platforms = this.physics.add.staticGroup();

    platforms.create(400, 568, "ground").setScale(2).refreshBody();
    platforms.create(600, 400, "ground");
    platforms.create(50, 250, "ground");
    platforms.create(750, 220, "ground");

    return platforms;
  }

  private createPlayer() {
    const player = this.physics.add.sprite(100, 450, "idle").setScale(2);

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.anims.create({
      key: "run",
      frames: this.anims.generateFrameNumbers("run", { start: 0, end: 7 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("idle", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    return player;
  }

  private createKeyboard() {
    this.cursors = this.input.keyboard?.createCursorKeys();
  }

  private createStars() {
    const stars = this.physics.add.group({
      key: "star",
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 },
    });

    stars.children.iterate((child) => {
      const childBody = child as unknown as Phaser.Physics.Arcade.Body;
      childBody.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

      return null;
    });

    return stars;
  }

  public update() {
    if (this.cursors === undefined || this.player === undefined) {
      return;
    }

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-200);
      this.player.setFlipX(true);
      this.player.anims.play("run", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(200);
      this.player.setFlipX(false);
      this.player.anims.play("run", true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play("idle", true);
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }
  }
}
