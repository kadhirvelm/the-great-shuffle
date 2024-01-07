import { Store } from "@reduxjs/toolkit";
import { State } from "../../store/configureStore";
import { EnvironmentInteractions } from "../environmentInteractions/EnvironmentInteractions";
import { getStore } from "../store/storeManager";
import { GameStage, updateGameStage } from "../../store/reducer/gameState";

export class BaseEnvironment extends Phaser.Physics.Arcade.StaticGroup {
  public background: Phaser.GameObjects.Image;

  public store: Store<State>;

  public constructor(
    public scene: Phaser.Scene,
    public key: string,
    public scale: number,
    public environmentInteractions: EnvironmentInteractions,
  ) {
    super(scene.physics.world, scene);

    this.background = scene.add
      .image(0, 0, key)
      .setOrigin(0, 0)
      .setScale(scale);

    scene.physics.world.setBounds(
      0,
      0,
      this.background.displayWidth,
      this.background.displayHeight,
    );

    this.store = getStore();

    this.createBasePlatform();
  }

  private createBasePlatform() {
    const platforms: [number, number, number][] = [
      [
        this.background.displayWidth / 2,
        this.background.displayHeight - 30,
        this.background.displayWidth,
      ],
    ];

    this.environmentInteractions.platform.createPlatform(platforms);
  }

  public switchScene(newScene: GameStage) {
    this.store.dispatch(updateGameStage(newScene));
    this.scene.scene.start(newScene);
  }
}
