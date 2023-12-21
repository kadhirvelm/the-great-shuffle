interface SingleMonsterStat {
  current: number;
  max: number;
}

export interface AllMonsterStats {
  damage: number;
  health: SingleMonsterStat;
}

const green = 0x3d7c47;
const yellow = 0xfbf579;
const red = 0xcd5554;

const HEALTH_BAR_SIZE = 75;

export class MonsterStats {
  private healthBar: Phaser.GameObjects.Graphics;

  public constructor(
    private monster: Phaser.GameObjects.Sprite,
    private monsterStats: AllMonsterStats,
  ) {
    this.healthBar = this.monster.scene.add.graphics();
  }

  public update() {
    this.drawHealthBar();
  }

  private drawHealthBar() {
    this.healthBar.clear();
    this.setHealthBarColor();

    this.healthBar.fillRect(
      this.monster.x - HEALTH_BAR_SIZE / 2,
      this.monster.y + this.monster.height / 1.8,
      Math.round(
        (this.monsterStats.health.current / this.monsterStats.health.max) *
          HEALTH_BAR_SIZE,
      ),
      10,
    );
  }

  private setHealthBarColor() {
    if (
      this.monsterStats.health.current / this.monsterStats.health.max >=
      0.75
    ) {
      this.healthBar.fillStyle(green, 1);
    } else if (
      this.monsterStats.health.current / this.monsterStats.health.max >=
      0.25
    ) {
      this.healthBar.fillStyle(yellow, 1);
    } else {
      this.healthBar.fillStyle(red, 1);
    }
  }
}
