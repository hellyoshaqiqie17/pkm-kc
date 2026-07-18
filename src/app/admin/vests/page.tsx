"use client";

import { useEffect, useState } from "react";
import { simulator, Vest } from "@/lib/mockData";

export default function VestsPage() {
  const [vests, setVests] = useState<Vest[]>([]);
  const [calibratingId, setCalibratingId] = useState<string | null>(null);

  useEffect(() => {
    const syncVests = () => {
      setVests(simulator.getVests());
    };
    syncVests();
    return simulator.subscribe(syncVests);
  }, []);

  const handleRecalibrate = (id: string) => {
    setCalibratingId(id);
    setTimeout(() => {
      setCalibratingId(null);
      // Mock update to database
      const updated = vests.map((v) => {
        if (v.id === id) {
          return { ...v, calibration: "Calibrated" as const };
        }
        return v;
      });
      setVests(updated);
    }, 1500);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Unit Perangkat Rompi</h1>
        <p className="text-sm text-slate-500 mt-1">Inventarisasi perangkat keras dan kalibrasi diagnostik sensor</p>
      </div>

      {/* Grid list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
        {vests.map((vest) => {
          const isCalibrating = calibratingId === vest.id;
          const isFaulty = vest.calibration === "Faulty";
          const needsCalibration = vest.calibration === "Needs Calibration";

          return (
            <div
              key={vest.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between gap-5 relative"
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-mono">Radio: {vest.radioId}</span>
                  <h3 className="text-base font-semibold text-foreground mt-0.5">{vest.id.toUpperCase()}</h3>
                </div>
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                  isFaulty ? "bg-red-50 text-red-600" :
                  needsCalibration ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
                }`}>
                  {vest.calibration === "Calibrated" ? "Terkalibrasi" :
                   vest.calibration === "Needs Calibration" ? "Butuh Kalibrasi" : "Rusak / Faulty"}
                </span>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs">
                <div>
                  <span className="text-xs text-slate-400">Frekuensi</span>
                  <div className="text-foreground font-semibold mt-0.5">{vest.frequency}</div>
                </div>
                <div>
                  <span className="text-xs text-slate-400">Firmware</span>
                  <div className="text-foreground font-semibold mt-0.5">{vest.firmware}</div>
                </div>
                <div>
                  <span className="text-xs text-slate-400">Sisa Daya Baterai</span>
                  <div className="text-foreground font-semibold mt-0.5">{vest.battery}%</div>
                </div>
                <div>
                  <span className="text-xs text-slate-400">Tanggal Aktif</span>
                  <div className="text-foreground font-semibold mt-0.5">{vest.activationDate}</div>
                </div>
                <div className="col-span-2">
                  <span className="text-xs text-slate-400">Servis Terakhir</span>
                  <div className="text-foreground font-semibold mt-0.5">{vest.lastMaintenance}</div>
                </div>
              </div>

              {/* Action */}
              <button
                onClick={() => handleRecalibrate(vest.id)}
                disabled={isCalibrating}
                className={`py-2.5 px-3 rounded-xl border text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isCalibrating
                    ? "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-white border-slate-200 hover:bg-slate-50 text-foreground"
                }`}
              >
                <span className={`material-icons text-base ${isCalibrating ? "animate-spin" : ""}`}>
                  {isCalibrating ? "sync" : "build"}
                </span>
                {isCalibrating ? "Mengkalibrasi..." : "Kalibrasi Sensor"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
