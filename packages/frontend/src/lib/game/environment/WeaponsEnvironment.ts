import { EnvironmentInteractions } from "../environmentInteractions/EnvironmentInteractions";
import { TOWER_SCENE_KEY } from "../scenes/TowerScene";
import { BaseEnvironment } from "./BaseEnvironment";

export class WeaponsEnvironment extends BaseEnvironment {
  public constructor(
    scene: Phaser.Scene,
    environmentInteractions: EnvironmentInteractions,
  ) {
    super(scene, "armory", 1, environmentInteractions);

    this.createNPCs();
    this.createDoors();
    this.spawnPlayer();
  }

  private createNPCs() {
    this.environmentInteractions.nonPlayerCharacters.createNPCs([
      [400, 900, "weapons"],
    ]);
  }

  private createDoors() {
    this.environmentInteractions.doors.createDoors([
      [
        200,
        900,
        () => {
          this.switchScene(TOWER_SCENE_KEY);
        },
      ],
    ]);
  }

  private spawnPlayer() {
    this.environmentInteractions.player.spawnPlayer(200, 900);
  }
}
