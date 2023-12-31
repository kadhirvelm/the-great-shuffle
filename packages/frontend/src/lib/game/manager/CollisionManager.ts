import { AuraAttack } from "../chiPowers/AuraAttack";
import { AuraAttackGroup } from "../chiPowers/AuraAttackGroup";
import { RangedAttack } from "../chiPowers/RangedAttack";
import { RangedAttackGroup } from "../chiPowers/RangedAttackGroup";
import {
  RodAttackHitbox,
  RodAttackHitboxGroup,
} from "../weaponAttacks/RodAttackHitbox";
import { Shield } from "../weaponAttacks/Shield";
import { ShieldGroup } from "../weaponAttacks/ShieldGroup";
import { SpearAttack } from "../weaponAttacks/SpearAttack";
import { SpearAttackGroup } from "../weaponAttacks/SpearAttackGroup";
import {
  SwordAttackHitbox,
  SwordAttackHitboxGroup,
} from "../weaponAttacks/SwordAttackHitbox";
import { Ladders } from "../environment/Ladders";
import { TreeEnvironment } from "../environment/TreeEnvironment";
import { Monster } from "../monster/Monster";
import { MonsterGroup } from "../monster/MonsterGroup";
import { Player } from "../player/Player";

export interface InteractingObjects {
  environment: TreeEnvironment;
  ladders: Ladders;
  player: Player;
  monsterGroup: MonsterGroup;
  rangedAttacks: RangedAttackGroup;
  auraAttacks: AuraAttackGroup;
  swordAttackHitbox: SwordAttackHitboxGroup;
  shieldGroup: ShieldGroup;
  spearAttackGroup: SpearAttackGroup;
  rodAttackHitbox: RodAttackHitboxGroup;
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
    this.addSwordAttacks();
    this.addSpearAttacks();
    this.addSwordAttacks();
    this.addRodAttacks();

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

    this.scene.physics.add.overlap(
      this.interactingObjects.player,
      this.interactingObjects.ladders,
      (player, ladder) => {
        const typedPlayer: Player = player as Player;
        typedPlayer.updateClosestLadder(ladder as Phaser.GameObjects.Sprite);
      },
    );
  }

  private addPlayerAndMonster() {
    this.scene.physics.add.collider(
      this.interactingObjects.monsterGroup,
      this.interactingObjects.player,
      (player, monster) => {
        const typedPlayer: Player = player as Player;
        const typedMonster: Monster = monster as Monster;

        typedPlayer.takeDamage(
          typedMonster.monsterStatsHandler.getCollisionStrength(),
        );
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

        typedMonster.pushBack(
          {
            velocity: typedAttack.attributes?.pushBack.velocity ?? 0,
            duration: typedAttack.attributes?.pushBack.duration ?? 0,
          },
          { x: typedAttack.x, y: typedAttack.y },
        );

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

        typedMonster.pushBack(
          {
            velocity: typedAttack.attributes?.pushBack.velocity ?? 0,
            duration: typedAttack.attributes?.pushBack.duration ?? 0,
          },
          { x: typedAttack.x, y: typedAttack.y },
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

  private addSwordAttacks() {
    this.scene.physics.add.overlap(
      this.interactingObjects.monsterGroup,
      this.interactingObjects.swordAttackHitbox,
      (monster, swordAttack) => {
        const typedMonster = monster as Monster;
        const typedAttack = (swordAttack as SwordAttackHitbox)
          .swordAttackDetails;

        typedMonster.takeDamage(typedAttack.attributes?.damage ?? 0, {
          swordAttackId: typedAttack.swordAttackId,
        });

        typedMonster.pushBack(
          {
            velocity: typedAttack.attributes?.pushBack.velocity ?? 0,
            duration: typedAttack.attributes?.pushBack.duration ?? 0,
          },
          { x: typedAttack.x, y: typedAttack.y },
        );
      },
      (monster, swordAttack) => {
        const typedMonster = monster as Monster;
        if (!typedMonster.isAlive()) {
          return false;
        }

        const typedSwordAttack = (swordAttack as SwordAttackHitbox)
          .swordAttackDetails;
        return typedMonster.canTakeDamageFromSwordAttack(
          typedSwordAttack.swordAttackId,
        );
      },
    );
  }

  private addSpearAttacks() {
    this.scene.physics.add.overlap(
      this.interactingObjects.monsterGroup,
      this.interactingObjects.spearAttackGroup,
      (monster, spearAttack) => {
        const typedMonster = monster as Monster;
        const typedAttack = spearAttack as SpearAttack;

        typedMonster.takeDamage(typedAttack.attributes?.damage ?? 0, {
          spearAttackId: typedAttack.spearAttackId,
        });

        typedMonster.pushBack(
          {
            velocity: typedAttack.attributes?.pushBack.velocity ?? 0,
            duration: typedAttack.attributes?.pushBack.duration ?? 0,
          },
          { x: typedAttack.x, y: typedAttack.y },
        );
      },
      (monster, spearAttack) => {
        const typedMonster = monster as Monster;
        if (!typedMonster.isAlive()) {
          return false;
        }

        const typedRangedAttack = spearAttack as SpearAttack;
        if (typedRangedAttack.isDestroyed) {
          return false;
        }

        const typedSwordAttack = spearAttack as SpearAttack;
        return typedMonster.canTakeDamageFromSpearAttack(
          typedSwordAttack.spearAttackId,
        );
      },
    );
  }

  private addRodAttacks() {
    this.scene.physics.add.overlap(
      this.interactingObjects.monsterGroup,
      this.interactingObjects.rodAttackHitbox,
      (monster, rodAttack) => {
        const typedMonster = monster as Monster;
        const typedAttack = (rodAttack as RodAttackHitbox).rodAttackDetails;

        typedMonster.takeDamage(typedAttack.attributes?.damage ?? 0, {
          rodAttackId: typedAttack.rodAttackId,
        });

        typedMonster.pushBack(
          {
            velocity: typedAttack.attributes?.pushBack.velocity ?? 0,
            duration: typedAttack.attributes?.pushBack.duration ?? 0,
          },
          { x: typedAttack.x, y: typedAttack.y },
        );
      },
      (monster, rodAttack) => {
        const typedMonster = monster as Monster;
        if (!typedMonster.isAlive()) {
          return false;
        }

        const typedRodAttackHitbox: RodAttackHitbox =
          rodAttack as RodAttackHitbox;
        if (!typedRodAttackHitbox.active) {
          return false;
        }

        const typedRodAttack = (rodAttack as RodAttackHitbox).rodAttackDetails;
        return typedMonster.canTakeDamageFromRodAttack(
          typedRodAttack.rodAttackId,
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

        typedMonster.pushBack(
          {
            velocity: typedShield.attributes?.pushBack.velocity ?? 0,
            duration: typedShield.attributes?.pushBack.duration ?? 0,
          },
          { x: typedShield.x, y: typedShield.y },
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
