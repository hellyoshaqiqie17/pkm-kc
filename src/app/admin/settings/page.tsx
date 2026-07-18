"use client";

import { useEffect, useState } from "react";
import { simulator, BaseStation } from "@/lib/mockData";

export default function SettingsPage() {
  const [stations, setStations] = useState<BaseStation[]>([]);
  const [hrThreshold, setHrThreshold] = useState(120);
  const [tempThreshold, setTempThreshold] = useState(38.0);
  const [lowBatThreshold, setLowBatThreshold] = useState(15);
  const [spo2Threshold, setSpo2Threshold] = useState(94);
  const [geofenceLimit, setGeofenceLimit] = useState(25);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const syncData = () => {
      setStations(simulator.getStations());
    };
    syncData();
    return simulator.subscribe(syncData);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Pengaturan Sistem</h1>
        <p className="text-sm text-slate-500 mt-1">Konfigurasi parameter sistem dan ambang batas peringatan bahaya</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
        
        {/* Base Station Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="material-icons text-blue-500 text-lg">cell_tower</span>
              Stasiun Pangkalan (Base Station)
            </h3>

            {stations.map((st) => (
              <div key={st.id} className="space-y-4">
                <div className="flex items-center justify-between bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
                  <div className="text-sm font-semibold text-foreground">{st.name}</div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs text-emerald-600 font-semibold">Aktif</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <span className="text-xs text-slate-400">Lintang (Latitude)</span>
                    <div className="text-foreground font-semibold mt-0.5 font-mono">{st.lat.toFixed(5)}</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <span className="text-xs text-slate-400">Bujur (Longitude)</span>
                    <div className="text-foreground font-semibold mt-0.5 font-mono">{st.lng.toFixed(5)}</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <span className="text-xs text-slate-400">Jangkauan Radio</span>
                    <div className="text-foreground font-semibold mt-0.5">{(st.radius / 1000).toFixed(0)} km</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <span className="text-xs text-slate-400">Terhubung</span>
                    <div className="text-foreground font-semibold mt-0.5">{st.connectedDevices} Perangkat</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Threshold Config */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <h3 className="text-sm font-semibold text-foreground border-b border-slate-100 pb-3 mb-6">
            Batas Peringatan Bahaya (Thresholds)
          </h3>

          {saveSuccess && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold flex items-center gap-2">
              <span className="material-icons text-base">check_circle</span>
              Konfigurasi berhasil disimpan.
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-8 text-xs">
            {/* HR Threshold */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <label className="text-sm font-semibold text-foreground block">Batas Detak Jantung</label>
                  <span className="text-xs text-slate-400">Picu peringatan jika detak jantung melebihi (BPM)</span>
                </div>
                <span className="text-lg font-bold text-red-500 font-mono">{hrThreshold}</span>
              </div>
              <input
                type="range"
                min="90"
                max="160"
                value={hrThreshold}
                onChange={(e) => setHrThreshold(parseInt(e.target.value))}
                className="w-full accent-blue-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>90 BPM</span>
                <span>160 BPM</span>
              </div>
            </div>

            {/* Temp Threshold */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <label className="text-sm font-semibold text-foreground block">Batas Suhu Tubuh Tinggi</label>
                  <span className="text-xs text-slate-400">Picu peringatan jika suhu tubuh melebihi (°C)</span>
                </div>
                <span className="text-lg font-bold text-amber-500 font-mono">{tempThreshold}°C</span>
              </div>
              <input
                type="range"
                min="370"
                max="400"
                value={tempThreshold * 10}
                onChange={(e) => setTempThreshold(parseInt(e.target.value) / 10)}
                className="w-full accent-blue-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>37.0°C</span>
                <span>40.0°C</span>
              </div>
            </div>

            {/* Battery Warning */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <label className="text-sm font-semibold text-foreground block">Batas Baterai Lemah</label>
                  <span className="text-xs text-slate-400">Picu peringatan baterai lemah di bawah (%)</span>
                </div>
                <span className="text-lg font-bold text-red-500 font-mono">{lowBatThreshold}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                value={lowBatThreshold}
                onChange={(e) => setLowBatThreshold(parseInt(e.target.value))}
                className="w-full accent-blue-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>5%</span>
                <span>30%</span>
              </div>
            </div>

            {/* SpO2 Alert limit */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <label className="text-sm font-semibold text-foreground block">Batas Saturasi Oksigen (SpO₂)</label>
                  <span className="text-xs text-slate-400">Picu peringatan jika oksigen darah di bawah (%)</span>
                </div>
                <span className="text-lg font-bold text-[#4B6BFB] font-mono">{spo2Threshold}%</span>
              </div>
              <input
                type="range"
                min="88"
                max="96"
                value={spo2Threshold}
                onChange={(e) => setSpo2Threshold(parseInt(e.target.value))}
                className="w-full accent-blue-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>88%</span>
                <span>96%</span>
              </div>
            </div>

            {/* Geofence safe zone */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <label className="text-sm font-semibold text-foreground block">Radius Zona Tangkap Aman (Geofence)</label>
                  <span className="text-xs text-slate-400">Batas operasional melaut maksimum dari stasiun pantai</span>
                </div>
                <span className="text-lg font-bold text-indigo-500 font-mono">{geofenceLimit} km</span>
              </div>
              <input
                type="range"
                min="10"
                max="40"
                value={geofenceLimit}
                onChange={(e) => setGeofenceLimit(parseInt(e.target.value))}
                className="w-full accent-blue-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>10 km</span>
                <span>40 km</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="py-3 px-6 rounded-xl bg-[#4B6BFB] hover:bg-[#3B5BEB] text-sm font-semibold text-white transition-all shadow-md shadow-blue-500/10 cursor-pointer"
              >
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
