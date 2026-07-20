"use client";

import { useEffect, useState, useMemo } from "react";
import { simulator, Fisherman, EmergencyAlert } from "@/lib/mockData";

export default function AnalyticsPage() {
  const [fishermen, setFishermen] = useState<Fisherman[]>([]);
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const syncData = () => {
      setFishermen(simulator.getFishermen());
      setAlerts(simulator.getAlerts());
      setHistory([...simulator.getHistory()]);
    };
    syncData();
    return simulator.subscribe(syncData);
  }, []);

  // Compute stats
  const activeCount = fishermen.filter(f => f.status !== "offline").length;
  const resolvedCount = alerts.filter(a => a.status === "resolved").length;

  // Generate SVG path for signal quality chart (RSSI)
  const { pathD, areaD, latestRssi, latestLoss } = useMemo(() => {
    if (history.length === 0) {
      return { pathD: "", areaD: "", latestRssi: -70, latestLoss: 0 };
    }
    const latest = history[history.length - 1];
    const points = history.map((h, i) => {
      const x = (i / (history.length - 1)) * 100;
      // Map RSSI: -40 is top (10), -110 is bottom (90)
      const rssiVal = h.avgRssi;
      const y = 10 + ((rssiVal - (-40)) / (-110 - (-40))) * 80;
      return `${x},${y}`;
    });
    return {
      pathD: `M${points.join(" L")}`,
      areaD: `M0,100 L${points.join(" L")} L100,100 Z`,
      latestRssi: latest.avgRssi,
      latestLoss: latest.avgPacketLoss
    };
  }, [history]);

  // Compute categories counts for alerts
  const alertCategories = useMemo(() => {
    const counts: Record<string, number> = {
      "SOS": 0,
      "Jatuh": 0,
      "Medis": 0,
      "Fisik": 0,
      "Sinyal": 0,
      "Geofence": 0
    };

    alerts.forEach(a => {
      if (a.status !== "active") return; // Only count active alerts
      if (a.alertType === "SOS Button") {
        counts["SOS"]++;
      } else if (a.alertType === "Fall Overboard" || a.alertType === "No Movement") {
        counts["Jatuh"]++;
      } else if (a.alertType === "Heart Rate Abnormal" || a.alertType === "Temp Abnormal" || a.alertType === "Low SpO2") {
        counts["Medis"]++;
      } else if (a.alertType === "High Fatigue" || a.alertType === "Hypothermia Risk") {
        counts["Fisik"]++;
      } else if (a.alertType === "Lost Signal") {
        counts["Sinyal"]++;
      } else if (a.alertType === "Outside Fishing Area") {
        counts["Geofence"]++;
      }
    });

    const maxCount = Math.max(...Object.values(counts), 1);

    return Object.entries(counts).map(([label, count]) => {
      const heightPercentage = Math.max(5, (count / maxCount) * 80); // Min 5% height for visual
      let colorClass = "bg-blue-400";
      if (count > 0) {
        if (label === "SOS" || label === "Jatuh") colorClass = "bg-red-500 animate-pulse";
        else if (label === "Medis" || label === "Fisik") colorClass = "bg-amber-500";
        else colorClass = "bg-indigo-500";
      } else {
        colorClass = "bg-slate-200";
      }
      return {
        label,
        count,
        height: `${heightPercentage}%`,
        colorClass
      };
    });
  }, [alerts]);

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
          { label: "Beban Saluran", value: `${Math.round(activeCount * 1.5 + 2)}%`, desc: "Siklus penggunaan radio Lora" }
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
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-sm font-semibold text-foreground">Tren Kualitas Sinyal LoRa</h3>
            <div className="flex gap-3 text-[10px] text-slate-500 font-mono">
              <span>Rerata RSSI: <strong className="text-blue-600">{latestRssi} dBm</strong></span>
              <span>Loss: <strong className="text-[#4B6BFB]">{latestLoss}%</strong></span>
            </div>
          </div>
          <div className="h-44 w-full pt-4 relative">
            <div className="absolute inset-x-0 top-0 border-t border-slate-100 text-[10px] text-slate-400 pt-1">-40 dBm (Sangat Baik)</div>
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-slate-100 text-[10px] text-slate-400 pt-1">-80 dBm (Sedang)</div>
            <div className="absolute inset-x-0 bottom-6 border-t border-slate-100 text-[10px] text-slate-400 pt-1">-110 dBm (Lemah)</div>

            {pathD ? (
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path
                  d={pathD}
                  fill="none"
                  stroke="#4B6BFB"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d={areaD}
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
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                Mengumpulkan data sinyal...
              </div>
            )}
          </div>
        </div>

        {/* Incident Frequency Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-sm font-semibold text-foreground">Distribusi Kategori Insiden Teraktif</h3>
            <span className="text-[10px] text-slate-400">Update Real-Time</span>
          </div>
          <div className="h-44 w-full flex items-end justify-between gap-3 pt-6 border-b border-slate-100 pb-2">
            {alertCategories.map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <div className={`text-[10px] font-bold ${bar.count > 0 ? "text-slate-800" : "text-slate-400"}`}>
                  {bar.count}
                </div>
                <div
                  className={`w-full rounded-t-lg transition-all duration-500 ${bar.colorClass}`}
                  style={{ height: bar.height }}
                ></div>
                <span className="text-[10px] text-slate-400 mt-1 font-semibold">{bar.label}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
