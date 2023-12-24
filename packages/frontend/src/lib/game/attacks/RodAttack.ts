import { v4 } from "uuid";
import { RodAttackHitbox, RodAttackHitboxGroup } from "./RodAttackHitbox";
import { Player } from "../player/Player";

export interface RodAttackAttributes {
  damage: number;
  pushBack: {
    velocity: number;
    duration: number;
  };
}

export class RodAttack extends Phaser.GameObjects.Sprite {
  public attributes: RodAttackAttributes | undefined;
  public typedBody: Phaser.Physics.Arcade.Body;
  public rodAttackId = v4();

  private followPlayer: Player | undefined;
  private hitbox: RodAttackHitbox | undefined;

  public constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    private rodAttackHitboxGroup: RodAttackHitboxGroup,
  ) {
    super(scene, x, y, "fire_rod");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.typedBody = this.body as Phaser.Physics.Arcade.Body;

    this.setScale(0.25);
    this.setAlpha(0);

    this.setActive(false);
    this.setVisible(false);
  }

  public fire(
    followPlayer: Player,
    direction: "left" | "right",
    attributes: RodAttackAttributes,
  ) {
    this.attributes = attributes;
    this.followPlayer = followPlayer;
    this.rodAttackId = v4();

    this.setOrigin(0.5, 1);
    this.setPosition(followPlayer.x, followPlayer.y);

    this.setActive(true);
    this.setVisible(true);

    const squareDimension = this.height * this.scaleY;

    this.hitbox = this.rodAttackHitboxGroup.createHitbox(
      {
        x: this.x,
        y: this.y,
        direction,
        width: squareDimension,
        height: squareDimension * 2,
      },
      this,
    );

    const startingRotation =
      direction === "right"
        ? Phaser.Math.DegToRad(-30)
        : Phaser.Math.DegToRad(30);
    this.setRotation(startingRotation);

    const timeline = this.scene.add.timeline([
      {
        at: 0,
        tween: {
          targets: this,
          alpha: { from: 0, to: 1 },
          duration: 300,
          onComplete: () => {
            // We want the game to crash here if hitbox is undefined
            this.hitbox!.setActive(true);
          },
        },
      },
      {
        at: 200,
        tween: {
          targets: this,
          rotation: {
            from: startingRotation,
            to:
              direction === "right"
                ? Phaser.Math.DegToRad(180)
                : Phaser.Math.DegToRad(-180),
          },
          duration: 150,
          onComplete: () => {
            // We want the game to crash here if hitbox is undefined
            this.hitbox!.destroy();
            this.destroy();
          },
          ease: "Sine.easeInOut",
        },
      },
    ]);

    timeline.play();
  }

  public update() {
    if (this.followPlayer === undefined || this.hitbox === undefined) {
      return;
    }

    this.setPosition(this.followPlayer.x, this.followPlayer.y);
    this.hitbox.setPosition(this.followPlayer.x, this.followPlayer.y);
  }
}
