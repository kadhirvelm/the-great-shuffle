export class AssetManager {
  public constructor(private scene: Phaser.Scene) {
    this.scene.load.setBaseURL("http://localhost:8080/");

    this.loadVisualAssets();
    this.loadAudioAssets();
  }

  private loadVisualAssets() {
    this.loadBackground();
    this.loadWeapon();
    this.loadMonsters();
    this.loadPlayer();
    this.loadPowers();
  }

  private loadBackground() {
    this.scene.load.image("tree", "visual/tree.jpg");
    this.scene.load.image("platform_texture", "visual/platform_texture.jpg");
    this.scene.load.image("ladder", "visual/ladder.png");
  }

  private loadWeapon() {
    this.scene.load.image("sword", "visual/weapons/sword/iron-1.png");
    this.scene.load.image("spear", "visual/weapons/spear/calm winds-1.png");
    this.scene.load.image("rod", "visual/weapons/rod/sun god-1.png");
    this.scene.load.image("shield", "visual/weapons/shield/steel-1.png");
  }

  private loadPlayer() {
    this.scene.load.spritesheet(
      "idle",
      "visual/player/idle-100x256-65.fixed.png",
      {
        frameWidth: 100,
        frameHeight: 256,
      },
    );
    this.scene.load.spritesheet(
      "jump",
      "visual/player/jump-205x256-25.fixed.png",
      {
        frameWidth: 205,
        frameHeight: 256,
      },
    );
    this.scene.load.spritesheet(
      "run",
      "visual/player/running-195x256-20.fixed.png",
      {
        frameWidth: 195,
        frameHeight: 256,
      },
    );

    this.scene.load.spritesheet("dash", "visual/dash.png", {
      frameWidth: 55,
      frameHeight: 70,
    });
    this.scene.load.spritesheet("climb", "visual/climb.png", {
      frameWidth: 55,
      frameHeight: 70,
    });
  }

  private loadPowers() {
    this.scene.load.image("ranged_attack", "visual/powers/water/ranged/1.png");
    this.scene.load.image("aura_attack", "visual/powers/water/aura/1.png");
    this.scene.load.image(
      "enforcement",
      "visual/powers/water/enforcement/1.png",
    );
  }

  private loadMonsters() {
    this.scene.load.image("level_1", "visual/monsters/mud imp-1.png");
    this.scene.load.image("level_2", "visual/monsters/mud imp-2.png");
    this.scene.load.image("level_3", "visual/monsters/mud imp-3.png");
  }

  private loadAudioAssets() {
    this.scene.load.audio("ranged_attack", "audio/ranged_attack.mp3");
    this.scene.load.audio("dash", "audio/dash.mp3");
  }
}
