import type { Metadata } from "next";
import localFont from "next/font/local";
import { BarraDeNavegacion } from "@/components/barra-de-navegacion/BarraDeNavegacion";
import { PieDePagina } from "@/components/pie-de-pagina/PieDePagina";
import { ClerkProvider } from '@clerk/nextjs'
import { esES } from '@clerk/localizations'
import { Toaster } from "sonner";
import { Toaster as NormalToaster } from "@/components/ui/toaster"
import "./globals.css";
const libreFranklin = localFont({
  src: "./fonts/LibreFranklin-VariableFont_wght.ttf",
  variable: "--font-libre-franklin",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "eBlog",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={esES}>
      <html lang="en">
        <body
          className={`${libreFranklin.variable} antialiased`}
        >
          <BarraDeNavegacion />
          {children}
          <Toaster />
          <NormalToaster />
          <PieDePagina />
        </body>
      </html>
    </ClerkProvider>
  );
}
