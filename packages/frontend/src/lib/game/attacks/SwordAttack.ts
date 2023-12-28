import { v4 } from "uuid";
import { SwordAttackHitbox, SwordAttackHitboxGroup } from "./SwordAttackHitbox";
import { Player } from "../player/Player";
import { PushBack } from "../monster/Monster";

export interface SwordAttackAttributes {
  damage: number;
  pushBack: PushBack;
}

export class SwordAttack extends Phaser.GameObjects.Sprite {
  public attributes: SwordAttackAttributes | undefined;
  public typedBody: Phaser.Physics.Arcade.Body;
  public swordAttackId = v4();

  private followPlayer: Player | undefined;
  private hitbox: SwordAttackHitbox | undefined;

  public constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    private swordAttackHitboxGroup: SwordAttackHitboxGroup,
  ) {
    super(scene, x, y, "sword");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.typedBody = this.body as Phaser.Physics.Arcade.Body;

    this.setScale(0.5);

    this.setActive(false);
    this.setVisible(false);
  }

  public fire(
    followPlayer: Player,
    direction: "left" | "right",
    attributes: SwordAttackAttributes,
  ) {
    this.followPlayer = followPlayer;
    this.attributes = attributes;
    this.swordAttackId = v4();

    this.setOrigin(0.5, 1);
    this.setPosition(this.followPlayer.x, this.followPlayer.y);

    this.setActive(true);
    this.setVisible(true);

    const squareDimension = this.height * this.scaleY;

    this.hitbox = this.swordAttackHitboxGroup.createHitbox(
      {
        x: this.x,
        y: this.y,
        direction,
        width: squareDimension,
        height: squareDimension * 2,
      },
      this,
    );

    const timeline = this.scene.add.timeline([
      {
        at: 0,
        tween: {
          targets: this,
          rotation: {
            from: Phaser.Math.DegToRad(0),
            to:
              direction === "right"
                ? Phaser.Math.DegToRad(180)
                : Phaser.Math.DegToRad(-180),
          },
          duration: 125,
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
