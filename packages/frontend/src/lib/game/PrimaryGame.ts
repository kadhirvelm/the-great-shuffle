"use client";

import { Store } from "@reduxjs/toolkit";
import { Game } from "phaser";
import { State } from "../store/configureStore";
import { Gravity } from "./constants/enums";
import { TutorialScene } from "./scenes/TutorialScene";
import { removeStore, setStore } from "./store/storeManager";
import { TowerScene } from "./scenes/TowerScene";
import { WeaponsScene } from "./scenes/WeaponsScene";

export class PrimaryGame {
  private game: Game;

  private currentStage: string;

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
      scene: [TowerScene, TutorialScene, WeaponsScene],
    });

    this.currentStage = store.getState().gameState.stage;
    this.game.scene.start(this.currentStage);
  }

  public destroyGame() {
    removeStore();
    this.game.destroy(true);
  }
}
