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
import { Gravity } from "./constants/enums";
import { AuraAttackGroup } from "./attacks/AuraAttackGroup";
import { SwordAttackGroup } from "./attacks/SwordAttackGroup";
import { SwordAttackHitboxGroup } from "./attacks/SwordAttackHitbox";
import { ShieldGroup } from "./attacks/ShieldGroup";
import { SpearAttackGroup } from "./attacks/SpearAttackGroup";
import { RodAttackHitboxGroup } from "./attacks/RodAttackHitbox";
import { RodAttackGroup } from "./attacks/RodAttackGroup";

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
  private swordAttackHitbox: SwordAttackHitboxGroup | undefined;
  private swordAttackGroup: SwordAttackGroup | undefined;
  private spearAttackGroup: SpearAttackGroup | undefined;
  private rodAttackHitbox: RodAttackHitboxGroup | undefined;
  private rodAttackGroup: RodAttackGroup | undefined;

  private shieldGroup: ShieldGroup | undefined;

  public preload() {
    new AssetManager(this);
  }

  public create() {
    const environment = new TreeEnvironment(this);

    this.rangedAttackGroup = new RangedAttackGroup(this);
    this.auraAttackGroup = new AuraAttackGroup(this);
    this.swordAttackHitbox = new SwordAttackHitboxGroup(this);
    this.swordAttackGroup = new SwordAttackGroup(this, this.swordAttackHitbox);
    this.spearAttackGroup = new SpearAttackGroup(this);
    this.rodAttackHitbox = new RodAttackHitboxGroup(this);
    this.rodAttackGroup = new RodAttackGroup(this, this.rodAttackHitbox);

    this.shieldGroup = new ShieldGroup(this);

    this.player = new Player(this, 500, 2900, {
      keyboard: new Keyboard(this),
      rangedAttackGroup: this.rangedAttackGroup,
      auraAttackGroup: this.auraAttackGroup,
      swordAttackGroup: this.swordAttackGroup,
      shieldGroup: this.shieldGroup,
      spearAttackGroup: this.spearAttackGroup,
      rodAttackGroup: this.rodAttackGroup,
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
      swordAttackHitbox: this.swordAttackHitbox,
      shieldGroup: this.shieldGroup,
      spearAttackGroup: this.spearAttackGroup,
      rodAttackHitbox: this.rodAttackHitbox,
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
      this.swordAttackGroup === undefined ||
      this.shieldGroup === undefined ||
      this.spearAttackGroup === undefined ||
      this.rodAttackGroup === undefined
    ) {
      return;
    }

    this.player.update();
    this.monsterGroup.update();
    this.rangedAttackGroup.update();
    this.auraAttackGroup.update();
    this.swordAttackGroup.update();
    this.shieldGroup.update();
    this.spearAttackGroup.update();
    this.rodAttackGroup.update();
  }
}
