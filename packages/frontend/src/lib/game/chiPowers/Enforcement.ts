import { Player } from "../player/Player";
import { PlayerStats, RecursivePartial } from "../player/PlayerStatsHandler";

export interface EnforcementAttributes {
  duration: number;
  enforcement: RecursivePartial<PlayerStats>;
}

export class Enforcement extends Phaser.GameObjects.Sprite {
  public attributes: EnforcementAttributes | undefined;
  private followPlayer: Player | undefined;

  public constructor(scene: Phaser.Scene, x: number, y: number, key: string) {
    super(scene, x, y, key);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setAlpha(0);
    this.setScale(0.5);

    this.setActive(false);
    this.setVisible(false);
  }

  public fire(followPlayer: Player, attributes: EnforcementAttributes) {
    this.attributes = attributes;
    this.followPlayer = followPlayer;

    this.followPlayer.playerStatsHandler.enforcePlayer(attributes.enforcement);

    this.setPosition(followPlayer.x, followPlayer.y - this.accountForHeight());

    this.setActive(true);
    this.setVisible(true);

    const quickFlashDuration = 100;
    const quickFlashCount = 20;

    const flashDuration = 500;
    const repeats = Math.round(
      (attributes.duration - quickFlashDuration * quickFlashCount) /
        flashDuration,
    );

    const timeline = this.scene.add.timeline([
      {
        at: 0,
        tween: {
          targets: this,
          scale: { from: 0.15, to: 0.5 },
          duration: 100,
        },
      },
      {
        at: 0,
        tween: {
          targets: this,
          alpha: { from: 0.5, to: 1 },
          duration: flashDuration,
          repeat: repeats,
          yoyo: true,
        },
      },
      {
        at: repeats * flashDuration,
        tween: {
          targets: this,
          alpha: { from: 0, to: 1 },
          duration: quickFlashDuration,
          repeat: quickFlashCount,
          yoyo: true,
        },
      },
      {
        at: repeats * flashDuration + quickFlashCount * quickFlashDuration,
        tween: {
          targets: this,
          alpha: { from: 1, to: 0 },
          duration: 150,
          onComplete: () => {
            // Note we want the game to crash here if this.followPlayer is undefined
            this.followPlayer!.playerStatsHandler.removeEnforcement();
            this.destroy();
          },
        },
      },
    ]);

    timeline.play();
  }

  public update() {
    if (this.followPlayer === undefined) {
      return;
    }

    this.setPosition(
      this.followPlayer.x,
      this.followPlayer.y - this.accountForHeight(),
    );
  }

  private accountForHeight = () => {
    if (this.followPlayer === undefined) {
      return 0;
    }

    return this.followPlayer.frame.height / 2;
  };
}
