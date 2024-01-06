import { Scene } from "phaser";
import { AuraAttackGroup } from "../chiPowers/AuraAttackGroup";
import { EnforcementGroup } from "../chiPowers/EnforcementGroup";
import { RangedAttackGroup } from "../chiPowers/RangedAttackGroup";
import { EnvironmentInteractions } from "../environment/EnvironmentInteractions";
import { Ladders } from "../environment/Ladders";
import { PassablePlatform } from "../environment/PassablePlatform";
import { Platform } from "../environment/Platform";
import { Walls } from "../environment/Walls";
import { Keyboard } from "../keyboard/Keyboard";
import { AssetManager } from "../manager/AssetManager";
import { CollisionManager } from "../manager/CollisionManager";
import { MonsterGroup } from "../monster/MonsterGroup";
import { Player } from "../player/Player";
import { RodAttackGroup } from "../weaponAttacks/RodAttackGroup";
import { RodAttackHitboxGroup } from "../weaponAttacks/RodAttackHitbox";
import { ShieldAttackGroup } from "../weaponAttacks/ShieldAttackGroup";
import { SpearAttackGroup } from "../weaponAttacks/SpearAttackGroup";
import { SwordAttackGroup } from "../weaponAttacks/SwordAttackGroup";
import { SwordAttackHitboxGroup } from "../weaponAttacks/SwordAttackHitbox";

export class BaseScene extends Scene {
  public player: Player | undefined;
  public monsterGroup: MonsterGroup | undefined;

  public environmentInteractions: EnvironmentInteractions | undefined;

  public rangedAttackGroup: RangedAttackGroup | undefined;
  public auraAttackGroup: AuraAttackGroup | undefined;
  public swordAttackHitbox: SwordAttackHitboxGroup | undefined;
  public swordAttackGroup: SwordAttackGroup | undefined;
  public spearAttackGroup: SpearAttackGroup | undefined;
  public rodAttackHitbox: RodAttackHitboxGroup | undefined;
  public rodAttackGroup: RodAttackGroup | undefined;

  public shieldAttackGroup: ShieldAttackGroup | undefined;
  public enforcementGroup: EnforcementGroup | undefined;

  public preload() {
    new AssetManager(this);
  }

  public create() {
    this.rangedAttackGroup = new RangedAttackGroup(this);
    this.auraAttackGroup = new AuraAttackGroup(this);
    this.swordAttackHitbox = new SwordAttackHitboxGroup(this);
    this.swordAttackGroup = new SwordAttackGroup(this, this.swordAttackHitbox);
    this.spearAttackGroup = new SpearAttackGroup(this);
    this.rodAttackHitbox = new RodAttackHitboxGroup(this);
    this.rodAttackGroup = new RodAttackGroup(this, this.rodAttackHitbox);

    this.shieldAttackGroup = new ShieldAttackGroup(this);
    this.enforcementGroup = new EnforcementGroup(this);

    this.player = new Player(this, {
      keyboard: new Keyboard(this),
      rangedAttackGroup: this.rangedAttackGroup,
      auraAttackGroup: this.auraAttackGroup,
      enforcementGroup: this.enforcementGroup,

      swordAttackGroup: this.swordAttackGroup,
      spearAttackGroup: this.spearAttackGroup,
      rodAttackGroup: this.rodAttackGroup,

      shieldGroup: this.shieldAttackGroup,
    });
    this.monsterGroup = new MonsterGroup(this);

    const ladders = new Ladders(this);
    const walls = new Walls(this);
    const platform = new Platform(this);
    const passablePlatform = new PassablePlatform(this);

    this.environmentInteractions = {
      player: this.player,
      ladders: ladders,
      walls: walls,
      platform: platform,
      passablePlatform: passablePlatform,
      monsterGroup: this.monsterGroup,
    };

    new CollisionManager(this, {
      player: this.player,
      monsterGroup: this.monsterGroup,
      platform: platform,
      ladders: ladders,
      walls: walls,
      passablePlatform: passablePlatform,
      rangedAttacks: this.rangedAttackGroup,
      auraAttacks: this.auraAttackGroup,
      swordAttackHitbox: this.swordAttackHitbox,
      shieldGroup: this.shieldAttackGroup,
      spearAttackGroup: this.spearAttackGroup,
      rodAttackHitbox: this.rodAttackHitbox,
    });
  }

  public update() {
    if (
      this.player === undefined ||
      this.monsterGroup === undefined ||
      this.rangedAttackGroup === undefined ||
      this.auraAttackGroup === undefined ||
      this.swordAttackGroup === undefined ||
      this.shieldAttackGroup === undefined ||
      this.spearAttackGroup === undefined ||
      this.rodAttackGroup === undefined ||
      this.enforcementGroup === undefined
    ) {
      return;
    }

    this.player.update();
    this.monsterGroup.update();
    this.rangedAttackGroup.update();
    this.auraAttackGroup.update();
    this.swordAttackGroup.update();
    this.shieldAttackGroup.update();
    this.spearAttackGroup.update();
    this.rodAttackGroup.update();
    this.enforcementGroup.update();
  }
}
