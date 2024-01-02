"use client";

import { Store } from "@reduxjs/toolkit";
import { Game, Scene } from "phaser";
import { State } from "../store/configureStore";
import { AuraAttackGroup } from "./chiPowers/AuraAttackGroup";
import { RangedAttackGroup } from "./chiPowers/RangedAttackGroup";
import { RodAttackGroup } from "./weaponAttacks/RodAttackGroup";
import { RodAttackHitboxGroup } from "./weaponAttacks/RodAttackHitbox";
import { ShieldAttackGroup } from "./weaponAttacks/ShieldAttackGroup";
import { SpearAttackGroup } from "./weaponAttacks/SpearAttackGroup";
import { SwordAttackGroup } from "./weaponAttacks/SwordAttackGroup";
import { SwordAttackHitboxGroup } from "./weaponAttacks/SwordAttackHitbox";
import { Camera } from "./camera/Camera";
import { Gravity } from "./constants/enums";
import { Ladders } from "./environment/Ladders";
import { TreeEnvironment } from "./environment/TreeEnvironment";
import { Keyboard } from "./keyboard/Keyboard";
import { AssetManager } from "./manager/AssetManager";
import { CollisionManager } from "./manager/CollisionManager";
import { EnforcementGroup } from "./chiPowers/EnforcementGroup";
import { MonsterGroup } from "./monster/MonsterGroup";
import { Player } from "./player/Player";
import { removeStore, setStore } from "./store/storeManager";
import { Walls } from "./environment/Walls";

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

  private shieldAttackGroup: ShieldAttackGroup | undefined;
  private enforcementGroup: EnforcementGroup | undefined;

  public preload() {
    new AssetManager(this);
  }

  public create() {
    this.rangedAttackGroup = new RangedAttackGroup(this);
    this.auraAttackGroup = new AuraAttackGroup(this);
    this.swordAttackHitbox = new SwordAttackHitboxGroup(this);
    this.swordAttackGroup = new SwordAttackGroup(this, this.swordAttackHitbox);
    this.spearAttackGroup = new SpearAttackGroup(this);
    this.rodAttackHitbox = new RodAttackHitboxGroup(this);
    this.rodAttackGroup = new RodAttackGroup(this, this.rodAttackHitbox);

    this.shieldAttackGroup = new ShieldAttackGroup(this);
    this.enforcementGroup = new EnforcementGroup(this);

    this.player = new Player(this, {
      keyboard: new Keyboard(this),
      rangedAttackGroup: this.rangedAttackGroup,
      auraAttackGroup: this.auraAttackGroup,
      enforcementGroup: this.enforcementGroup,

      swordAttackGroup: this.swordAttackGroup,
      spearAttackGroup: this.spearAttackGroup,
      rodAttackGroup: this.rodAttackGroup,

      shieldGroup: this.shieldAttackGroup,
    });
    this.monsterGroup = new MonsterGroup(this);

    const ladders = new Ladders(this);
    const walls = new Walls(this);
    const environment = new TreeEnvironment(this, {
      player: this.player,
      ladders: ladders,
      walls: walls,
      monsterGroup: this.monsterGroup,
    });

    new CollisionManager(this, {
      player: this.player,
      monsterGroup: this.monsterGroup,
      environment: environment,
      ladders: ladders,
      walls: walls,
      rangedAttacks: this.rangedAttackGroup,
      auraAttacks: this.auraAttackGroup,
      swordAttackHitbox: this.swordAttackHitbox,
      shieldGroup: this.shieldAttackGroup,
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
      this.shieldAttackGroup === undefined ||
      this.spearAttackGroup === undefined ||
      this.rodAttackGroup === undefined ||
      this.enforcementGroup === undefined
    ) {
      return;
    }

    this.player.update();
    this.monsterGroup.update();
    this.rangedAttackGroup.update();
    this.auraAttackGroup.update();
    this.swordAttackGroup.update();
    this.shieldAttackGroup.update();
    this.spearAttackGroup.update();
    this.rodAttackGroup.update();
    this.enforcementGroup.update();
  }
}
