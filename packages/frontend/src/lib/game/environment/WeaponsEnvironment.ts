import { Store } from "@reduxjs/toolkit";
import { State } from "../../store/configureStore";
import { EnvironmentInteractions } from "../environmentInteractions/EnvironmentInteractions";
import { getStore } from "../store/storeManager";

export class WeaponsEnvironment extends Phaser.Physics.Arcade.StaticGroup {
  public background: Phaser.GameObjects.Image;

  private store: Store<State>;

  public constructor(
    scene: Phaser.Scene,
    private environmentInteractions: EnvironmentInteractions,
  ) {
    super(scene.physics.world, scene);

    this.background = scene.add.image(0, 0, "armory").setOrigin(0, 0);

    scene.physics.world.setBounds(
      0,
      0,
      this.background.displayWidth,
      this.background.displayHeight,
    );

    this.store = getStore();

    this.createPlatforms();
    this.createNPCs();
    this.spawnPlayer();
  }

  private createPlatforms() {
    const platforms: [number, number, number][] = [
      [
        this.background.displayWidth / 2,
        this.background.displayHeight - 30,
        this.background.displayWidth,
      ],
    ];

    this.environmentInteractions.platform.createPlatform(platforms);
  }

  private createNPCs() {
    this.environmentInteractions.nonPlayerCharacters.createNPCs([
      [400, 900, "weapons"],
    ]);
  }

  private spawnPlayer() {
    this.environmentInteractions.player.spawnPlayer(200, 900);
  }
}
