import { RangedAttackGroup } from "../attacks/RangedAttackGroup";
import { TreeEnvironment } from "../environment/TreeEnvironment";
import { MonsterGroup } from "../monster/MonsterGroup";
import { Player } from "../player/Player";

export interface InteractingObjects {
  player: Player;
  environment: TreeEnvironment;
  rangedAttacks: RangedAttackGroup;
  monsterGroup: MonsterGroup;
}

export class CollisionManager {
  public constructor(
    private scene: Phaser.Scene,
    private interactingObjects: InteractingObjects,
  ) {
    this.addPlatformCollisions();
    this.addRangedAttacks();
  }

  private addPlatformCollisions() {
    this.scene.physics.add.collider(
      this.interactingObjects.player,
      this.interactingObjects.environment,
    );
    this.scene.physics.add.collider(
      this.interactingObjects.monsterGroup,
      this.interactingObjects.environment,
    );
  }

  private addRangedAttacks() {
    this.scene.physics.add.collider(
      this.interactingObjects.monsterGroup,
      this.interactingObjects.rangedAttacks,
      undefined,
      (_monster, rangedAttack) => {
        rangedAttack.destroy();
      },
    );

    this.scene.physics.add.collider(
      this.interactingObjects.monsterGroup,
      this.interactingObjects.player,
      (player) => {
        (player as Player).takeDamage(10);
      },
    );
  }
}
