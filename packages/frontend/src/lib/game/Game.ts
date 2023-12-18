"use client";

import { Game, Scene } from "phaser";

export class TutorialGame {
  private game: Game;

  constructor(private parent: HTMLElement) {
    this.game = new Game({
      height: 600,
      width: 800,
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
    this.game.destroy(true);
  }
}

class TutorialScene extends Scene {
  private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | undefined;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;

  public constructor() {
    super();
  }

  public preload() {
    this.load.setBaseURL("http://localhost:8080");
    this.load.image("sky", "sky.png");
    this.load.image("ground", "platform.png");
    this.load.image("star", "star.png");
    this.load.image("bomb", "bomb.png");
    this.load.spritesheet("dude", "dude.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  public create() {
    this.add.image(400, 300, "sky");

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
    const player = this.physics.add.sprite(100, 450, "dude");

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
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
    console.log("Setting the cursors", this.cursors);

    if (this.cursors === undefined || this.player === undefined) {
      return;
    }

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play("left", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play("right", true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play("turn");
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }
  }
}
