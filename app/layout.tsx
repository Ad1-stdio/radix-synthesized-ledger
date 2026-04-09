import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { BackgroundEnvironment } from "@/components/BackgroundEnvironment";
import { FloatingShards } from "@/components/FloatingShards";
import { WalletProvider } from "@/contexts/WalletContext";
import { WalletModal } from "@/components/WalletModal";
import { NetworkProvider } from "@/contexts/NetworkContext";
import { NetworkTransitionWrapper } from "@/components/NetworkTransitionWrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Synthetic Ledger Dashboard",
  description: "Radix DLT Dashboard Interface",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-deep-navy text-foreground font-sans relative`}
      >
        <NetworkProvider>
        <WalletProvider>
          <div className="noise-overlay pointer-events-none"></div>
          <FloatingShards />
          <BackgroundEnvironment />
          <WalletModal />
          <div className="flex min-h-screen">
            <div className="hidden lg:block fixed inset-y-0 left-0 w-64 z-40">
              <Sidebar />
            </div>
            <div className="flex-1 lg:ml-64 flex flex-col relative z-20 overflow-hidden w-full">
              <TopBar />
              <main className="flex-1 relative z-10 w-full h-full">
                <NetworkTransitionWrapper>
                   {children}
                </NetworkTransitionWrapper>
              </main>
            </div>
          </div>
        </WalletProvider>
        </NetworkProvider>
      </body>
    </html>
  );
}
