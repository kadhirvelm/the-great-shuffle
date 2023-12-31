import { ChiLevel, ChiPower, PlayerWeaponType } from "@tower/api";

export function assembleWeaponLocation(
  assetName: string,
  assetType: PlayerWeaponType,
  fullPath: boolean = true,
) {
  const assetLocation = `visual/weapons/${assetType}/${assetName}.png`;
  return fullPath ? `http://localhost:8080/${assetLocation}` : assetLocation;
}

export function assembleChiPowerLocation(
  chiElement: string,
  type: ChiPower,
  level: ChiLevel,
  fullPath: boolean = true,
) {
  const assetLocation = `visual/powers/${chiElement}/${type}/${level}.png`;
  return fullPath ? `http://localhost:8080/${assetLocation}` : assetLocation;
}
