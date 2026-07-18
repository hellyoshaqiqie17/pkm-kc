"use client";

import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-shell">
      <div className="relative flex items-center justify-center">
        {/* Pulsing beacon ring */}
        <div className="absolute h-24 w-24 animate-ping rounded-full border border-blue-600/25 bg-blue-600/5"></div>
        {/* Secondary ring */}
        <div className="absolute h-16 w-16 rounded-full border-2 border-dashed border-blue-600/40 animate-spin" style={{ animationDuration: '6s' }}></div>
        
        {/* Main circular symbol */}
        <div className="relative h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/10">
          <span className="material-icons text-white text-2xl animate-pulse">settings_input_antenna</span>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <h2 className="font-sans text-lg font-black text-foreground tracking-widest uppercase">KOMANDO BAHARI</h2>
        <p className="mt-2 text-xs text-muted font-semibold tracking-wider">
          Menghubungkan ke Stasiun Pangkalan LoRa{dots}
        </p>
      </div>
    </div>
  );
}
