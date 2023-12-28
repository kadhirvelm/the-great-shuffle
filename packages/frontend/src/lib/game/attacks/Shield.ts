import { PushBack } from "../monster/Monster";

export interface ShieldAttributes {
  duration: number;
  direction: "left" | "right";
  pushBack: PushBack;
  scale: number;
}

export class Shield extends Phaser.GameObjects.Sprite {
  public attributes: ShieldAttributes | undefined;
  public typedBody: Phaser.Physics.Arcade.Body;

  public constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "shield");

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
      this.frame.width * this.attributes.scale,
      this.frame.height * this.attributes.scale,
    );

    this.setActive(true);
    this.setVisible(true);

    const timeline = this.scene.add.timeline([
      {
        at: 0,
        tween: {
          targets: this,
          alpha: { from: 0, to: 1 },
          scale: { from: 0, to: 1 },
          duration: 150,
        },
      },
      {
        at: attributes.duration + 150,
        tween: {
          targets: this,
          alpha: { from: 1, to: 0 },
          duration: 150,
          onComplete: () => {
            this.destroy();
          },
        },
      },
    ]);

    timeline.play();
  }
}
