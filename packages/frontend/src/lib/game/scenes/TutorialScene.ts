import { Camera } from "../camera/Camera";
import { TowerEnvironment } from "../environment/TowerEnvironment";
import { BaseScene } from "./BaseScene";

export class TutorialScene extends BaseScene {
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
