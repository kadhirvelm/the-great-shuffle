"use client";

import { Store } from "@reduxjs/toolkit";
import { Game } from "phaser";
import { State } from "../store/configureStore";
import { Gravity } from "./constants/enums";
import { TutorialScene } from "./scenes/TutorialScene";
import { removeStore, setStore } from "./store/storeManager";
import { TowerScene } from "./scenes/TowerScene";

export class PrimaryGame {
  private game: Game;

  private currentStage: string;

  constructor(
    private parent: HTMLElement,
    private store: Store<State>,
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
      scene: [TutorialScene, TowerScene],
    });

    this.currentStage = store.getState().gameState.stage;
    this.game.scene.start(this.currentStage);
    this.store.subscribe(() => {
      const maybeNewStage = this.store.getState().gameState.stage;
      if (maybeNewStage === this.currentStage) {
        return;
      }

      this.currentStage = maybeNewStage;
      this.game.scene.start(this.currentStage);
    });
  }

  public destroyGame() {
    removeStore();
    this.game.destroy(true);
  }
}
