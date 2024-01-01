import { useTowerSelector } from "../../store/configureStore";
import { WeaponSlotNumber } from "../../store/reducer/gameState";
import { assembleWeaponLocation } from "../../utils/assembleAssetLocation";
import styles from "./Weapons.module.scss";
import { CircleOffIcon } from "lucide-react";
import clsx from "clsx";
import { PlayerWeapon } from "@tower/api";

export const Weapons = () => {
  const [slotA, slotB] = useTowerSelector(
    (s) => s.gameState.playerEquipment.weapons,
  );

  const renderSlot = (
    slotNumber: WeaponSlotNumber,
    weaponSlot: PlayerWeapon | undefined,
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

    const typeLabel = (() => {
      if (weaponSlot.type === "sword") {
        return "Sw";
      }

      if (weaponSlot.type === "spear") {
        return "Sp";
      }

      if (weaponSlot.type === "rod") {
        return "R";
      }

      if (weaponSlot.type === "shield") {
        return "Sh";
      }
    })();

    const assetLocation = assembleWeaponLocation(weaponSlot);

    if (weaponSlot.type === "spear") {
      return (
        <div className={clsx(styles.singleSlot, styles.weapon, styles.spear)}>
          <div className={styles.spearKeyboardLabel}>{toKeyboard}</div>
          <div className={styles.spearTypeLabel}>{typeLabel}</div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={assetLocation} alt={weaponSlot.name} width={100} />
        </div>
      );
    }

    return (
      <div className={clsx(styles.singleSlot, styles.weapon)}>
        <div className={styles.keyboardLabel}>{toKeyboard}</div>
        <div className={styles.typeLabel}>{typeLabel}</div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={assetLocation} alt={weaponSlot.name} height={100} />
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
