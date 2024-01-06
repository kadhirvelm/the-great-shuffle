import { range } from "lodash-es";
import { Monster } from "../monster/Monster";
import { Wall } from "./Walls";
import { EnvironmentInteractions } from "./EnvironmentInteractions";

export class TowerEnvironment extends Phaser.Physics.Arcade.StaticGroup {
  public background: Phaser.GameObjects.Image;

  public constructor(
    scene: Phaser.Scene,
    private environmentInteractions: EnvironmentInteractions,
  ) {
    super(scene.physics.world, scene);

    this.background = scene.add
      .image(0, 0, "tower")
      .setOrigin(0, 0)
      .setScale(2);

    scene.physics.world.setBounds(
      0,
      0,
      this.background.displayWidth,
      this.background.displayHeight,
    );

    this.createPassablePlatforms();
    this.createLadders();
    this.createPlatforms();
    this.createWalls();
    this.spawnMonsters();
    this.spawnPlayer();
  }

  private createPlatforms() {
    // x, y, width
    const platforms: [number, number, number][] = [
      [
        this.background.displayWidth / 2,
        this.background.displayHeight - 30,
        this.background.displayWidth,
      ],
      [1540, 1500, 1030],
    ];

    this.environmentInteractions.platform.createPlatform(platforms);
  }

  private createPassablePlatforms() {
    // x, y, width
    this.environmentInteractions.passablePlatform.createPassablePlatforms([
      [1510, 1010, 1080],
      [1310, 590, 1500],
    ]);
  }

  private createLadders() {
    // x, y, width, height
    this.environmentInteractions.ladders.createLadders([
      [1900, 1225, 100, 510],
      [2000, 750, 100, 510],
    ]);
  }

  private createWalls() {
    const walls: Wall[] = [
      {
        x: 1000,
        y: 1500,
        height: 1000,
        width: 60,
      },
      {
        x: 700,
        y: 1200,
        height: 1200,
        width: 60,
      },
    ];
    this.environmentInteractions.walls.createWalls(walls);
  }

  public spawnMonsters() {
    const locations: [number, number][] = [[1400, 1400]];

    let delay = 0;
    for (const locationIndex of range(locations.length)) {
      this.scene.time.delayedCall(delay, () => {
        const location = locations[locationIndex];
        this.environmentInteractions.monsterGroup.add(
          new Monster(this.scene, location[0], location[1], "level_1", {
            player: this.environmentInteractions.player,
          }),
        );
      });
      delay += 1000;
    }
  }

  private spawnPlayer() {
    this.environmentInteractions.player.spawnPlayer(200, 1700);
  }
}
