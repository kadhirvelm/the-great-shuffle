"use client";

import dynamic from "next/dynamic";
import styles from "./page.module.scss";
import { towerStore } from "../lib/store/configureStore";
import { Provider } from "react-redux";

const DynamicGameEntry = dynamic(() => import("../lib/components/GameEntry"), {
  ssr: false,
});

export default function Home() {
  return (
    <div className={styles.entryPoint}>
      <Provider store={towerStore}>
        <DynamicGameEntry />
      </Provider>
    </div>
  );
}
