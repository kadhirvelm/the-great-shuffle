"use client";

import { Store } from "@reduxjs/toolkit";
import { Game } from "phaser";
import { State } from "../store/configureStore";
import { Gravity } from "./constants/enums";
import { TutorialScene } from "./scenes/TutorialScene";
import { removeStore, setStore } from "./store/storeManager";

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
