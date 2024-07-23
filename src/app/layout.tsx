import { Theme } from "@radix-ui/themes";
import type { Metadata } from "next";
import Inter from "next/font/local";
import "./globals.css";

// Configuration de la police locale
const inter = Inter({
  weight: '400', // Changer le type de poids en chaîne
  src: '../../public/fonts/Inter-Regular.woff2', // Chemin vers le fichier de police local
});

// Métadonnées de la page
export const metadata: Metadata = {
  title: "Yoori SI",
  description: "Your 365 Business App",
};

// Composant RootLayout
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='fr'>
      <body className={inter.className}>
        <Theme
          accentColor='crimson'
          grayColor='sand'
          radius='large'
          scaling='95%'
        >
          {children}
        </Theme>
      </body>
    </html>
  );
}