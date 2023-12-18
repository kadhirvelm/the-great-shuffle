"use client";

import { Game, Scene } from "phaser";

export class TutorialGame {
  private game: Game;

  constructor(private parent: HTMLElement) {
    this.game = new Game({
      height: "100%",
      width: "100%",
      type: Phaser.AUTO,
      parent: this.parent,
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 200 },
        },
      },
      scene: TutorialScene,
    });
  }

  public destroyGame() {
    this.game.destroy(true);
  }
}

class TutorialScene extends Scene {
  public constructor() {
    super();
  }

  public preload() {
    this.load.setBaseURL("https://labs.phaser.io");
    this.load.image("sky", "assets/skies/space3.png");
    this.load.image("logo", "assets/sprites/phaser3-logo.png");
    this.load.image("red", "assets/particles/red.png");
  }

  public create() {
    this.add.image(400, 300, "sky");

    const logo = this.physics.add.image(400, 100, "logo");

    logo.setVelocity(100, 200);
    logo.setBounce(1, 1);
    logo.setCollideWorldBounds(true);

    const particles = this.add.particles(0, 0, "red", {
      speed: 100,
      scale: { start: 1, end: 0 },
      blendMode: "ADD",
    });
    particles.startFollow(logo);
  }
}
