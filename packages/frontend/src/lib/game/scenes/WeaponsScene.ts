import { Camera } from "../camera/Camera";
import { WeaponsEnvironment } from "../environment/WeaponsEnvironment";
import { BaseScene } from "./BaseScene";

export const WEAPONS_SCENE_KEY = "WeaponsScene" as const;

export class WeaponsScene extends BaseScene {
  public constructor() {
    super(WEAPONS_SCENE_KEY);
  }

  public preload() {
    super.preload();

    this.load.image("armory", "visual/background/armory.png");
  }

  public create() {
    super.create();

    const environment = new WeaponsEnvironment(
      this,
      this.environmentInteractions!,
    );

    const camera = new Camera(this, environment.background);
    camera.followPlayer(this.player!);
  }

  public update() {
    super.update();
  }
}
