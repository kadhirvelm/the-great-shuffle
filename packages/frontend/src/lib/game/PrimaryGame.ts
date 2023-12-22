"use client";

import { Store } from "@reduxjs/toolkit";
import { Game, Scene } from "phaser";
import { State } from "../store/configureStore";
import { RangedAttackGroup } from "./attacks/RangedAttackGroup";
import { Camera } from "./camera/Camera";
import { TreeEnvironment } from "./environment/TreeEnvironment";
import { CollisionManager } from "./interactions/CollisionManager";
import { Keyboard } from "./keyboard/Keyboard";
import { AssetManager } from "./manager/AssetManager";
import { Monster } from "./monster/Monster";
import { Player } from "./player/Player";
import { removeStore, setStore } from "./store/storeManager";
import { MonsterGroup } from "./monster/MonsterGroup";
import { Gravity } from "./constants/Gravity";

export class PrimaryGame {
  private game: Game;

  constructor(
    private parent: HTMLElement,
    store: Store<State>,
  ) {
    setStore(store);

    this.game = new Game({
      width: "100%",
      height: "100%",
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

    console.log(
      this.parent.getBoundingClientRect(),
      this.game.canvas.getBoundingClientRect(),
    );
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

  public preload() {
    new AssetManager(this);
  }

  public create() {
    const environment = new TreeEnvironment(this);
    this.rangedAttackGroup = new RangedAttackGroup(this);
    this.player = new Player(this, 500, 2900, {
      keyboard: new Keyboard(this),
      rangedAttackGroup: this.rangedAttackGroup,
    });
    this.monsterGroup = new MonsterGroup(this);

    this.monsterGroup.add(
      new Monster(this, 900, 2900, { player: this.player }),
    );

    new CollisionManager(this, {
      player: this.player,
      environment: environment,
      rangedAttacks: this.rangedAttackGroup,
      monsterGroup: this.monsterGroup,
    });

    const camera = new Camera(this, environment.background);
    camera.followPlayer(this.player);
  }

  public update() {
    if (
      this.player === undefined ||
      this.monsterGroup === undefined ||
      this.rangedAttackGroup === undefined
    ) {
      return;
    }

    this.player.update();
    this.monsterGroup.update();
    this.rangedAttackGroup.update();
  }
}
