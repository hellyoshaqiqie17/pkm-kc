"use client";

import { useEffect, useState } from "react";
import { simulator, Fisherman, Boat, Vest } from "@/lib/mockData";

export default function FishermenPage() {
  const [fishermen, setFishermen] = useState<Fisherman[]>([]);
  const [boats, setBoats] = useState<Boat[]>([]);
  const [vests, setVests] = useState<Vest[]>([]);
  const [selectedFisher, setSelectedFisher] = useState<Fisherman | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const syncData = () => {
      setFishermen(simulator.getFishermen());
      setBoats(simulator.getBoats());
      setVests(simulator.getVests());
    };
    syncData();
    return simulator.subscribe(syncData);
  }, []);

  const filteredFishermen = fishermen.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.assignedVestId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
      
      {/* Directory column */}
      <div className="w-full lg:w-96 flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden shrink-0" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div className="p-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-foreground mb-3">Direktori Nelayan</h2>
          <div className="relative">
            <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
            <input
              type="text"
              placeholder="Cari berdasarkan nama atau rompi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-foreground text-sm placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-white">
          {filteredFishermen.map((fish) => {
            const isSelected = selectedFisher?.id === fish.id;
            return (
              <div
                key={fish.id}
                onClick={() => setSelectedFisher(fish)}
                className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition-all border-b border-slate-50 ${
                  isSelected ? "bg-blue-50/60 border-l-[3px] border-l-blue-500" : "border-l-[3px] border-l-transparent"
                }`}
              >
                <img src={fish.avatar} alt="" className="h-10 w-10 rounded-xl object-cover border border-slate-200 shadow-sm" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-foreground truncate">{fish.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">Rompi: {fish.assignedVestId}</div>
                </div>
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                  fish.status === "emergency" ? "bg-red-50 text-red-600" :
                  fish.status === "warning" ? "bg-amber-50 text-amber-600" :
                  fish.status === "offline" ? "bg-slate-100 text-slate-500" : "bg-emerald-50 text-emerald-600"
                }`}>
                  {fish.status === "normal" ? "Aktif" : fish.status === "offline" ? "Mati" : fish.status.toUpperCase()}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail column */}
      <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-6 overflow-y-auto h-full" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        {selectedFisher ? (
          <div className="space-y-6">
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row items-center gap-6 border-b border-slate-100 pb-6">
              <img src={selectedFisher.avatar} alt="" className="h-20 w-20 rounded-2xl object-cover border-2 border-white shadow-md" />
              <div className="text-center sm:text-left space-y-1">
                <h3 className="text-lg font-bold text-foreground">{selectedFisher.name}</h3>
                <p className="text-sm text-slate-500">Umur: {selectedFisher.age} Tahun • {selectedFisher.phone}</p>
                <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
                  <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg font-semibold">
                    Kapal: {boats.find(b => b.id === selectedFisher.assignedBoatId)?.name || "—"}
                  </span>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg font-semibold">
                    ID Rompi: {selectedFisher.assignedVestId}
                  </span>
                </div>
              </div>
            </div>

            {/* Diagnostics grid */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Diagnosis Fisiologis & Keselamatan Live</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4 text-xs">
                {[
                  { label: "Detak Jantung", value: selectedFisher.status === "offline" ? "—" : `${selectedFisher.heartRate} BPM`, sub: "Nadi MAX30102", color: selectedFisher.heartRate > 110 ? "text-red-500" : "text-foreground" },
                  { label: "Kadar Oksigen (SpO₂)", value: selectedFisher.status === "offline" ? "—" : `${selectedFisher.spo2}%`, sub: "Saturasi MAX30102", color: selectedFisher.spo2 < 95 ? "text-red-500 font-bold" : "text-foreground" },
                  { label: "Suhu Tubuh", value: selectedFisher.status === "offline" ? "—" : `${selectedFisher.temperature} °C`, sub: "Suhu MAX30205", color: selectedFisher.temperature < 35.5 ? "text-blue-500" : "text-foreground" },
                  { label: "Est. Daya Baterai", value: selectedFisher.status === "offline" ? "—" : `~${selectedFisher.batteryRuntime} Jam`, sub: `Kapasitas: ${selectedFisher.battery}%`, color: selectedFisher.battery < 20 ? "text-red-500 animate-pulse" : "text-emerald-600" }
                ].map((d, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm">
                    <div className="text-xs text-slate-400">{d.label}</div>
                    <div className={`text-lg font-bold mt-1 ${d.color}`}>{d.value}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{d.sub}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                {[
                  { label: "Tingkat Kelelahan", value: selectedFisher.status === "offline" ? "—" : selectedFisher.fatigue === "High Fatigue" ? "Sangat Lelah" : selectedFisher.fatigue === "Moderate Fatigue" ? "Lelah Sedang" : "Aman / Bugar", sub: "Model Gerak IMU", color: selectedFisher.fatigue === "High Fatigue" ? "text-red-500 font-semibold" : "text-slate-700" },
                  { label: "Risiko Hipotermia", value: selectedFisher.status === "offline" ? "—" : selectedFisher.hypothermiaRisk === "High Risk" ? "Risiko Tinggi" : selectedFisher.hypothermiaRisk === "Low Risk" ? "Risiko Rendah" : "Aman", sub: "Analisis Air + Suhu", color: selectedFisher.hypothermiaRisk === "High Risk" ? "text-red-500 font-semibold" : "text-slate-700" },
                  { label: "Sensor Kontak Air", value: selectedFisher.status === "offline" ? "—" : selectedFisher.waterDetected ? "BASAH (Terendam)" : "KERING", sub: "Konduktivitas Cairan", color: selectedFisher.waterDetected ? "text-blue-500 font-bold" : "text-slate-700" },
                  { label: "Kekuatan Sinyal LoRa", value: `${selectedFisher.rssi} dBm`, sub: "SX1262 Link", color: "text-blue-600 font-semibold" }
                ].map((d, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm">
                    <div className="text-xs text-slate-400">{d.label}</div>
                    <div className={`text-sm font-semibold mt-1.5 ${d.color}`}>{d.value}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{d.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Medical & Vessel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="material-icons text-blue-500 text-lg">medical_services</span>
                  Profil Medis & Log Perjalanan
                </h4>
                <div className="space-y-2 text-sm text-slate-500 leading-relaxed">
                  <div><span className="text-slate-400 font-semibold font-mono">Golongan Darah:</span> O-</div>
                  <div><span className="text-slate-400 font-semibold font-mono">Alergi:</span> Makanan Laut (Peringatan Kritis)</div>
                  <div><span className="text-slate-400 font-semibold font-mono">Waktu Berangkat:</span> {selectedFisher.tripDepartureTime} ({Math.floor(selectedFisher.tripDuration / 60)}j {selectedFisher.tripDuration % 60}m melaut)</div>
                  <div><span className="text-slate-400 font-semibold font-mono">Jarak Tempuh:</span> {selectedFisher.tripDistance} km</div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="material-icons text-blue-500 text-lg">sailing</span>
                  Info Kapal & Lingkungan (BME280)
                </h4>
                <div className="space-y-2 text-sm text-slate-500 leading-relaxed">
                  <div><span className="text-slate-400 font-semibold font-mono">Armada Kapal:</span> Baruna Jaya VII (Lora RF: 920.4 MHz)</div>
                  <div><span className="text-slate-400 font-semibold font-mono">Suhu Sekitar:</span> {selectedFisher.ambientTemp}°C</div>
                  <div><span className="text-slate-400 font-semibold font-mono">Kelembapan:</span> {selectedFisher.ambientHumidity}%</div>
                  <div><span className="text-slate-400 font-semibold font-mono">Tekanan Udara:</span> {selectedFisher.ambientPressure} hPa</div>
                </div>
              </div>
            </div>

            {/* HR Timeline */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <h4 className="text-sm font-semibold text-foreground mb-3">Garis Waktu Detak Jantung (24 Jam Terakhir)</h4>
              <div className="h-28 w-full flex items-end justify-between gap-1.5 pt-4">
                {Array.from({ length: 24 }).map((_, i) => {
                  const hrValue = selectedFisher.status === "offline" ? 0 : 70 + Math.floor(Math.sin(i / 2) * 5) + (i === 12 && selectedFisher.status === "emergency" ? 40 : Math.floor(Math.random() * 4));
                  const percent = Math.min(100, Math.max(0, (hrValue / 150) * 100));
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                      <div
                        className={`w-full rounded-t ${hrValue > 100 ? "bg-red-400" : "bg-blue-400"}`}
                        style={{ height: `${percent}%` }}
                        title={`${hrValue} bpm`}
                      ></div>
                      <span className="text-[8px] text-slate-400">{i}j</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center py-12">
            <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <span className="material-icons text-slate-400 text-3xl">person</span>
            </div>
            <h3 className="text-sm font-semibold text-slate-500">Tidak Ada Nelayan Terpilih</h3>
            <p className="text-slate-500 text-xs mt-1.5 max-w-xs mx-auto">Pilih salah satu nelayan dari direktori di sebelah kiri untuk melihat profil lengkap.</p>
          </div>
        )}
      </div>
    </div>
  );
}
