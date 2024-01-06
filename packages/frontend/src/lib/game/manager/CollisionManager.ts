import { inRange } from "lodash-es";
import { AuraAttack } from "../chiPowers/AuraAttack";
import { AuraAttackGroup } from "../chiPowers/AuraAttackGroup";
import { RangedAttack } from "../chiPowers/RangedAttack";
import { RangedAttackGroup } from "../chiPowers/RangedAttackGroup";
import { Ladders } from "../environment/Ladders";
import { PassablePlatform } from "../environment/PassablePlatform";
import { Platform } from "../environment/Platform";
import { Walls } from "../environment/Walls";
import { Monster } from "../monster/Monster";
import { MonsterGroup } from "../monster/MonsterGroup";
import { Player } from "../player/Player";
import {
  RodAttackHitbox,
  RodAttackHitboxGroup,
} from "../weaponAttacks/RodAttackHitbox";
import { ShieldAttack } from "../weaponAttacks/ShieldAttack";
import { ShieldAttackGroup } from "../weaponAttacks/ShieldAttackGroup";
import { SpearAttack } from "../weaponAttacks/SpearAttack";
import { SpearAttackGroup } from "../weaponAttacks/SpearAttackGroup";
import {
  SwordAttackHitbox,
  SwordAttackHitboxGroup,
} from "../weaponAttacks/SwordAttackHitbox";

const MINIMUM_WALL_CLEARANCE = 10;

export interface InteractingObjects {
  platform: Platform;
  ladders: Ladders;
  walls: Walls;
  passablePlatform: PassablePlatform;
  player: Player;
  monsterGroup: MonsterGroup;
  rangedAttacks: RangedAttackGroup;
  auraAttacks: AuraAttackGroup;
  swordAttackHitbox: SwordAttackHitboxGroup;
  shieldGroup: ShieldAttackGroup;
  spearAttackGroup: SpearAttackGroup;
  rodAttackHitbox: RodAttackHitboxGroup;
}

export class CollisionManager {
  public constructor(
    private scene: Phaser.Scene,
    private interactingObjects: InteractingObjects,
  ) {
    this.addEnvironment();
    this.addPlayerAndMonster();

    this.addRangedAttacks();
    this.addAuraAttacks();
    this.addSwordAttacks();
    this.addSpearAttacks();
    this.addSwordAttacks();
    this.addRodAttacks();

    this.addShield();
  }

  private addEnvironment() {
    this.scene.physics.add.collider(
      this.interactingObjects.player,
      this.interactingObjects.platform,
      (player) => {
        const typedPlayer = player as Player;
        typedPlayer.hangingOnWall = undefined;

        typedPlayer.lastTouchedPlatform = this.scene.time.now;
      },
    );
    this.scene.physics.add.collider(
      this.interactingObjects.monsterGroup,
      this.interactingObjects.platform,
    );

    this.scene.physics.add.collider(
      this.interactingObjects.monsterGroup,
      this.interactingObjects.walls,
    );

    this.scene.physics.add.overlap(
      this.interactingObjects.player,
      this.interactingObjects.ladders,
      (player, ladder) => {
        const typedPlayer: Player = player as Player;
        typedPlayer.updateClosestLadder(ladder as Phaser.GameObjects.Sprite);
      },
      (player, ladder) => {
        const typedPlayer = player as Player;
        const typedLadder = ladder as Phaser.GameObjects.Sprite;

        return inRange(typedPlayer.x, typedLadder.x - 20, typedLadder.x + 20);
      },
    );

    this.scene.physics.add.collider(
      this.interactingObjects.player,
      this.interactingObjects.passablePlatform,
      (player) => {
        const typedPlayer = player as Player;
        typedPlayer.hangingOnWall = undefined;

        typedPlayer.lastTouchedPlatform = this.scene.time.now;
      },
      (player, platform) => {
        const typedPlayer = player as Player;

        if (typedPlayer.playerInteractions.keyboard.down.isDown) {
          return false;
        }

        const typedPlatform = platform as Phaser.GameObjects.Sprite;

        const playerBottom = typedPlayer.getBounds().bottom ?? 0;
        const platformTop = typedPlatform.getTopCenter().y ?? 0;

        return playerBottom <= platformTop;
      },
    );
    this.scene.physics.add.collider(
      this.interactingObjects.monsterGroup,
      this.interactingObjects.passablePlatform,
    );

    this.scene.physics.add.collider(
      this.interactingObjects.player,
      this.interactingObjects.walls,
      (player, wall) => {
        const typedPlayer = player as Player;
        if (typedPlayer.playerDirection === undefined) {
          return;
        }

        const typedWall = wall as Phaser.GameObjects.Sprite;

        if (
          Math.abs(
            (typedPlayer.getBottomCenter().y ?? 0) -
              (typedWall.getBottomCenter().y ?? 0),
          ) <= MINIMUM_WALL_CLEARANCE
        ) {
          return;
        }

        typedPlayer.hangingOnWall = typedWall;

        if (typedPlayer.playerDirection === "left") {
          typedPlayer.x =
            (typedWall.getRightCenter().x ?? 0) + typedPlayer.width / 3;
        } else {
          typedPlayer.x =
            (typedWall.getLeftCenter().x ?? 0) - typedPlayer.width / 3;
        }
      },
      (player, wall) => {
        // This is a bit complex, but the player collides with the wall once more when they jump off of it, so we need to ignore that
        // Or continually evaluate which direction the player is going on. Unfortunately experiments to use the player's x, y position
        // didn't work as reliably as just checking for their x velocity

        const typedPlayer = player as Player;
        if (typedPlayer.typedBody.velocity.x === 0) {
          return true;
        }

        const typedWall = wall as Phaser.GameObjects.Sprite;
        if (
          (typedWall.getBottomCenter().y ?? 0) <
          (typedPlayer.getTopCenter().y ?? 0)
        ) {
          typedPlayer.playerDirection = undefined;
          return true;
        }

        typedPlayer.playerDirection =
          typedPlayer.typedBody.velocity.x <= 0 ? "left" : "right";

        return true;
      },
    );

    // This prevents the player from dashing through walls
    this.scene.physics.add.overlap(
      this.interactingObjects.player,
      this.interactingObjects.walls,
      (player, wall) => {
        const typedPlayer = player as Player;
        if (
          typedPlayer.playerDirection === undefined ||
          typedPlayer.hangingOnWall === undefined
        ) {
          return;
        }

        const typedWall = wall as Phaser.GameObjects.Sprite;

        if (typedPlayer.playerDirection === "left") {
          typedPlayer.x = Math.max(
            typedPlayer.x,
            typedWall.getRightCenter().x ?? 0,
          );
        } else {
          typedPlayer.x = Math.min(
            typedPlayer.x,
            typedWall.getLeftCenter().x ?? 0,
          );
        }
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
        const typedShield = shield as ShieldAttack;

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
