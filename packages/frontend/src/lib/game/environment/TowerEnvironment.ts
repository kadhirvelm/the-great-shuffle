import { EnvironmentInteractions } from "../environmentInteractions/EnvironmentInteractions";
import { WEAPONS_SCENE_KEY } from "../scenes/WeaponsScene";
import { BaseEnvironment } from "./BaseEnvironment";

export class TowerEnvironment extends BaseEnvironment {
  public constructor(
    scene: Phaser.Scene,
    environmentInteractions: EnvironmentInteractions,
  ) {
    super(scene, "tower", 2, environmentInteractions);
    this.createDoors();
    this.spawnPlayer();
  }

  private createDoors() {
    this.environmentInteractions.doors.createDoors([
      [
        500,
        1900,
        () => {
          this.switchScene(WEAPONS_SCENE_KEY);
        },
      ],
    ]);
  }

  private spawnPlayer() {
    this.environmentInteractions.player.spawnPlayer(200, 1925);
  }
}
