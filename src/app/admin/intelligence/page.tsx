"use client";

import { useEffect, useState, useMemo } from "react";
import { simulator, Vest, Fisherman } from "@/lib/mockData";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DeviceIntelligencePage() {
  const [vests, setVests] = useState<Vest[]>([]);
  const [fishermen, setFishermen] = useState<Fisherman[]>([]);
  const [selectedVestId, setSelectedVestId] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "calibrated" | "faulty">("all");

  useEffect(() => {
    const syncData = () => {
      const allVests = simulator.getVests();
      setVests(allVests);
      setFishermen(simulator.getFishermen());
      
      if (allVests.length > 0 && !selectedVestId) {
        setSelectedVestId(allVests[0].id);
      }
    };
    syncData();
    return simulator.subscribe(syncData);
  }, [selectedVestId]);

  // Compute node anomalies
  const anomalies = useMemo(() => {
    const list: { node: string; severity: "warning" | "critical"; message: string }[] = [];
    vests.forEach((v) => {
      if (v.battery < 20) {
        list.push({ node: v.id, severity: "warning" as const, message: `Baterai lemah: ${v.battery}%` });
      }
      if (v.calibration === "Faulty") {
        list.push({ node: v.id, severity: "critical" as const, message: "Penyimpangan kalibrasi sensor terdeteksi" });
      }
      if (v.calibration === "Needs Calibration") {
        list.push({ node: v.id, severity: "warning" as const, message: "Membutuhkan kalibrasi sensor" });
      }
    });
    return list;
  }, [vests]);

  const selectedVest = vests.find(v => v.id === selectedVestId);
  const assignedFisher = fishermen.find(f => f.assignedVestId === selectedVest?.id);
  const assignedBoat = useMemo(() => {
    if (!assignedFisher) return null;
    return simulator.getBoats().find(b => b.id === assignedFisher.assignedBoatId);
  }, [assignedFisher]);

  // Filters for Vests
  const filteredVests = useMemo(() => {
    return vests.filter((v) => {
      const matchesSearch = v.id.toLowerCase().includes(searchQuery.toLowerCase()) || v.radioId.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesFilter = true;
      if (statusFilter === "calibrated") {
        matchesFilter = v.calibration === "Calibrated";
      } else if (statusFilter === "faulty") {
        matchesFilter = v.calibration === "Faulty" || v.calibration === "Needs Calibration";
      }

      return matchesSearch && matchesFilter;
    });
  }, [vests, searchQuery, statusFilter]);

  return (
    <div className="space-y-6 font-sans text-foreground">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Inteligensi Node</h1>
        <p className="text-sm text-slate-500 mt-1">Metrik kalibrasi sensor, kualitas jaringan LoRa, dan analisis diagnostik node</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Node list */}
        <div className="lg:col-span-5 flex flex-col bg-white border border-slate-200 rounded-2xl h-[520px] overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div className="p-4 border-b border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Direktori Perangkat</span>
              <span className="text-xs bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-lg font-medium">
                {vests.length} unit
              </span>
            </div>

            <div className="relative">
              <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
              <input
                type="text"
                placeholder="Cari berdasarkan ID atau radio..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-foreground text-sm placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all"
              />
            </div>

            <Tabs value={statusFilter} onValueChange={(val) => setStatusFilter(val as any)} className="w-full">
              <TabsList className="bg-slate-100 p-1 rounded-xl flex gap-1 w-full justify-between">
                <TabsTrigger value="all" className="flex-1 px-3 py-1.5 rounded-lg text-xs font-medium text-center data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm">Semua</TabsTrigger>
                <TabsTrigger value="calibrated" className="flex-1 px-3 py-1.5 rounded-lg text-xs font-medium text-center data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm">Normal</TabsTrigger>
                <TabsTrigger value="faulty" className="flex-1 px-3 py-1.5 rounded-lg text-xs font-medium text-center data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm">Kendala</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredVests.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-sm">Tidak ada perangkat yang cocok.</div>
            ) : (
              filteredVests.map((vest) => {
                const isSelected = selectedVestId === vest.id;
                const isFaulty = vest.calibration === "Faulty" || vest.calibration === "Needs Calibration";

                return (
                  <div
                    key={vest.id}
                    onClick={() => setSelectedVestId(vest.id)}
                    className={`flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-slate-50 transition-all border-b border-slate-50 ${
                      isSelected ? "bg-blue-50/60 border-l-[3px] border-l-blue-500" : "border-l-[3px] border-l-transparent"
                    }`}
                  >
                    <div>
                      <div className="text-sm font-medium text-foreground">{vest.id.toUpperCase()}</div>
                      <div className="text-xs text-slate-500 mt-0.5">Frekuensi: {vest.frequency} • Baterai: {vest.battery}%</div>
                    </div>
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                      isFaulty ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
                    }`}>
                      {vest.calibration === "Calibrated" ? "Terkalibrasi" :
                       vest.calibration === "Needs Calibration" ? "Butuh Kalibrasi" : "Rusak"}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Diagnostics */}
        <div className="lg:col-span-7 space-y-5">
          {selectedVest ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Node Details */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 border-b border-slate-100 pb-3">
                  <span className="material-icons text-blue-500 text-lg">router</span>
                  Detail Node Rompi
                </h3>

                <div className="grid grid-cols-2 gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs">
                  <div>
                    <span className="text-xs text-slate-400 block">ID Radio</span>
                    <span className="text-foreground font-semibold">{selectedVest.radioId}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Firmware</span>
                    <span className="text-foreground font-semibold">{selectedVest.firmware}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Baterai</span>
                    <span className="text-foreground font-semibold">{selectedVest.battery}%</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Siklus Aktif</span>
                    <span className="text-foreground font-semibold">12.4% Duty</span>
                  </div>
                </div>

                <div className="text-xs space-y-2.5">
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Nelayan Pemegang</span>
                    <span className="text-foreground font-semibold">{assignedFisher ? assignedFisher.name : "Belum Ditugaskan"}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Armada Kapal</span>
                    <span className="text-foreground font-semibold">{assignedBoat ? assignedBoat.name : "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tanggal Servis</span>
                    <span className="text-foreground font-semibold">{selectedVest.lastMaintenance}</span>
                  </div>
                </div>
              </div>

              {/* Calibration Metrics */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 border-b border-slate-100 pb-3">
                  <span className="material-icons text-blue-500 text-lg">tune</span>
                  Kalibrasi Sensor
                </h3>

                <div className="space-y-5 pt-1 text-xs">
                  <div>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-slate-500">Penyimpangan Gyro</span>
                      <span className={`font-semibold ${selectedVest.calibration === "Faulty" ? "text-red-500" : "text-emerald-600"}`}>
                        {selectedVest.calibration === "Faulty" ? "+0.45°/s" : "Selaras (Aligned)"}
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${selectedVest.calibration === "Faulty" ? "bg-red-400 w-4/5" : "bg-emerald-400 w-1/5"}`}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-slate-500">Offset Biometrik</span>
                      <span className="font-semibold text-emerald-600">Normal</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400 w-1/4 rounded-full"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-slate-500">Rasio Kehilangan Paket</span>
                      <span className="font-semibold text-foreground font-mono">1.2%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-400 w-[12%] rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Anomalies */}
              <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 space-y-3" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <h3 className="text-sm font-semibold text-foreground">Daftar Anomali Perangkat</h3>
                
                <div className="space-y-2 text-xs">
                  {anomalies.length === 0 ? (
                    <div className="text-center py-6 text-slate-500 text-sm bg-slate-50 border border-slate-200 rounded-xl">
                      Tidak ada anomali sensor terdeteksi dalam 48 jam terakhir.
                    </div>
                  ) : (
                    anomalies.map((an, i) => (
                      <div 
                        key={i} 
                        className={`p-3 rounded-xl border flex items-center justify-between text-sm ${
                          an.severity === "critical" 
                            ? "bg-red-50 text-red-600 border-red-200" 
                            : "bg-amber-50 text-amber-600 border-amber-200"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="material-icons text-base">{an.severity === "critical" ? "error" : "warning"}</span>
                          <span><strong>{an.node.toUpperCase()}:</strong> {an.message}</span>
                        </div>
                        <span className="text-xs text-slate-400 font-mono">Live</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <span className="material-icons text-slate-400 text-3xl">memory</span>
              </div>
              <p className="text-slate-500 text-sm">Pilih perangkat dari direktori untuk melihat diagnosis telemetri.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
