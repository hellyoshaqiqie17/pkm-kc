"use client";

import { useEffect, useState, useMemo } from "react";
import { simulator, Fisherman, EmergencyAlert, Boat } from "@/lib/mockData";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

export default function DashboardHome() {
  const [fishermen, setFishermen] = useState<Fisherman[]>([]);
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [boats, setBoats] = useState<Boat[]>([]);
  const [selectedFisherId, setSelectedFisherId] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [presenceFilter, setPresenceFilter] = useState<"all" | "at-sea" | "docked" | "offline">("all");

  const [kpis, setKpis] = useState({
    total: 0,
    atSea: 0,
    returned: 0,
    emergencies: 0,
    onlineDevices: 0,
    offlineDevices: 0,
    avgHr: 0,
    avgTemp: 0,
    avgBattery: 0,
    avgRssi: 0,
    avgPacketLoss: 0
  });

  useEffect(() => {
    const updateData = () => {
      const allFishermen = simulator.getFishermen();
      const allAlerts = simulator.getAlerts();
      const allBoats = simulator.getBoats();
      
      setFishermen(allFishermen);
      setAlerts(allAlerts);
      setBoats(allBoats);

      // Set default selected fisherman on first load
      if (allFishermen.length > 0 && !selectedFisherId) {
        setSelectedFisherId(allFishermen[0].id);
      }

      // Compute statistics
      const total = allFishermen.length;
      const atSea = allFishermen.filter(f => f.status !== "offline").length;
      const returned = allBoats.filter(b => b.status === "docked").length;
      const emergencies = allAlerts.filter(a => a.status === "active").length;
      const onlineDevices = allFishermen.filter(f => f.status !== "offline").length;
      const offlineDevices = total - onlineDevices;

      const activeFishermen = allFishermen.filter(f => f.status !== "offline");
      const avgHr = activeFishermen.length > 0
        ? Math.round(activeFishermen.reduce((sum, f) => sum + f.heartRate, 0) / activeFishermen.length)
        : 0;
      const avgTemp = activeFishermen.length > 0
        ? parseFloat((activeFishermen.reduce((sum, f) => sum + f.temperature, 0) / activeFishermen.length).toFixed(1))
        : 0;
      const avgBattery = allFishermen.length > 0
        ? Math.round(allFishermen.reduce((sum, f) => sum + f.battery, 0) / total)
        : 0;
      const avgRssi = activeFishermen.length > 0
        ? Math.round(activeFishermen.reduce((sum, f) => sum + f.rssi, 0) / activeFishermen.length)
        : 0;
      const avgPacketLoss = activeFishermen.length > 0
        ? parseFloat((activeFishermen.reduce((sum, f) => sum + f.packetLoss, 0) / activeFishermen.length).toFixed(1))
        : 0;

      setKpis({
        total,
        atSea,
        returned,
        emergencies,
        onlineDevices,
        offlineDevices,
        avgHr,
        avgTemp,
        avgBattery,
        avgRssi,
        avgPacketLoss
      });
    };

    updateData();
    return simulator.subscribe(updateData);
  }, [selectedFisherId]);

  // Filters for presence list
  const filteredFishermen = useMemo(() => {
    return fishermen.filter((f) => {
      const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || f.assignedVestId.toLowerCase().includes(searchQuery.toLowerCase());
      
      const boatObj = boats.find(b => b.id === f.assignedBoatId);
      const isBoatDocked = boatObj?.status === "docked";

      let matchesFilter = true;
      if (presenceFilter === "at-sea") {
        matchesFilter = f.status !== "offline" && !isBoatDocked;
      } else if (presenceFilter === "docked") {
        matchesFilter = isBoatDocked;
      } else if (presenceFilter === "offline") {
        matchesFilter = f.status === "offline";
      }

      return matchesSearch && matchesFilter;
    });
  }, [fishermen, searchQuery, presenceFilter, boats]);

  const selectedFisher = fishermen.find(f => f.id === selectedFisherId);

  return (
    <div className="space-y-6 font-sans text-foreground">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Selamat Datang Kembali 👋</h1>
        <p className="text-sm text-slate-500 mt-1">Berikut adalah aktivitas armada kapal dan nelayan Anda hari ini.</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid-kpis">
        {[
          { label: "Total Terdaftar", value: kpis.total, icon: "group", iconBg: "bg-blue-50", iconColor: "text-blue-500" },
          { label: "Sedang Melaut", value: kpis.atSea, icon: "sailing", iconBg: "bg-indigo-50", iconColor: "text-indigo-500" },
          { label: "Pulang dengan Aman", value: kpis.returned, icon: "check_circle", iconBg: "bg-emerald-50", iconColor: "text-emerald-500" },
          { 
            label: "Kasus Darurat Aktif", 
            value: kpis.emergencies, 
            icon: "warning", 
            iconBg: kpis.emergencies > 0 ? "bg-red-50" : "bg-slate-50",
            iconColor: kpis.emergencies > 0 ? "text-red-500" : "text-slate-400"
          }
        ].map((k, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div>
              <span className="text-xs text-slate-500 font-medium">{k.label}</span>
              <div className="text-2xl font-bold text-foreground mt-1">{k.value}</div>
            </div>
            <div className={`h-12 w-12 rounded-full flex items-center justify-center ${k.iconBg}`}>
              <span className={`material-icons text-xl ${k.iconColor}`}>{k.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Live Presence & Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        
        {/* Left Side: Presence Card List */}
        <div className="lg:col-span-7 flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden h-[540px]" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div className="p-4 border-b border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <span className="material-icons text-blue-500 text-lg">hail</span>
                Kehadiran Langsung
              </h2>
              <span className="text-xs text-slate-500">{filteredFishermen.length} orang</span>
            </div>

            {/* Search Box */}
            <div className="relative">
              <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
              <input
                type="text"
                placeholder="Cari nelayan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-foreground text-sm placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all"
              />
            </div>

            {/* Status Filter Tabs */}
            <Tabs value={presenceFilter} onValueChange={(val) => setPresenceFilter(val as any)}>
              <TabsList className="bg-slate-100 p-1 rounded-xl flex gap-1 w-fit">
                <TabsTrigger value="all" className="px-3 py-1.5 rounded-lg text-xs font-medium data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm">Semua</TabsTrigger>
                <TabsTrigger value="at-sea" className="px-3 py-1.5 rounded-lg text-xs font-medium data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm">Melaut</TabsTrigger>
                <TabsTrigger value="docked" className="px-3 py-1.5 rounded-lg text-xs font-medium data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm">Bersandar</TabsTrigger>
                <TabsTrigger value="offline" className="px-3 py-1.5 rounded-lg text-xs font-medium data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm">Luar Jaringan</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Employee/Fisherman List */}
          <div className="flex-1 overflow-y-auto">
            {filteredFishermen.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-sm">Tidak ada nelayan yang cocok.</div>
            ) : (
              filteredFishermen.map((fish) => {
                const isSelected = selectedFisherId === fish.id;
                const boatObj = boats.find(b => b.id === fish.assignedBoatId);
                const isBoatDocked = boatObj?.status === "docked";

                return (
                  <div
                    key={fish.id}
                    onClick={() => setSelectedFisherId(fish.id)}
                    className={`flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-slate-50 transition-all border-b border-slate-50 ${
                      isSelected ? "bg-blue-50/60 border-l-[3px] border-l-blue-500" : "border-l-[3px] border-l-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative">
                        <img src={fish.avatar} alt="" className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm" />
                        <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                          fish.status === "emergency" ? "bg-red-500 animate-pulse" :
                          fish.status === "warning" ? "bg-amber-500" :
                          fish.status === "offline" ? "bg-slate-300" : "bg-emerald-500"
                        }`}></span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-foreground truncate">{fish.name}</div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {isBoatDocked ? "Tiba: 15:25" : fish.status !== "offline" ? "Pergi: 05:15" : "Belum Pergi"}
                        </div>
                      </div>
                    </div>
                    
                    {/* Status & Metrics */}
                    <div className="text-right flex items-center gap-3">
                      <div className="hidden sm:block text-right">
                        <span className="text-[11px] text-slate-400 block">Detak Jantung / Sinyal</span>
                        <span className="text-xs font-medium text-foreground">
                          {fish.status === "offline" ? "—" : `${fish.heartRate} BPM / ${fish.rssi}dB`}
                        </span>
                      </div>
                      <span className="material-icons text-slate-300 text-lg">chevron_right</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Detail Panel */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 h-[540px] flex flex-col justify-between overflow-y-auto" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          {selectedFisher ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-semibold text-foreground">Detail Telemetri Nelayan</h3>
                <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg font-medium">
                  {selectedFisher.assignedVestId}
                </span>
              </div>

              {/* Profile */}
              <div className="flex items-center gap-3">
                <img src={selectedFisher.avatar} alt="" className="h-12 w-12 rounded-2xl object-cover border border-slate-200 shadow-sm" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-foreground truncate">{selectedFisher.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      selectedFisher.status === "emergency" ? "bg-red-50 text-red-600 animate-pulse" :
                      selectedFisher.status === "warning" ? "bg-amber-50 text-amber-600" :
                      selectedFisher.status === "offline" ? "bg-slate-100 text-slate-500" : "bg-emerald-50 text-emerald-600"
                    }`}>
                      {selectedFisher.status === "offline" ? "Offline" : selectedFisher.status === "normal" ? "Melaut" : selectedFisher.status.toUpperCase()}
                    </span>

                    {/* AI Safety Score */}
                    {selectedFisher.status !== "offline" && (
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        selectedFisher.spo2 < 94 || selectedFisher.status === "emergency"
                          ? "bg-red-50 text-red-600"
                          : selectedFisher.fatigue === "High Fatigue" || selectedFisher.hypothermiaRisk !== "None"
                          ? "bg-amber-50 text-amber-600"
                          : "bg-blue-50 text-[#4B6BFB]"
                      }`}>
                        <span className="material-icons text-[10px]">psychology</span>
                        AI: {selectedFisher.spo2 < 94 || selectedFisher.status === "emergency" ? "Risiko Tinggi" : selectedFisher.fatigue === "High Fatigue" ? "Risiko Sedang" : "Risiko Rendah"}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Physiological & Safety status */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                <div className="col-span-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Fisiologi & Keselamatan</div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Detak Jantung</span>
                  <span className={`font-semibold text-sm ${selectedFisher.heartRate > 110 ? "text-red-500" : "text-slate-800"}`}>
                    {selectedFisher.status === "offline" ? "—" : `${selectedFisher.heartRate} BPM`}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Saturasi Oksigen (SpO₂)</span>
                  <span className={`font-semibold text-sm ${selectedFisher.spo2 < 95 ? "text-red-500" : "text-slate-800"}`}>
                    {selectedFisher.status === "offline" ? "—" : `${selectedFisher.spo2}%`}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Suhu Tubuh</span>
                  <span className={`font-semibold text-sm ${selectedFisher.temperature < 35.5 ? "text-blue-500 font-bold" : "text-slate-800"}`}>
                    {selectedFisher.status === "offline" ? "—" : `${selectedFisher.temperature} °C`}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Tingkat Kelelahan</span>
                  <span className={`font-semibold ${
                    selectedFisher.fatigue === "High Fatigue" ? "text-red-500" :
                    selectedFisher.fatigue === "Moderate Fatigue" ? "text-amber-500" : "text-emerald-600"
                  }`}>
                    {selectedFisher.status === "offline" ? "—" : selectedFisher.fatigue === "High Fatigue" ? "Sangat Lelah" : selectedFisher.fatigue === "Moderate Fatigue" ? "Lelah Sedang" : "Aman / Bugar"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Risiko Hipotermia</span>
                  <span className={`font-semibold ${
                    selectedFisher.hypothermiaRisk === "High Risk" ? "text-red-500" :
                    selectedFisher.hypothermiaRisk === "Low Risk" ? "text-amber-500" : "text-slate-500"
                  }`}>
                    {selectedFisher.status === "offline" ? "—" : selectedFisher.hypothermiaRisk === "High Risk" ? "Risiko Tinggi" : selectedFisher.hypothermiaRisk === "Low Risk" ? "Risiko Rendah" : "Aman"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Deteksi Air</span>
                  <span className={`font-semibold ${selectedFisher.waterDetected ? "text-blue-600" : "text-slate-500"}`}>
                    {selectedFisher.status === "offline" ? "—" : selectedFisher.waterDetected ? "BASAH (Terendam)" : "KERING"}
                  </span>
                </div>
              </div>

              {/* Environmental telemetry BME280 */}
              {selectedFisher.status !== "offline" && (
                <div className="grid grid-cols-3 gap-2 text-xs bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <div className="col-span-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Kondisi Lingkungan (BME280)</div>
                  <div>
                    <span className="text-slate-400 block text-[9px]">Suhu Sekitar</span>
                    <span className="font-semibold text-slate-700">{selectedFisher.ambientTemp}°C</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px]">Kelembapan</span>
                    <span className="font-semibold text-slate-700">{selectedFisher.ambientHumidity}%</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px]">Tekanan</span>
                    <span className="font-semibold text-slate-700 text-[10px] font-mono">{selectedFisher.ambientPressure} hPa</span>
                  </div>
                </div>
              )}

              {/* Fuel Gauge & Trip logs */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                <div className="col-span-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Daya & Log Perjalanan</div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Kapasitas Baterai</span>
                  <span className="font-semibold text-slate-800">{selectedFisher.status === "offline" ? "—" : `${selectedFisher.battery}%`}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Est. Waktu Aktif</span>
                  <span className="font-semibold text-slate-800">{selectedFisher.status === "offline" ? "—" : `~${selectedFisher.batteryRuntime} Jam`}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Waktu Pergi</span>
                  <span className="font-semibold text-slate-800">{selectedFisher.tripDepartureTime}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Durasi / Jarak</span>
                  <span className="font-semibold text-slate-800">
                    {selectedFisher.status === "offline" ? "—" : `${Math.floor(selectedFisher.tripDuration / 60)}j ${selectedFisher.tripDuration % 60}m / ${selectedFisher.tripDistance} km`}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
              <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <span className="material-icons text-slate-400 text-3xl">badge</span>
              </div>
              <h3 className="text-sm font-semibold text-slate-500">Tidak Ada Nelayan Terpilih</h3>
              <p className="text-muted-foreground text-xs mt-1.5 max-w-xs mx-auto">Pilih salah satu nelayan dari daftar di sebelah kiri untuk melihat telemetri terperinci.</p>
            </div>
          )}

          {/* Map Link */}
          {selectedFisher && (
            <Link
              href="/admin/map"
              className="py-3 px-4 rounded-xl bg-[#4B6BFB] hover:bg-blue-600 text-sm font-semibold text-white text-center transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-2 mt-4 cursor-pointer"
            >
              <span className="material-icons text-sm">explore</span>
              Temukan di Peta
            </Link>
          )}
        </div>

      </div>
    </div>
  );
}
