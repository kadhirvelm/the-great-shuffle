import type { Metadata } from "next";
import { Grandstander } from "next/font/google";

const grandstander = Grandstander({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The great shuffle",
  description: "A random AI game",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={grandstander.className}>{children}</body>
    </html>
  );
}
