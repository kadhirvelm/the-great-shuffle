import { Store } from "@reduxjs/toolkit";
import { EnvironmentInteractions } from "../environmentInteractions/EnvironmentInteractions";
import { Wall } from "../environmentInteractions/Walls";
import { TOWER_SCENE_KEY } from "../scenes/TowerScene";
import { State } from "../../store/configureStore";
import { getStore } from "../store/storeManager";
import { updateGameStage } from "../../store/reducer/gameState";

export class TutorialEnvironment extends Phaser.Physics.Arcade.StaticGroup {
  public background: Phaser.GameObjects.Image;

  private store: Store<State>;

  public constructor(
    scene: Phaser.Scene,
    private environmentInteractions: EnvironmentInteractions,
  ) {
    super(scene.physics.world, scene);

    this.background = scene.add
      .image(0, 0, "entrance")
      .setOrigin(0, 0)
      .setScale(2);

    scene.physics.world.setBounds(
      0,
      0,
      this.background.displayWidth,
      this.background.displayHeight,
    );

    this.store = getStore();

    this.createPlatforms();
    this.createWalls();
    this.createLadders();
    this.createPassablePlatform();
    this.createDoor();
    this.spawnPlayer();
  }

  private createPlatforms() {
    const platforms: [number, number, number][] = [
      [
        this.background.displayWidth / 2,
        this.background.displayHeight - 30,
        this.background.displayWidth,
      ],
      [2650, 1950, 100],
      [2650, 1985, 100],
      [2725, 1220, 1000],
      [2000, 1475, 1000],
    ];

    this.environmentInteractions.platform.createPlatform(platforms);
  }

  private createWalls() {
    const walls: Wall[] = [
      {
        x: 1125,
        y: 1885,
        height: 300,
        width: 60,
      },
      {
        x: 3200,
        y: 1500,
        height: 600,
        width: 60,
      },
      {
        x: 3550,
        y: 1440,
        height: 1200,
        width: 60,
      },
    ];

    this.environmentInteractions.walls.createWalls(walls);
  }

  private createLadders() {
    this.environmentInteractions.ladders.createLadders([
      [1025, 1885, 100, 300],
    ]);
  }

  private createPassablePlatform() {
    this.environmentInteractions.passablePlatform.createPassablePlatforms([
      [1125, 1725, 1000],
    ]);
  }

  private createDoor() {
    this.environmentInteractions.doors.createDoors([
      [
        1725,
        1360,
        () => {
          this.store.dispatch(updateGameStage(TOWER_SCENE_KEY));
        },
      ],
    ]);
  }

  private spawnPlayer() {
    this.environmentInteractions.player.spawnPlayer(200, 1800);
  }
}
