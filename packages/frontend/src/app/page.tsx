"use client";

import dynamic from "next/dynamic";
import styles from "./page.module.scss";

const DynamicGameEntry = dynamic(() => import("../lib/components/GameEntry"), {
  ssr: false,
});

export default function Home() {
  return (
    <div className={styles.entryPoint}>
      <DynamicGameEntry />
    </div>
  );
}
