import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: {
    default: "WearOcean Command Center",
    template: "%s | WearOcean HQ"
  },
  description: "Real-time GIS monitoring & safety intelligence platform for traditional coastal fisheries using LoRa radio telemetry.",
  keywords: [
    "WearOcean", "Marine Safety Monitoring", "LoRa Telemetry", "Fishermen Tracking", "Coastal Command Center", "GIS Fleet Tracker"
  ],
  authors: [{ name: "Coastal Safety Command", url: "https://wearocean.id" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <head>
        {/* Preconnect for Satoshi and JetBrains Mono */}
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Satoshi & JetBrains Mono Fonts */}
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@900,700,500,400,300&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        
        {/* Google Material Icons */}
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
