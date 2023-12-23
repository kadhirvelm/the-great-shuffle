"use client";

import { Store } from "@reduxjs/toolkit";
import { Game, Scene } from "phaser";
import { State } from "../store/configureStore";
import { RangedAttackGroup } from "./attacks/RangedAttackGroup";
import { Camera } from "./camera/Camera";
import { TreeEnvironment } from "./environment/TreeEnvironment";
import { CollisionManager } from "./manager/CollisionManager";
import { Keyboard } from "./keyboard/Keyboard";
import { AssetManager } from "./manager/AssetManager";
import { Monster } from "./monster/Monster";
import { Player } from "./player/Player";
import { removeStore, setStore } from "./store/storeManager";
import { MonsterGroup } from "./monster/MonsterGroup";
import { Gravity } from "./constants/Gravity";
import { AuraAttackGroup } from "./attacks/AuraAttackGroup";
import { CloseAttackGroup } from "./attacks/CloseAttackGroup";
import { CloseAttackHitboxGroup } from "./attacks/CloseAttackHitbox";

export class PrimaryGame {
  private game: Game;

  constructor(
    private parent: HTMLElement,
    store: Store<State>,
  ) {
    setStore(store);

    this.game = new Game({
      width: 1792,
      height: 999,
      type: Phaser.AUTO,
      parent: this.parent,
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: Gravity.generic },
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
  private player: Player | undefined;
  private monsterGroup: MonsterGroup | undefined;
  private rangedAttackGroup: RangedAttackGroup | undefined;
  private auraAttackGroup: AuraAttackGroup | undefined;
  private closeAttackHitbox: CloseAttackHitboxGroup | undefined;
  private closeAttackGroup: CloseAttackGroup | undefined;

  public preload() {
    new AssetManager(this);
  }

  public create() {
    const environment = new TreeEnvironment(this);
    this.rangedAttackGroup = new RangedAttackGroup(this);
    this.auraAttackGroup = new AuraAttackGroup(this);
    this.closeAttackHitbox = new CloseAttackHitboxGroup(this);
    this.closeAttackGroup = new CloseAttackGroup(this, this.closeAttackHitbox);

    this.player = new Player(this, 500, 2900, {
      keyboard: new Keyboard(this),
      rangedAttackGroup: this.rangedAttackGroup,
      auraAttackGroup: this.auraAttackGroup,
      closeAttackGroup: this.closeAttackGroup,
    });
    this.monsterGroup = new MonsterGroup(this);

    this.monsterGroup.add(
      new Monster(this, 900, 2900, { player: this.player }),
    );

    new CollisionManager(this, {
      player: this.player,
      monsterGroup: this.monsterGroup,
      environment: environment,
      rangedAttacks: this.rangedAttackGroup,
      auraAttacks: this.auraAttackGroup,
      closeAttacksHitbox: this.closeAttackHitbox,
    });

    const camera = new Camera(this, environment.background);
    camera.followPlayer(this.player);
  }

  public update() {
    if (
      this.player === undefined ||
      this.monsterGroup === undefined ||
      this.rangedAttackGroup === undefined ||
      this.auraAttackGroup === undefined ||
      this.closeAttackGroup === undefined
    ) {
      return;
    }

    this.player.update();
    this.monsterGroup.update();
    this.rangedAttackGroup.update();
    this.auraAttackGroup.update();
    this.closeAttackGroup.update();
  }
}
