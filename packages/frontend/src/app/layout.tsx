import type { Metadata } from "next";
import { Grandstander } from "next/font/google";
import clsx from "clsx";
import styles from "./layout.module.scss";

const grandstander = Grandstander({ subsets: ["latin"] });

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
      <body className={clsx(grandstander.className, styles.body)}>
        {children}
      </body>
    </html>
  );
}
