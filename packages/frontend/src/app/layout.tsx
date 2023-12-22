import type { Metadata } from "next";
import { Nanum_Brush_Script } from "next/font/google";
import clsx from "clsx";
import styles from "./layout.module.scss";

const font = Nanum_Brush_Script({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "The Tower of Cultivation",
  description: "Climb to the top, seek answers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={clsx(font.className, styles.body)}>{children}</body>
    </html>
  );
}
