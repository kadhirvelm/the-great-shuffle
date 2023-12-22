import { Gravity } from "./Gravity";

export enum Movement {
  player_x = Gravity.generic,
  player_dash_x = Gravity.generic * 3,
  player_y = Gravity.playerY * 0.35,
  player_projectile_x = Gravity.generic * 2,
  monster_x = Gravity.generic / 3,
  monster_y = Gravity.generic / 2,
}
