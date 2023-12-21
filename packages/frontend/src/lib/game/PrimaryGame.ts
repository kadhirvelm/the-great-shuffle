"use client";

import { Store } from "@reduxjs/toolkit";
import { Game, Scene } from "phaser";
import { State } from "../store/configureStore";
import { RangedAttackGroup } from "./attacks/RangedAttackGroup";
import { Camera } from "./camera/Camera";
import { WoodsEnvironment } from "./environment/WoodsEnvironment";
import { CollisionManager } from "./interactions/CollisionManager";
import { Keyboard } from "./keyboard/Keyboard";
import { AssetManager } from "./manager/AssetManager";
import { Monster } from "./monster/Monster";
import { Player } from "./player/Player";
import { removeStore, setStore } from "./store/storeManager";

export class PrimaryGame {
  private game: Game;

  constructor(
    private parent: HTMLElement,
    store: Store<State>,
  ) {
    setStore(store);

    this.game = new Game({
      type: Phaser.AUTO,
      parent: this.parent,
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 300 },
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

  public preload() {
    new AssetManager(this);
  }

  public create() {
    const environment = new WoodsEnvironment(this);
    const rangedAttackGroup = new RangedAttackGroup(this);
    this.player = new Player(this, 500, 800, {
      keyboard: new Keyboard(this),
      rangedAttackGroup,
    });
    const monster = new Monster(this, 700, 800);

    new CollisionManager(this, {
      player: this.player,
      woodsEnvironment: environment,
      rangedAttacks: rangedAttackGroup,
      monster,
    });

    const camera = new Camera(this, environment.background);
    camera.followPlayer(this.player);
  }

  public update() {
    if (this.player === undefined) {
      return;
    }

    this.player.update();
  }
}
