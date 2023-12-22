import { v4 } from "uuid";

export interface AuraAttackAttributes {
  damage: number;
  duration: number;
  scale: number;
}

export class AuraAttack extends Phaser.GameObjects.Sprite {
  public attributes: AuraAttackAttributes | undefined;
  public typedBody: Phaser.Physics.Arcade.Body;
  public auraAttackId = v4();

  public constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "aura_attack");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.typedBody = this.body as Phaser.Physics.Arcade.Body;

    this.setScale(0);

    this.setActive(false);
    this.setVisible(false);

    this.initializePhysics();
  }

  private initializePhysics() {
    this.typedBody.setAllowGravity(false);
    this.typedBody.setCollideWorldBounds(false);
  }

  public fire(x: number, y: number, attributes: AuraAttackAttributes) {
    this.attributes = attributes;
    this.setPosition(x, y);

    this.setActive(true);
    this.setVisible(true);

    const timeline = this.scene.add.timeline([
      {
        at: 0,
        tween: {
          targets: this,
          alpha: { from: 0, to: 1 },
          scale: { from: 0, to: this.attributes.scale },
          duration: 150,
        },
      },
      {
        at: this.attributes.duration + 150,
        tween: {
          targets: this,
          alpha: { from: 1, to: 0 },
          duration: 500,
          onStart: () => {
            if (this.attributes === undefined) {
              return;
            }

            this.attributes.damage = 0;
          },
          onComplete: () => {
            this.destroy();
          },
        },
      },
    ]);

    timeline.play();
  }
}
