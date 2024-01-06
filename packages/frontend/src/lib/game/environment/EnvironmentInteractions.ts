import { MonsterGroup } from "../monster/MonsterGroup";
import { Player } from "../player/Player";
import { Ladders } from "./Ladders";
import { PassablePlatform } from "./PassablePlatform";
import { Platform } from "./Platform";
import { Walls } from "./Walls";

export interface EnvironmentInteractions {
  player: Player;
  ladders: Ladders;
  walls: Walls;
  platform: Platform;
  passablePlatform: PassablePlatform;
  monsterGroup: MonsterGroup;
}
