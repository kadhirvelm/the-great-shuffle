import { Camera } from "../camera/Camera";
import { TutorialEnvironment } from "../environment/TutorialEnvironment";
import { BaseScene } from "./BaseScene";

export const TUTORIAL_SCENE_KEY = "TutorialScene" as const;

export class TutorialScene extends BaseScene {
  public active = false;

  public constructor() {
    super(TUTORIAL_SCENE_KEY);
  }

  public preload() {
    super.preload();

    this.load.image("entrance", "visual/background/entrance.png");
  }

  public create() {
    super.create();

    const environment = new TutorialEnvironment(
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
