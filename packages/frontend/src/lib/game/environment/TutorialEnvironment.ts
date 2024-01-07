import { EnvironmentInteractions } from "../environmentInteractions/EnvironmentInteractions";
import { Wall } from "../environmentInteractions/Walls";
import { TOWER_SCENE_KEY } from "../scenes/TowerScene";
import { BaseEnvironment } from "./BaseEnvironment";

export class TutorialEnvironment extends BaseEnvironment {
  public constructor(
    scene: Phaser.Scene,
    environmentInteractions: EnvironmentInteractions,
  ) {
    super(scene, "entrance", 2, environmentInteractions);

    this.createPlatforms();
    this.createWalls();
    this.createLadders();
    this.createPassablePlatform();
    this.createDoor();
    this.spawnPlayer();
  }

  private createPlatforms() {
    const platforms: [number, number, number][] = [
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
          this.switchScene(TOWER_SCENE_KEY);
        },
      ],
    ]);
  }

  private spawnPlayer() {
    this.environmentInteractions.player.spawnPlayer(200, 1800);
  }
}
