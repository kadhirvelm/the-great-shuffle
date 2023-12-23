import { Scale } from "../constants/Scale";

export interface ShieldAttributes {
  duration: number;
  direction: "left" | "right";
  pushBackDuration: number;
}

export class Shield extends Phaser.GameObjects.Sprite {
  public attributes: ShieldAttributes | undefined;
  public typedBody: Phaser.Physics.Arcade.Body;

  public constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "fire_shield");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.typedBody = this.body as Phaser.Physics.Arcade.Body;

    this.setAlpha(0);
    this.setScale(0);

    this.setActive(false);
    this.setVisible(false);
  }

  public fire(x: number, y: number, attributes: ShieldAttributes) {
    this.attributes = attributes;
    const accountForDirection = attributes.direction === "left" ? -60 : 60;
    this.setPosition(x + accountForDirection, y - 20);

    this.setSize(
      this.frame.width * Scale.player_shield,
      this.frame.height * Scale.player_shield,
    );

    this.setActive(true);
    this.setVisible(true);

    const timeline = this.scene.add.timeline([
      {
        at: 0,
        tween: {
          targets: this,
          alpha: { from: 0, to: 1 },
          scale: { from: 0, to: 0.25 },
          duration: 50,
        },
      },
      {
        at: attributes.duration + 50,
        tween: {
          targets: this,
          alpha: { from: 1, to: 0 },
          duration: 50,
          onComplete: () => {
            this.destroy();
          },
        },
      },
    ]);

    timeline.play();
  }
}
