import { range } from "lodash-es";
import { Monster } from "../monster/Monster";
import { MonsterGroup } from "../monster/MonsterGroup";
import { Player } from "../player/Player";
import { Ladders } from "./Ladders";
import { Wall, Walls } from "./Walls";
import { PassablePlatform } from "./PassablePlatform";

export interface EnvironmentInteractions {
  player: Player;
  ladders: Ladders;
  walls: Walls;
  passablePlatform: PassablePlatform;
  monsterGroup: MonsterGroup;
}

export class TreeEnvironment extends Phaser.Physics.Arcade.StaticGroup {
  public background: Phaser.GameObjects.Image;

  public constructor(
    scene: Phaser.Scene,
    private environmentInteractions: EnvironmentInteractions,
  ) {
    super(scene.physics.world, scene);

    this.background = scene.add.image(0, 0, "tree").setOrigin(0, 0).setScale(3);

    scene.physics.world.setBounds(
      0,
      0,
      this.background.displayWidth,
      this.background.displayHeight,
    );

    this.createPlatforms();
    this.createLadders();
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
    ];

    for (const platform of platforms) {
      const bottom = this.create(platform[0], platform[1], "platform_texture");
      bottom.displayWidth = platform[2];
      bottom.displayHeight = 40;
      bottom.refreshBody();
    }

    this.environmentInteractions.passablePlatform.createPassablePlatforms([
      [1387, 2600, 2000],
    ]);
  }

  private createLadders() {
    // x, y, width, height
    const ladders: [number, number, number, number][] = [
      [310, 2800, 100, 600],
      [2471, 2800, 100, 600],
    ];
    this.environmentInteractions.ladders.createLadders(ladders);
  }

  private createWalls() {
    const walls: Wall[] = [
      {
        x: 15,
        y: this.background.displayHeight - 300,
        height: 600,
        width: 30,
      },
      {
        x: this.background.displayWidth - 15,
        y: this.background.displayHeight - 300,
        height: 600,
        width: 30,
      },
    ];
    this.environmentInteractions.walls.createWalls(walls);
  }

  public spawnMonsters() {
    const locations: [number, number][] = [
      [1292, 1800],
      [1563, 1800],
      [1435, 1800],
      // [1003, 1800],
      // [743, 1800],
      // [2061, 1800],
      // [1738, 1800],
      // [1142, 1800],
      // [889, 1800],
    ];

    let delay = 0;
    for (const locationIndex of range(locations.length)) {
      this.scene.time.delayedCall(delay, () => {
        const location = locations[locationIndex];
        this.environmentInteractions.monsterGroup.add(
          new Monster(
            this.scene,
            location[0],
            location[1],
            `level_${(locationIndex % 3) + 1}` as "level_1",
            {
              player: this.environmentInteractions.player,
            },
          ),
        );
      });
      delay += 1000;
    }
  }

  private spawnPlayer() {
    this.environmentInteractions.player.spawnPlayer(200, 2500);
  }
}
