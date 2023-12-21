import { RangedAttackGroup } from "../attacks/RangedAttackGroup";
import { TreeEnvironment } from "../environment/TreeEnvironment";
import { Monster } from "../monster/Monster";
import { Player } from "../player/Player";

export interface InteractingObjects {
  player: Player;
  environment: TreeEnvironment;
  rangedAttacks: RangedAttackGroup;
  monster: Monster;
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
      this.interactingObjects.monster,
      this.interactingObjects.environment,
    );
  }

  private addRangedAttacks() {
    this.scene.physics.add.collider(
      this.interactingObjects.monster,
      this.interactingObjects.rangedAttacks,
      undefined,
      (_monster, rangedAttack) => {
        rangedAttack.destroy();
      },
    );

    this.scene.physics.add.collider(
      this.interactingObjects.monster,
      this.interactingObjects.player,
      (_monster, player) => {
        (player as Player).takeDamage(10);
      },
    );
  }
}
