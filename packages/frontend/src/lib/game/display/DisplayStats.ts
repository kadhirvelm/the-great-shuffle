interface SingleStat {
  current: number;
  max: number;
}

export interface AllStats {
  health: SingleStat;
}

const green = 0x3d7c47;
const yellow = 0xfbf579;
const red = 0xcd5554;

const HEALTH_BAR_SIZE = 75;

export class DisplayStats {
  private healthBar: Phaser.GameObjects.Graphics;

  public constructor(
    private rootSprite: Phaser.GameObjects.Sprite,
    private stats: AllStats,
  ) {
    this.healthBar = this.rootSprite.scene.add.graphics();
  }

  public update() {
    this.drawHealthBar();
  }

  private drawHealthBar() {
    this.healthBar.clear();
    this.setHealthBarColor();

    this.healthBar.fillRect(
      this.rootSprite.x - HEALTH_BAR_SIZE / 2,
      this.rootSprite.y + this.rootSprite.height / 1.8,
      Math.round(
        (this.stats.health.current / this.stats.health.max) * HEALTH_BAR_SIZE,
      ),
      10,
    );
  }

  private setHealthBarColor() {
    if (this.stats.health.current / this.stats.health.max >= 0.75) {
      this.healthBar.fillStyle(green, 1);
    } else if (this.stats.health.current / this.stats.health.max >= 0.25) {
      this.healthBar.fillStyle(yellow, 1);
    } else {
      this.healthBar.fillStyle(red, 1);
    }
  }
}
