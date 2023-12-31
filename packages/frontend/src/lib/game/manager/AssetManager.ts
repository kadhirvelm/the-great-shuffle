import {
  GameState,
  WeaponSlot,
  WeaponSlotNumber,
} from "../../store/reducer/gameState";
import { assembleWeaponLocation } from "../../utils/assembleAssetLocation";
import { getStore } from "../store/storeManager";

export class AssetManager {
  private loadedAssets: {
    slotA: string | undefined;
    slotB: string | undefined;
  } = { slotA: undefined, slotB: undefined };

  public constructor(private scene: Phaser.Scene) {
    this.scene.load.setBaseURL("http://localhost:8080/");

    this.loadVisualAssets();
    this.loadAudioAssets();

    const reduxStore = getStore();
    reduxStore.subscribe(() => {
      this.loadWeaponAssets(reduxStore.getState().gameState);
    });

    this.loadWeaponAssets(reduxStore.getState().gameState);
  }

  private loadWeaponAssets(gameState: GameState) {
    const maybeLoadSlot = (
      slot: WeaponSlot | undefined,
      slotName: WeaponSlotNumber,
    ) => {
      if (
        this.loadedAssets[slotName] !== slot?.assetName &&
        slot !== undefined
      ) {
        this.scene.load.image(
          slotName,
          assembleWeaponLocation(slot.assetName, slot.type, false),
        );

        this.loadedAssets[slotName] = slot.assetName;
      }
    };

    const slotA = gameState.playerEquipment.weapons[0];
    const slotB = gameState.playerEquipment.weapons[1];

    maybeLoadSlot(slotA, "slotA");
    maybeLoadSlot(slotB, "slotB");

    // this.scene.load.image("sword", "visual/weapons/sword/dragon steel-3.png");
    // this.scene.load.image("spear", "visual/weapons/spear/calm winds-3.png");
    // this.scene.load.image("rod", "visual/weapons/rod/sun god-3.png");
    // this.scene.load.image("shield", "visual/weapons/shield/steel-3.png");
  }

  private loadVisualAssets() {
    this.loadBackground();
    this.loadMonsters();
    this.loadPlayer();
    this.loadPowers();
  }

  private loadBackground() {
    this.scene.load.image("tree", "visual/tree.jpg");
    this.scene.load.image("platform_texture", "visual/platform_texture.jpg");
    this.scene.load.image("ladder", "visual/ladder.png");
  }

  private loadPlayer() {
    this.scene.load.spritesheet("idle", "visual/player/idle-110x256-75.png", {
      frameWidth: 110,
      frameHeight: 256,
    });
    this.scene.load.spritesheet("jump", "visual/player/jump-140x256-70.png", {
      frameWidth: 140,
      frameHeight: 256,
    });
    this.scene.load.spritesheet("run", "visual/player/running-205x256-30.png", {
      frameWidth: 205,
      frameHeight: 256,
    });

    this.scene.load.spritesheet("dash", "visual/player/dash-170x256-50.png", {
      frameWidth: 170,
      frameHeight: 256,
    });
    this.scene.load.spritesheet(
      "climb",
      "visual/player/climbing-110x256-110.png",
      {
        frameWidth: 110,
        frameHeight: 256,
      },
    );
  }

  private loadPowers() {
    this.scene.load.image(
      "ranged_attack",
      "visual/powers/lightning/ranged/3.png",
    );
    this.scene.load.image("aura_attack", "visual/powers/lightning/aura/3.png");
    this.scene.load.image(
      "enforcement",
      "visual/powers/lightning/enforcement/3.png",
    );
  }

  private loadMonsters() {
    this.scene.load.image("level_1", "visual/monsters/sand dragon-1.png");
    this.scene.load.image("level_2", "visual/monsters/sand dragon-2.png");
    this.scene.load.image("level_3", "visual/monsters/sand dragon-3.png");
  }

  private loadAudioAssets() {
    this.scene.load.audio("ranged_attack", "audio/ranged_attack.mp3");
    this.scene.load.audio("dash", "audio/dash.mp3");
  }
}
