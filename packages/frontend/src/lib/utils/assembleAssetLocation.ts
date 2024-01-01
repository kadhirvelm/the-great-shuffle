import { PlayerChiPower, PlayerWeapon } from "@tower/api";

export function assembleWeaponLocation(
  playerWeapon: PlayerWeapon,
  fullPath: boolean = true,
) {
  const assetLocation = `visual/weapons/${playerWeapon.type}/${playerWeapon.assetName}-${playerWeapon.level}.png`;
  return fullPath ? `http://localhost:8080/${assetLocation}` : assetLocation;
}

export function assembleChiPowerLocation(
  playerChiPower: PlayerChiPower,
  fullPath: boolean = true,
) {
  const assetLocation = `visual/powers/${playerChiPower.chiElement}/${playerChiPower.type}/${playerChiPower.level}.png`;
  return fullPath ? `http://localhost:8080/${assetLocation}` : assetLocation;
}
