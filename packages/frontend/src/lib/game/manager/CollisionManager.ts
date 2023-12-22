import { AuraAttack } from "../attacks/AuraAttack";
import { AuraAttackGroup } from "../attacks/AuraAttackGroup";
import { RangedAttack } from "../attacks/RangedAttack";
import { RangedAttackGroup } from "../attacks/RangedAttackGroup";
import { TreeEnvironment } from "../environment/TreeEnvironment";
import { Monster } from "../monster/Monster";
import { MonsterGroup } from "../monster/MonsterGroup";
import { Player } from "../player/Player";

export interface InteractingObjects {
  environment: TreeEnvironment;
  player: Player;
  monsterGroup: MonsterGroup;
  rangedAttacks: RangedAttackGroup;
  auraAttacks: AuraAttackGroup;
}

export class CollisionManager {
  public constructor(
    private scene: Phaser.Scene,
    private interactingObjects: InteractingObjects,
  ) {
    this.addPlatform();
    this.addPlayerAndMonster();
    this.addRangedAttacks();
    this.addAuraAttacks();
  }

  private addPlatform() {
    this.scene.physics.add.collider(
      this.interactingObjects.player,
      this.interactingObjects.environment,
    );
    this.scene.physics.add.collider(
      this.interactingObjects.monsterGroup,
      this.interactingObjects.environment,
    );
  }

  private addPlayerAndMonster() {
    this.scene.physics.add.collider(
      this.interactingObjects.monsterGroup,
      this.interactingObjects.player,
      (player, monster) => {
        const typedPlayer: Player = player as Player;
        const typedMonster: Monster = monster as Monster;

        typedPlayer.takeDamage(typedMonster.stats.damage);
      },
      (player, monster) => {
        const typedPlayer: Player = player as Player;
        if (typedPlayer.currentState?.type === "dashing") {
          return false;
        }

        if (typedPlayer.currentState?.type === "recently-damaged") {
          return false;
        }

        const typedMonster = monster as Monster;
        if (!typedMonster.isAlive()) {
          return false;
        }

        return true;
      },
    );
  }

  private addRangedAttacks() {
    this.scene.physics.add.collider(
      this.interactingObjects.monsterGroup,
      this.interactingObjects.rangedAttacks,
      (monster, rangedAttack) => {
        const typedMonster = monster as Monster;
        const typedAttack = rangedAttack as RangedAttack;

        typedMonster.takeDamage(typedAttack.attributes?.damage ?? 0);
        rangedAttack.destroy();
      },
      (monster, rangedAttack) => {
        const typedMonster = monster as Monster;
        if (!typedMonster.isAlive()) {
          return false;
        }

        const typedRangedAttack = rangedAttack as RangedAttack;
        if (typedRangedAttack.isDestroyed) {
          return false;
        }

        return true;
      },
    );
  }

  private addAuraAttacks() {
    this.scene.physics.add.collider(
      this.interactingObjects.monsterGroup,
      this.interactingObjects.auraAttacks,
      (monster, auraAttack) => {
        const typedMonster = monster as Monster;
        const typedAttack = auraAttack as AuraAttack;

        typedMonster.takeDamage(
          typedAttack.attributes?.damage ?? 0,
          typedAttack.auraAttackId,
        );
      },
      (monster, auraAttack) => {
        const typedMonster = monster as Monster;
        if (!typedMonster.isAlive()) {
          return false;
        }

        const typedAuraAttack = auraAttack as AuraAttack;
        return typedMonster.canTakeDamageFromAuraAttack(
          typedAuraAttack.auraAttackId,
        );
      },
    );
  }
}
