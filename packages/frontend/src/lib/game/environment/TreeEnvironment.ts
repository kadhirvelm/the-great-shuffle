import { range } from "lodash-es";
import { Monster } from "../monster/Monster";
import { MonsterGroup } from "../monster/MonsterGroup";
import { Player } from "../player/Player";
import { Ladders } from "./Ladders";

export interface EnvironmentInteractions {
  player: Player;
  ladders: Ladders;
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
      [1387, 2801, 2000],
    ];

    for (const platform of platforms) {
      const bottom = this.create(platform[0], platform[1], "platform_texture");
      bottom.displayWidth = platform[2];
      bottom.displayHeight = 40;
      bottom.refreshBody();
    }
  }

  private createLadders() {
    // x, y, width
    const ladders: [number, number][] = [
      [310, 2800],
      [2471, 2800],
    ];

    for (const ladder of ladders) {
      this.environmentInteractions.ladders.create(
        ladder[0],
        ladder[1],
        "ladder",
      );
    }
  }

  public spawnMonsters() {
    const locations: [number, number][] = [
      [1292, 2600],
      [1563, 2600],
      [1435, 2600],
      [1003, 2600],
      [743, 2600],
      [2061, 2600],
      [1738, 2600],
      [1142, 2600],
      [889, 2600],
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
            locationIndex % 2 === 0 ? "ice" : "mushroom",
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
    this.environmentInteractions.player.spawnPlayer(200, 2800);
  }
}
