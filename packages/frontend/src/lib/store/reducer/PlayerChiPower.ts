import { ChiLevel, ChiPower } from "@tower/api";

export interface PlayerChiPower<ChiType extends ChiPower> {
  name: string;
  chiElement: string;
  level: ChiLevel;
  type: ChiType;
}

export const isAura = (
  playerChiPower: PlayerChiPower<ChiPower>,
): playerChiPower is PlayerChiPower<"aura"> => {
  return playerChiPower.type === "aura";
};

export const isRanged = (
  playerChiPower: PlayerChiPower<ChiPower>,
): playerChiPower is PlayerChiPower<"ranged"> => {
  return playerChiPower.type === "ranged";
};

export const isEnforcement = (
  playerChiPower: PlayerChiPower<ChiPower>,
): playerChiPower is PlayerChiPower<"enforcement"> => {
  return playerChiPower.type === "enforcement";
};
