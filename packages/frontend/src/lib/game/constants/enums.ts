/* eslint-disable @typescript-eslint/no-duplicate-enum-values */

export enum Costs {
  dash = 10,
  ranged_attack = 10,
  aura_attack = 20,
  enforcement = 15,
  sword_attack = 2,
  spear_attack = 2,
  rod_attack = 2,
  shield = 2,
}

export enum Duration {
  player_aura_attack = 300,
  player_rod_attack = 500,
  player_shield = 500,
  player_enforcement = 20000,
}

export enum Damage {
  player_ranged_attack = 1.5,
  player_aura_attack = 2.5,
  player_sword_attack = 0.5,
  player_spear_attack = 0.5,
  player_rod_attack = 0.2,
}

export enum Distance {
  player_projectile = 500,
  player_spear_x = 300,
  player_dash = 240,
}

export enum Gravity {
  generic = 300,
  playerY = 2500,
}

export enum Movement {
  player_x = Gravity.generic,
  player_dash_x = Gravity.generic * 3,
  player_y = Gravity.playerY * 0.4,
  player_projectile_x = Gravity.generic * 2,
  player_spear_attack_x = Gravity.generic * 4,
}

export enum Scale {
  player_aura_attack = 1.5,
  player_shield = 0.25,
}

export enum Velocity {
  player_rod_attack_x = 400,
  player_shield = 100,
}
