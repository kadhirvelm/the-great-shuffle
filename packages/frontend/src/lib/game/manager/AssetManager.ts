export class AssetManager {
  public constructor(private scene: Phaser.Scene) {
    this.scene.load.setBaseURL("http://localhost:8080");

    this.loadBackground();
    this.loadAttacks();
    this.loadPlayer();
    this.loadMonster();
  }

  private loadBackground() {
    this.scene.load.image("tree", "tree.jpg");

    this.scene.load.image("platform_texture", "platform_texture.jpg");
  }

  private loadAttacks() {
    this.scene.load.image("ranged_attack", "ranged_attack.png");
  }

  private loadPlayer() {
    this.scene.load.spritesheet("idle", "idle.png", {
      frameWidth: 55,
      frameHeight: 70,
    });
    this.scene.load.spritesheet("dash", "dash.png", {
      frameWidth: 55,
      frameHeight: 70,
    });
    this.scene.load.spritesheet("jump", "jump.png", {
      frameWidth: 55,
      frameHeight: 70,
    });
    this.scene.load.spritesheet("walk", "walk.png", {
      frameWidth: 55,
      frameHeight: 70,
    });
  }

  private loadMonster() {
    this.scene.load.spritesheet("monster", "monster.png", {
      frameWidth: 40,
      frameHeight: 40,
    });
  }
}
