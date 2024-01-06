import { MonsterGroup } from "../monster/MonsterGroup";
import { Player } from "../player/Player";
import { Doors } from "./Doors";
import { Ladders } from "./Ladders";
import { PassablePlatform } from "./PassablePlatform";
import { Platform } from "./Platform";
import { Walls } from "./Walls";

export interface EnvironmentInteractions {
  player: Player;
  doors: Doors;
  ladders: Ladders;
  walls: Walls;
  platform: Platform;
  passablePlatform: PassablePlatform;
  monsterGroup: MonsterGroup;
}
