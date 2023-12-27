import { Store } from "@reduxjs/toolkit";
import { State } from "../../store/configureStore";
import { getStore } from "../store/storeManager";
import {
  updateChi,
  updateHealth,
  updateStamina,
} from "../../store/reducer/gameState";
import {
  Costs,
  Distance,
  Duration,
  Movement,
  Scale,
  Velocity,
} from "../constants/enums";
import { clamp } from "lodash-es";
import { Damage } from "../constants/enums";
import { PushBack } from "../monster/Monster";

export interface PlayerStats {
  vitality: {
    /**
     * The total hit points of the player before death.
     */
    health: number;
    /**
     * Consumed when using weapon attacks.
     */
    stamina: number;
    /**
     * Consumed when using chi attacks.
     */
    chi: number;
  };
  offensiveAttributes: {
    /**
     * Affects the damage output of all weapon attacks.
     */
    weaponStrength: number;
    /**
     * Affects the damage output of all chi attacks.
     */
    chiFocus: number;
    /**
     * Affects how much stamina and chi, weapon and chi attacks use respectively. Each stat decreases the amount of stamina/chi used by 1%.
     */
    efficiency: number;
  };
  defensiveAttributes: {
    /**
     * Affects how quickly the player regenerates their vitality stats.
     */
    recovery: number;
    /**
     * Decreases the total damage taken. Each stat decreases damage taken by 1%.
     */
    defense: number;
    /**
     * How quickly the player is able to move and how far they're able to dash.
     */
    speed: number;
  };
}

const INITIAL_STATS: PlayerStats = {
  vitality: {
    health: 10,
    chi: 5,
    stamina: 5,
  },
  offensiveAttributes: {
    weaponStrength: 1,
    chiFocus: 1,
    efficiency: 1,
  },
  defensiveAttributes: {
    defense: 1,
    speed: 1,
    recovery: 1,
  },
};

type RecursivePartial<T> = {
  [Key in keyof T]?: RecursivePartial<T[Key]>;
};

export class PlayerStatsHandler {
  private playerStats: PlayerStats;
  private store: Store<State>;

  public constructor(overrideBaseStats?: RecursivePartial<PlayerStats>) {
    this.playerStats = {
      vitality: {
        ...INITIAL_STATS.vitality,
        ...overrideBaseStats?.vitality,
      },
      offensiveAttributes: {
        ...INITIAL_STATS.offensiveAttributes,
        ...overrideBaseStats?.offensiveAttributes,
      },
      defensiveAttributes: {
        ...INITIAL_STATS.defensiveAttributes,
        ...overrideBaseStats?.defensiveAttributes,
      },
    };

    this.store = getStore();
  }

  public takeDamage(damage: number) {
    const finalDamage =
      damage * (1 - this.playerStats.defensiveAttributes.defense / 100);
    this.store.dispatch(updateHealth(-finalDamage));
  }

  public dash = {
    consumeStaminaForDash: () => {
      this.store.dispatch(updateStamina(-Costs.dash));
    },
    canDash: () => {
      const currentStamina =
        this.store.getState().gameState.player.stamina.current;
      const requiredStamina = Costs.dash;
      return currentStamina >= requiredStamina;
    },
    dashDistance: () => {
      return Distance.player_dash + this.getSpeedModifier();
    },
    dashSpeed: () => {
      return Movement.player_dash_x + this.getSpeedModifier();
    },
  };

  public movement = {
    movementVelocityX: () => {
      return Movement.player_x + this.getSpeedModifier();
    },
    movementVelocityY: () => {
      return Movement.player_y + this.getSpeedModifier();
    },
    movementVelocityXAirborne: (
      direction: "left" | "right",
      currentSpeed: number,
    ) => {
      const intendedDiretion = direction === "left" ? -1 : 1;
      const deltaInSpeed =
        Math.abs(currentSpeed + this.getSpeedModifier()) * 0.1;
      const finalDelta = intendedDiretion * clamp(deltaInSpeed, 0, 2.5);

      return currentSpeed + finalDelta;
    },
  };

  public rangedAttack = {
    canFire: () => {
      return this.canConsumeChi(Costs.ranged_attack);
    },
    consumeChi: () => {
      return this.consumeChi(Costs.ranged_attack);
    },
    damage: () => {
      return Damage.player_ranged_attack * this.getChiDamageModifier();
    },
    range: () => {
      return Distance.player_projectile + this.rangedAttack.damage();
    },
    velocity: () => {
      return Movement.player_projectile_x + this.rangedAttack.damage();
    },
  };

  public auraAttack = {
    canFire: () => {
      return this.canConsumeChi(Costs.aura_attack);
    },
    consumeChi: () => {
      return this.consumeChi(Costs.aura_attack);
    },
    damage: () => {
      return Damage.player_aura_attack * this.getChiDamageModifier();
    },
    duration: () => {
      return Duration.player_aura_attack + this.auraAttack.damage();
    },
    scale: () => {
      return Scale.player_aura_attack * this.getChiDamageModifierPercent();
    },
  };

  public swordAttack = {
    canFire: () => {
      return this.canConsumeStamina(Costs.sword_attack);
    },
    consumeStamina: () => {
      return this.consumeStamina(Costs.sword_attack);
    },
    damage: () => {
      return Damage.player_sword_attack * this.getStaminaDamageModifier();
    },
  };

  public spearAttack = {
    canFire: () => {
      return this.canConsumeStamina(Costs.spear_attack);
    },
    consumeStamina: () => {
      return this.consumeStamina(Costs.spear_attack);
    },
    damage: () => {
      return Damage.player_spear_attack * this.getStaminaDamageModifier();
    },
    range: () => {
      return Distance.player_spear_x + this.spearAttack.damage();
    },
    velocity: () => {
      return Movement.player_spear_attack_x + this.spearAttack.damage();
    },
  };

  public rodAttack = {
    canFire: () => {
      return this.canConsumeStamina(Costs.rod_attack);
    },
    consumeStamina: () => {
      return this.consumeStamina(Costs.rod_attack);
    },
    damage: () => {
      return Damage.player_rod_attack * this.getStaminaDamageModifier();
    },
    pushBack: (): PushBack => {
      return {
        duration: Duration.player_rod_attack + this.rodAttack.damage(),
        velocity: Velocity.player_rod_attack_x + this.rodAttack.damage(),
      };
    },
  };

  public shield = {
    canFire: () => {
      return this.canConsumeStamina(Costs.shield);
    },
    consumeStamina: () => {
      return this.consumeStamina(Costs.shield);
    },
    duration: () => {
      return Duration.player_shield + this.getDefenseModifier();
    },
    scale: () => {
      return Scale.player_shield * this.getDefenseModifierPercent();
    },
    pushBack: (): PushBack => {
      return {
        duration: Duration.player_shield + this.getDefenseModifier(),
        velocity: Velocity.player_shield + this.getDefenseModifier(),
      };
    },
  };

  private getSpeedModifier() {
    return this.playerStats.defensiveAttributes.speed * 10;
  }

  private getChiCostModifier() {
    return 1 - this.playerStats.offensiveAttributes.efficiency / 100;
  }

  private canConsumeChi(chi: number) {
    const currentChi = this.store.getState().gameState.player.chi.current;
    const requiredChi = chi * this.getChiCostModifier();
    return currentChi >= requiredChi;
  }

  private consumeChi(chi: number) {
    const finalChi = chi * this.getChiCostModifier();
    this.store.dispatch(updateChi(-finalChi));
  }

  private getChiDamageModifier() {
    return this.playerStats.offensiveAttributes.chiFocus * 10;
  }

  private getChiDamageModifierPercent() {
    return 1 + this.playerStats.offensiveAttributes.chiFocus / 100;
  }

  private getStaminaCostModifier() {
    return 1 - this.playerStats.offensiveAttributes.efficiency / 100;
  }

  private canConsumeStamina(stamina: number) {
    const currentStamina =
      this.store.getState().gameState.player.stamina.current;
    const requiredStamina = stamina * this.getStaminaCostModifier();
    return currentStamina >= requiredStamina;
  }

  private consumeStamina(stamina: number) {
    const finalStamina = stamina * this.getStaminaCostModifier();
    this.store.dispatch(updateStamina(-finalStamina));
  }

  private getStaminaDamageModifier() {
    return this.playerStats.offensiveAttributes.weaponStrength * 10;
  }

  private getDefenseModifier() {
    return this.playerStats.defensiveAttributes.defense * 10;
  }

  private getDefenseModifierPercent() {
    return 1 + this.playerStats.defensiveAttributes.defense / 100;
  }
}
