"use client";

import { useEffect, useState } from "react";
import { simulator, Fisherman, EmergencyAlert } from "@/lib/mockData";

export default function AnalyticsPage() {
  const [fishermen, setFishermen] = useState<Fisherman[]>([]);
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);

  useEffect(() => {
    const syncData = () => {
      setFishermen(simulator.getFishermen());
      setAlerts(simulator.getAlerts());
    };
    syncData();
    return simulator.subscribe(syncData);
  }, []);

  // Compute stats
  const activeCount = fishermen.filter(f => f.status !== "offline").length;
  const resolvedCount = alerts.filter(a => a.status === "resolved").length;

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Grafik Laporan & Analisis</h1>
        <p className="text-sm text-slate-500 mt-1">Laporan statistik keselamatan nelayan dan analisis kualitas sinyal radio LoRa</p>
      </div>

      {/* KPI bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        {[
          { label: "Perangkat Aktif", value: activeCount, desc: "Sedang memancarkan telemetri" },
          { label: "Total Insiden", value: alerts.length, desc: "Terakumulasi selama sistem berjalan" },
          { label: "Insiden Selesai", value: resolvedCount, desc: "Berhasil ditangani operator" },
          { label: "Beban Saluran", value: "14%", desc: "Siklus penggunaan radio Lora" }
        ].map((k, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <span className="text-xs text-slate-500 font-semibold">{k.label}</span>
            <div className="text-xl font-bold text-foreground mt-1">{k.value}</div>
            <p className="text-xs text-slate-400 mt-0.5">{k.desc}</p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        
        {/* Signal Quality Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <h3 className="text-sm font-semibold text-foreground">Tren Kualitas Sinyal LoRa</h3>
          <div className="h-44 w-full pt-4 relative">
            <div className="absolute inset-x-0 top-0 border-t border-slate-100 text-[10px] text-slate-400 pt-1">-40 dBm</div>
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-slate-100 text-[10px] text-slate-400 pt-1">-80 dBm</div>
            <div className="absolute inset-x-0 bottom-6 border-t border-slate-100 text-[10px] text-slate-400 pt-1">-110 dBm</div>

            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path
                d="M0,50 L10,48 L20,55 L30,45 L40,60 L50,52 L60,65 L70,58 L80,72 L90,64 L100,50"
                fill="none"
                stroke="#4B6BFB"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M0,50 L10,48 L20,55 L30,45 L40,60 L50,52 L60,65 L70,58 L80,72 L90,64 L100,50 L100,100 L0,100 Z"
                fill="url(#signal-grad)"
                opacity="0.08"
              />
              <defs>
                <linearGradient id="signal-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4B6BFB" />
                  <stop offset="100%" stopColor="#4B6BFB" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Incident Frequency Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <h3 className="text-sm font-semibold text-foreground">Frekuensi Kasus Darurat Mingguan</h3>
          <div className="h-44 w-full flex items-end justify-between gap-3 pt-6 border-b border-slate-100 pb-2">
            {[
              { day: "Sen", count: 2, height: "30%" },
              { day: "Sel", count: 4, height: "60%" },
              { day: "Rab", count: 1, height: "15%" },
              { day: "Kam", count: 0, height: "2%" },
              { day: "Jum", count: 3, height: "45%" },
              { day: "Sab", count: 5, height: "75%" },
              { day: "Min", count: 6, height: "90%" }
            ].map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <div className="text-[10px] font-semibold text-slate-500">{bar.count}</div>
                <div
                  className={`w-full rounded-t-lg ${bar.count > 4 ? "bg-red-400" : "bg-blue-400"}`}
                  style={{ height: bar.height }}
                ></div>
                <span className="text-[10px] text-slate-400 mt-1">{bar.day}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
