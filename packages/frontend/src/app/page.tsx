"use client";

import styles from "./page.module.scss";
import { networkCalls } from "../lib/network";
import { useEffect, useState } from "react";

export default function Home() {
  const [networkCall, setNetworkCall] = useState("Loading...");

  const getHelloWorld = async () => {
    setNetworkCall((await networkCalls.helloWorld({})).message);
  };

  useEffect(() => {
    getHelloWorld();
  }, []);

  return (
    <div className={styles.helloWorld}>Network request: {networkCall}</div>
  );
}
