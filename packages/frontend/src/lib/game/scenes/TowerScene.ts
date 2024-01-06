import { Camera } from "../camera/Camera";
import { TowerEnvironment } from "../environment/TowerEnvironment";
import { BaseScene } from "./BaseScene";

export const TOWER_SCENE_KEY = "TowerScene" as const;

export class TowerScene extends BaseScene {
  public constructor() {
    super(TOWER_SCENE_KEY);
  }

  public preload() {
    super.preload();

    this.load.image("tower", "visual/background/tower.png");
  }

  public create() {
    super.create();

    const environment = new TowerEnvironment(
      this,
      this.environmentInteractions!,
    );

    const camera = new Camera(this, environment.background);
    camera.followPlayer(this.player!);
  }
}
