import { Monster } from "./Monster";
import { MonsterStats } from "./MonsterStatsHandler";

export type MonsterTypes = "mushroom" | "ice";

export class MonsterTypeHandler {
  private isRoaming: { distance: number; direction: -1 | 1 } | undefined;

  public constructor(
    private scene: Phaser.Scene,
    private monster: Monster,
  ) {}

  public getBaseStats(): MonsterStats {
    switch (this.monster.monsterType) {
      case "mushroom":
        return {
          vitality: { health: { current: 50, max: 50 } },
          offensiveAttributes: { collisionStrength: 10, aggroRange: 350 },
          defensiveAttributes: { defense: 0, speed: 150, jump: 300 },
        };
      case "ice":
        return {
          vitality: { health: { current: 100, max: 100 } },
          offensiveAttributes: { collisionStrength: 20, aggroRange: 500 },
          defensiveAttributes: { defense: 10, speed: 50, jump: 0 },
        };
    }
  }

  public loadAssets() {
    switch (this.monster.monsterType) {
      case "mushroom":
        this.scene.load.spritesheet(
          "mushroom",
          "visual/monsters/mushroom.png",
          {
            frameWidth: 40,
            frameHeight: 40,
          },
        );

        this.monster.anims.create({
          key: "mushroom",
          frames: this.monster.anims.generateFrameNumbers("mushroom", {
            start: 0,
            end: 11,
          }),
          frameRate: 10,
          repeat: -1,
        });

        this.monster.anims.play("mushroom", true);
        break;
      case "ice":
        this.scene.load.spritesheet("ice", "visual/monsters/ice.png", {
          frameWidth: 217,
          frameHeight: 191,
        });

        this.monster.anims.create({
          key: "ice",
          frames: this.monster.anims.generateFrameNumbers("ice", {
            start: 0,
            end: 5,
          }),
          frameRate: 5,
          repeat: -1,
        });

        this.monster.anims.play("ice", true);
        break;
    }
  }

  public attackPattern() {
    switch (this.monster.monsterType) {
      case "mushroom":
        this.followWithJump();
        break;
      case "ice":
        this.simpleAggroWithRoam();
        break;
    }
  }

  private followWithJump() {
    const distanceToPlayer = Phaser.Math.Distance.Between(
      this.monster.x,
      this.monster.y,
      this.monster.monsterInteractions.player.x,
      this.monster.monsterInteractions.player.y,
    );

    const areOnSamePlane =
      Math.abs(this.monster.y - this.monster.monsterInteractions.player.y) <
      100;

    const canAggro =
      distanceToPlayer <= this.monster.monsterStatsHandler.getAggroRange() &&
      areOnSamePlane;
    if (!canAggro) {
      this.monster.typedBody.setVelocityX(0);
      return;
    }

    const direction = Math.sign(
      this.monster.monsterInteractions.player.x - this.monster.x,
    );
    this.monster.typedBody.setVelocityX(
      this.monster.monsterStatsHandler.getSpeedX() * direction,
    );

    if (direction === -1) {
      this.monster.setFlipX(true);
    } else {
      this.monster.setFlipX(false);
    }

    if (
      this.monster.typedBody.touching.down &&
      this.monster.damageEvent === undefined
    ) {
      this.monster.typedBody.setVelocityY(
        -this.monster.monsterStatsHandler.getSpeedY(),
      );
    }
  }

  private simpleAggroWithRoam() {
    const distanceToPlayer = Phaser.Math.Distance.Between(
      this.monster.x,
      this.monster.y,
      this.monster.monsterInteractions.player.x,
      this.monster.monsterInteractions.player.y,
    );

    const areOnSamePlane =
      Math.abs(this.monster.y - this.monster.monsterInteractions.player.y) <
      100;

    const canAggro =
      distanceToPlayer <= this.monster.monsterStatsHandler.getAggroRange() &&
      areOnSamePlane;
    if (!canAggro) {
      return this.simpleRoaming();
    }

    const direction = Math.sign(
      this.monster.monsterInteractions.player.x - this.monster.x,
    );
    this.monster.typedBody.setVelocityX(
      this.monster.monsterStatsHandler.getSpeedX() * direction,
    );

    if (direction === -1) {
      this.monster.setFlipX(true);
    } else {
      this.monster.setFlipX(false);
    }
  }

  private simpleRoaming() {
    if (this.isRoaming === undefined) {
      this.isRoaming = {
        direction: Math.random() > 0.5 ? 1 : -1,
        distance: Math.round(
          this.monster.monsterStatsHandler.getSpeedX() * 2 * Math.random(),
        ),
      };
      return;
    }

    const moveSpeed = this.monster.monsterStatsHandler.getSpeedX() * 0.25;
    this.monster.typedBody.setVelocityX(moveSpeed * this.isRoaming.direction);
    this.isRoaming.distance -=
      moveSpeed / this.monster.scene.game.loop.actualFps;

    if (this.isRoaming.distance <= 0) {
      this.isRoaming = undefined;
    }
  }
}
