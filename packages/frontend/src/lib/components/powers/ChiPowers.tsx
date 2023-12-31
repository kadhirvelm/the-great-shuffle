import { CircleOffIcon } from "lucide-react";
import { useTowerSelector } from "../../store/configureStore";
import { PlayerChiPower } from "../../store/reducer/PlayerChiPower";
import { assembleChiPowerLocation } from "../../utils/assembleAssetLocation";
import { ChiPower } from "@tower/api";
import styles from "./ChiPowers.module.scss";
import clsx from "clsx";
import { ChiPowerSlotNumber } from "../../store/reducer/gameState";

export const ChiPowers = () => {
  const [slotA, slotB, slotC] = useTowerSelector(
    (s) => s.gameState.playerChiPowers,
  );

  const renderSlot = (
    slotNumber: ChiPowerSlotNumber,
    chiPowerSlot: PlayerChiPower<ChiPower> | undefined,
  ) => {
    if (chiPowerSlot === undefined) {
      return (
        <div className={clsx(styles.singleChiPower, styles.noChiPower)}>
          <CircleOffIcon />
        </div>
      );
    }

    const assetLocation = assembleChiPowerLocation(
      chiPowerSlot.chiElement,
      chiPowerSlot.type,
      chiPowerSlot.level,
    );

    const toKeyboard = (() => {
      if (slotNumber === "chiPower-slotA") {
        return "Q";
      }

      if (slotNumber === "chiPower-slotB") {
        return "W";
      }

      if (slotNumber === "chiPower-slotC") {
        return "E";
      }

      return "";
    })();

    return (
      <div className={clsx(styles.singleChiPower, styles.chiPower)}>
        <div className={styles.keyboardLabel}>{toKeyboard}</div>
        <div className={styles.typeLabel}>
          {chiPowerSlot.type.slice(0, 1).toUpperCase()}
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={assetLocation} alt={chiPowerSlot.name} height={50} />
      </div>
    );
  };

  return (
    <div className={styles.chiPowersContainer}>
      {renderSlot("chiPower-slotA", slotA)}
      {renderSlot("chiPower-slotB", slotB)}
      {renderSlot("chiPower-slotC", slotC)}
    </div>
  );
};
