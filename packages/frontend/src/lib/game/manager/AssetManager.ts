export class AssetManager {
  public constructor(private scene: Phaser.Scene) {
    this.scene.load.setBaseURL("http://localhost:8080/");

    this.loadVisualAssets();
    this.loadAudioAssets();
  }

  private loadVisualAssets() {
    this.loadBackground();
    this.loadAttacks();
    this.loadPlayer();
    this.loadMonsters();
    this.loadWeapons();
    this.loadModifiers();
    this.loadEquipment();
  }

  private loadBackground() {
    this.scene.load.image("tree", "visual/tree.jpg");
    this.scene.load.image("platform_texture", "visual/platform_texture.jpg");
    this.scene.load.image("ladder", "visual/ladder.png");
  }

  private loadAttacks() {
    this.scene.load.image("ranged_attack", "visual/ranged_attack.png");
    this.scene.load.image("aura_attack", "visual/aura_attack.png");
  }

  private loadPlayer() {
    this.scene.load.spritesheet("idle", "visual/idle.png", {
      frameWidth: 55,
      frameHeight: 70,
    });
    this.scene.load.spritesheet("dash", "visual/dash.png", {
      frameWidth: 55,
      frameHeight: 70,
    });
    this.scene.load.spritesheet("jump", "visual/jump.png", {
      frameWidth: 55,
      frameHeight: 70,
    });
    this.scene.load.spritesheet("walk", "visual/walk.png", {
      frameWidth: 55,
      frameHeight: 70,
    });
    this.scene.load.spritesheet("climb", "visual/climb.png", {
      frameWidth: 55,
      frameHeight: 70,
    });
  }

  private loadMonsters() {
    this.scene.load.spritesheet("mushroom", "visual/monsters/mushroom.png", {
      frameWidth: 40,
      frameHeight: 40,
    });
    this.scene.load.spritesheet("ice", "visual/monsters/ice.png", {
      frameWidth: 217,
      frameHeight: 191,
    });
  }

  private loadWeapons() {
    this.scene.load.image("fire_sword", "visual/fire_sword.png");
    this.scene.load.image("fire_spear", "visual/fire_spear.png");
    this.scene.load.image("fire_rod", "visual/fire_rod.png");
  }

  private loadModifiers() {
    this.scene.load.image("fire_enforcement", "visual/fire_enforcement.png");
  }

  private loadEquipment() {
    this.scene.load.image("fire_shield", "visual/fire_shield.png");
  }

  private loadAudioAssets() {
    this.scene.load.audio("ranged_attack", "audio/ranged_attack.mp3");
    this.scene.load.audio("dash", "audio/dash.mp3");
  }
}
