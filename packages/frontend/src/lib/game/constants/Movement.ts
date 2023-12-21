import { Gravity } from "./Gravity";

export enum Movement {
  player_x = Gravity.generic,
  player_y = Gravity.playerY * 0.35,
  projectile_x = Gravity.generic * 2,
}
