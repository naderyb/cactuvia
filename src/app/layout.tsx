import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant-garamond",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CACTUVIA - Soins Naturels · Algérie",
  description:
    "Des cosmétiques naturelles façonnées par la terre. Formules à base de gel de cactus et plantes pour révéler la beauté authentique de chaque femme.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      className={`${cormorantGaramond.variable} ${jost.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
