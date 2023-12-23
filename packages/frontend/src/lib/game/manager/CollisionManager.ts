import { AuraAttack } from "../attacks/AuraAttack";
import { AuraAttackGroup } from "../attacks/AuraAttackGroup";
import {
  CloseAttackHitbox,
  CloseAttackHitboxGroup,
} from "../attacks/CloseAttackHitbox";
import { RangedAttack } from "../attacks/RangedAttack";
import { RangedAttackGroup } from "../attacks/RangedAttackGroup";
import { Shield } from "../attacks/Shield";
import { ShieldGroup } from "../attacks/ShieldGroup";
import { Distance } from "../constants/Distance";
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
  closeAttacksHitbox: CloseAttackHitboxGroup;
  shieldGroup: ShieldGroup;
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
    this.addCloseAttacks();

    this.addShield();
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
    this.scene.physics.add.overlap(
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
    this.scene.physics.add.overlap(
      this.interactingObjects.monsterGroup,
      this.interactingObjects.rangedAttacks,
      (monster, rangedAttack) => {
        const typedMonster = monster as Monster;
        const typedAttack = rangedAttack as RangedAttack;

        typedMonster.takeDamage(typedAttack.attributes?.damage ?? 0, {});
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
    this.scene.physics.add.overlap(
      this.interactingObjects.monsterGroup,
      this.interactingObjects.auraAttacks,
      (monster, auraAttack) => {
        const typedMonster = monster as Monster;
        const typedAttack = auraAttack as AuraAttack;

        typedMonster.takeDamage(typedAttack.attributes?.damage ?? 0, {
          auraAttackId: typedAttack.auraAttackId,
        });
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

  private addCloseAttacks() {
    this.scene.physics.add.overlap(
      this.interactingObjects.monsterGroup,
      this.interactingObjects.closeAttacksHitbox,
      (monster, closeAttack) => {
        const typedMonster = monster as Monster;
        const typedAttack = (closeAttack as CloseAttackHitbox)
          .closeAttackDetails;

        typedMonster.takeDamage(typedAttack.attributes?.damage ?? 0, {
          closeAttackId: typedAttack.closeAttackId,
        });
      },
      (monster, closeAttack) => {
        const typedMonster = monster as Monster;
        if (!typedMonster.isAlive()) {
          return false;
        }

        const typedCloseAttack = (closeAttack as CloseAttackHitbox)
          .closeAttackDetails;
        return typedMonster.canTakeDamageFromCloseAttack(
          typedCloseAttack.closeAttackId,
        );
      },
    );
  }

  private addShield() {
    this.scene.physics.add.overlap(
      this.interactingObjects.monsterGroup,
      this.interactingObjects.shieldGroup,
      (monster, shield) => {
        const typedMonster = monster as Monster;
        const typedShield = shield as Shield;

        const direction = new Phaser.Math.Vector2(
          typedMonster.x - typedShield.x,
          typedMonster.y - typedShield.y,
        ).normalize();

        typedMonster.pushBack(
          direction.x * Distance.shield_pushback,
          typedShield.attributes?.pushBackDuration ?? 100,
        );
      },
      (monster) => {
        const typedMonster = monster as Monster;
        if (!typedMonster.isAlive()) {
          return false;
        }

        return true;
      },
    );
  }
}
