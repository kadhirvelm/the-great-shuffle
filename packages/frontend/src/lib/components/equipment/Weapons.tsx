import { useTowerSelector } from "../../store/configureStore";
import { WeaponSlot, WeaponSlotNumber } from "../../store/reducer/gameState";
import { assembleWeaponLocation } from "../../utils/assembleAssetLocation";
import styles from "./Weapons.module.scss";
import { CircleOffIcon } from "lucide-react";
import clsx from "clsx";

export const Weapons = () => {
  const [slotA, slotB] = useTowerSelector(
    (s) => s.gameState.playerEquipment.weapons,
  );

  const renderSlot = (
    slotNumber: WeaponSlotNumber,
    weaponSlot: WeaponSlot | undefined,
  ) => {
    if (weaponSlot === undefined) {
      return (
        <div className={clsx(styles.singleSlot, styles.noWeapon)}>
          <CircleOffIcon />
        </div>
      );
    }

    const toKeyboard = (() => {
      if (slotNumber === "weapon-slotA") {
        return "A";
      }

      if (slotNumber === "weapon-slotB") {
        return "S";
      }

      return "";
    })();

    const assetLocation = assembleWeaponLocation(
      weaponSlot.assetName,
      weaponSlot.type,
    );

    if (weaponSlot.type === "spear") {
      return (
        <div className={clsx(styles.singleSlot, styles.weapon, styles.spear)}>
          <div className={styles.spearKeyboardLabel}>{toKeyboard}</div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={assetLocation} alt={weaponSlot.name} width={50} />
        </div>
      );
    }

    return (
      <div className={clsx(styles.singleSlot, styles.weapon)}>
        <div className={styles.keyboardLabel}>{toKeyboard}</div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={assetLocation} alt={weaponSlot.name} height={50} />
      </div>
    );
  };

  return (
    <div className={styles.weaponsContainer}>
      {renderSlot("weapon-slotA", slotA)}
      {renderSlot("weapon-slotB", slotB)}
    </div>
  );
};
