import { ChiPower } from "@tower/api";
import { PlayerChiPower } from "../../store/reducer/PlayerChiPower";
import {
  ChiPowerSlotNumber,
  GameState,
  WeaponSlot,
  WeaponSlotNumber,
} from "../../store/reducer/gameState";
import {
  assembleChiPowerLocation,
  assembleWeaponLocation,
} from "../../utils/assembleAssetLocation";
import { getStore } from "../store/storeManager";

export class AssetManager {
  private loadedWeaponAssets: {
    "weapon-slotA": string | undefined;
    "weapon-slotB": string | undefined;
  } = { "weapon-slotA": undefined, "weapon-slotB": undefined };

  private loadedChiPowers: {
    "chiPower-slotA": string | undefined;
    "chiPower-slotB": string | undefined;
    "chiPower-slotC": string | undefined;
  } = {
    "chiPower-slotA": undefined,
    "chiPower-slotB": undefined,
    "chiPower-slotC": undefined,
  };

  public constructor(private scene: Phaser.Scene) {
    this.scene.load.setBaseURL("http://localhost:8080/");

    this.loadVisualAssets();
    this.loadAudioAssets();

    const reduxStore = getStore();
    reduxStore.subscribe(() => {
      const { gameState } = reduxStore.getState();

      this.loadWeaponAssets(gameState);
      this.loadChiPowers(gameState);
    });

    const { gameState } = reduxStore.getState();
    this.loadWeaponAssets(gameState);
    this.loadChiPowers(gameState);
  }

  private loadWeaponAssets = (gameState: GameState) => {
    const maybeLoadSlot = (
      weapon: WeaponSlot | undefined,
      slotName: WeaponSlotNumber,
    ) => {
      if (
        weapon !== undefined &&
        this.loadedWeaponAssets[slotName] !== weapon?.assetName
      ) {
        this.scene.load.image(
          slotName,
          assembleWeaponLocation(weapon.assetName, weapon.type, false),
        );

        this.loadedWeaponAssets[slotName] = weapon.assetName;
      }
    };

    const slotA = gameState.playerEquipment.weapons[0];
    const slotB = gameState.playerEquipment.weapons[1];

    maybeLoadSlot(slotA, "weapon-slotA");
    maybeLoadSlot(slotB, "weapon-slotB");
  };

  private loadChiPowers = (gameState: GameState) => {
    const maybeLoadChiPower = (
      chiPower: PlayerChiPower<ChiPower> | undefined,
      slotName: ChiPowerSlotNumber,
    ) => {
      if (
        chiPower !== undefined &&
        this.loadedChiPowers[slotName] !== chiPower.name
      ) {
        this.scene.load.image(
          slotName,
          assembleChiPowerLocation(
            chiPower.chiElement,
            chiPower.type,
            chiPower.level,
            false,
          ),
        );
        this.loadedChiPowers[slotName] = chiPower.name;
      }
    };

    const slotA = gameState.playerChiPowers[0];
    const slotB = gameState.playerChiPowers[1];
    const slotC = gameState.playerChiPowers[2];

    maybeLoadChiPower(slotA, "chiPower-slotA");
    maybeLoadChiPower(slotB, "chiPower-slotB");
    maybeLoadChiPower(slotC, "chiPower-slotC");
  };

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
    // this.scene.load.image(
    //   "ranged_attack",
    //   "visual/powers/lightning/ranged/3.png",
    // );
    // this.scene.load.image("aura_attack", "visual/powers/lightning/aura/3.png");
    // this.scene.load.image(
    //   "enforcement",
    //   "visual/powers/lightning/enforcement/3.png",
    // );
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
