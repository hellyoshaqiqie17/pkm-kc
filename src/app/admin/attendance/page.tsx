"use client";

import { useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import { simulator, Fisherman, Boat } from "@/lib/mockData";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

export default function AttendancePage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const markers = useRef<Record<string, any>>({});
  
  const [mapboxgl, setMapboxgl] = useState<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  const [fishermen, setFishermen] = useState<Fisherman[]>([]);
  const [boats, setBoats] = useState<Boat[]>([]);
  const [selectedFisher, setSelectedFisher] = useState<Fisherman | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "at-sea" | "docked">("all");
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    import("mapbox-gl").then((mapboxModule) => {
      const mapbox = mapboxModule.default;
      mapbox.accessToken = MAPBOX_TOKEN;
      setMapboxgl(mapbox);
    });
  }, []);

  useEffect(() => {
    const syncData = () => {
      setFishermen(simulator.getFishermen());
      setBoats(simulator.getBoats());
    };
    syncData();
    return simulator.subscribe(syncData);
  }, []);

  useEffect(() => {
    if (!mapboxgl || map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [111.995, -8.285],
      zoom: 11,
    });

    map.current.on("load", () => {
      setMapLoaded(true);
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    return () => {
      map.current?.remove();
      map.current = null;
      markers.current = {};
      setMapLoaded(false);
    };
  }, [mapboxgl]);

  useEffect(() => {
    if (!mapLoaded || !map.current || !mapboxgl) return;

    fishermen.forEach((fish) => {
      const isSelected = selectedFisher?.id === fish.id;
      const markerColor = 
        fish.status === "emergency" ? "#EF4444" :
        fish.status === "warning" ? "#F59E0B" :
        fish.status === "offline" ? "#94A3B8" : "#10B981";

      if (!markers.current[fish.id]) {
        const el = document.createElement("div");
        el.className = "fisherman-marker";
        el.style.color = markerColor;
        
        el.innerHTML = `
          <div class="marker-pulse"></div>
          <div class="marker-ring"></div>
          <div class="h-9 w-9 rounded-full bg-white border border-slate-200 flex items-center justify-center overflow-hidden relative shadow-md">
            <img src="${fish.avatar}" alt="" class="h-full w-full object-cover" />
          </div>
        `;

        el.addEventListener("click", () => {
          handleFisherClick(fish);
        });

        markers.current[fish.id] = new mapboxgl.Marker({ element: el })
          .setLngLat([fish.lng, fish.lat])
          .addTo(map.current);
      } else {
        const m = markers.current[fish.id];
        m.setLngLat([fish.lng, fish.lat]);
        
        const el = m.getElement();
        el.style.color = markerColor;
        
        const innerRing = el.querySelector(".marker-ring");
        if (innerRing) {
          innerRing.style.boxShadow = isSelected ? `0 0 16px ${markerColor}` : "none";
        }
      }
    });

    Object.keys(markers.current).forEach((key) => {
      if (!fishermen.some(f => f.id === key)) {
        markers.current[key].remove();
        delete markers.current[key];
      }
    });
  }, [mapLoaded, fishermen, selectedFisher?.id, mapboxgl]);

  const handleFisherClick = (fish: Fisherman) => {
    setSelectedFisher(fish);
    if (map.current) {
      map.current.flyTo({
        center: [fish.lng, fish.lat],
        zoom: 14,
        duration: 1000
      });
    }
  };

  const filteredFishermen = fishermen.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const boatObj = boats.find(b => b.id === f.assignedBoatId);
    const isBoatDocked = boatObj?.status === "docked";

    let matchesFilter = true;
    if (statusFilter === "at-sea") {
      matchesFilter = f.status !== "offline" && !isBoatDocked;
    } else if (statusFilter === "docked") {
      matchesFilter = isBoatDocked;
    }

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex-1 flex flex-col md:flex-row gap-5 h-[calc(100vh-112px)] overflow-hidden relative font-sans">
      
      {/* Sidebar */}
      <div className="w-full md:w-80 flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden shrink-0 h-full" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div className="p-4 border-b border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Kehadiran Nelayan</h2>
            <span className="text-xs text-muted-foreground">{filteredFishermen.length} orang</span>
          </div>

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

          <div>
            <label className="block text-xs text-muted-foreground font-medium mb-1">Pilih Tanggal</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm text-foreground font-mono focus:outline-none focus:border-blue-400"
            />
          </div>

          <Tabs value={statusFilter} onValueChange={(val) => setStatusFilter(val as any)} className="w-full">
            <TabsList className="bg-slate-100 p-1 rounded-xl flex gap-1 w-full justify-between">
              <TabsTrigger value="all" className="flex-1 px-3 py-1.5 rounded-lg text-xs font-medium text-center data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm">Semua</TabsTrigger>
              <TabsTrigger value="at-sea" className="flex-1 px-3 py-1.5 rounded-lg text-xs font-medium text-center data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm">Berangkat</TabsTrigger>
              <TabsTrigger value="docked" className="flex-1 px-3 py-1.5 rounded-lg text-xs font-medium text-center data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm">Pulang</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex-1 overflow-y-auto bg-white">
          {filteredFishermen.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">Tidak ada data kehadiran.</div>
          ) : (
            filteredFishermen.map((fish) => {
              const isSelected = selectedFisher?.id === fish.id;
              const boatObj = boats.find(b => b.id === fish.assignedBoatId);
              const isBoatDocked = boatObj?.status === "docked";

              return (
                <div
                  key={fish.id}
                  onClick={() => handleFisherClick(fish)}
                  className={`p-3.5 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50 transition-all border-b border-slate-50 ${
                    isSelected ? "bg-blue-50/60" : ""
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative">
                      <img src={fish.avatar} alt="" className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm" />
                      <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                        fish.status === "emergency" ? "bg-red-500" :
                        fish.status === "warning" ? "bg-amber-500" :
                        fish.status === "offline" ? "bg-slate-300" : "bg-emerald-500"
                      }`}></span>
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">{fish.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {isBoatDocked ? "Pulang: 15:45" : fish.status !== "offline" ? "Melaut: 05:15" : "Belum Berangkat"}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right flex items-center gap-2">
                    <span className="text-xs font-medium text-foreground">
                      {isBoatDocked ? "Bersandar" : fish.status !== "offline" ? "Melaut" : "Offline"}
                    </span>
                    <span className="material-icons text-slate-300 text-lg">chevron_right</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Map */}
      <div className="flex-1 rounded-2xl overflow-hidden border border-slate-200 relative h-full" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        {!mapLoaded && (
          <div className="absolute inset-0 bg-slate-50 flex items-center justify-center z-50">
            <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
              <span className="material-icons animate-spin text-blue-500 text-xl">sync</span>
            </div>
          </div>
        )}

        <div ref={mapContainer} className="h-full w-full bg-slate-100" />

        {/* Detail Overlay */}
        {selectedFisher && (
          <div className="absolute bottom-5 left-5 z-40 bg-white border border-slate-200 rounded-2xl p-5 shadow-lg max-w-sm w-full flex flex-col gap-4 relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setSelectedFisher(null)}
              className="absolute top-3 right-3 text-slate-400 hover:text-foreground text-sm h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200 transition-colors"
            >
              <span className="material-icons text-sm">close</span>
            </button>
            
            <div className="flex items-center gap-3">
              <img src={selectedFisher.avatar} alt="" className="h-14 w-14 rounded-xl object-cover border border-slate-200 shadow-sm" />
              <div>
                <h3 className="text-sm font-semibold text-foreground">{selectedFisher.name}</h3>
                <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full mt-1.5 inline-block ${
                  selectedFisher.status === "emergency" ? "bg-red-50 text-red-600 animate-pulse" :
                  selectedFisher.status === "warning" ? "bg-amber-50 text-amber-600" :
                  selectedFisher.status === "offline" ? "bg-slate-100 text-slate-500" : "bg-emerald-50 text-emerald-600"
                }`}>
                  {selectedFisher.status === "offline" ? "Tidak Hadir" : selectedFisher.status === "emergency" ? "Emergency" : "Hadir"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm bg-slate-50 border border-slate-200 rounded-xl p-3">
              <div>
                <span className="text-xs text-muted-foreground block">Check In</span>
                <span className="text-foreground font-medium">05:15 AM</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Boat</span>
                <span className="text-foreground font-medium">{boats.find(b => b.id === selectedFisher.assignedBoatId)?.name || "—"}</span>
              </div>
              <div className="col-span-2">
                <span className="text-xs text-muted-foreground block">Koordinat</span>
                <span className="text-blue-600 font-mono font-medium text-xs">{selectedFisher.lat.toFixed(5)}, {selectedFisher.lng.toFixed(5)}</span>
              </div>
            </div>

            <button 
              onClick={() => setShowDetailModal(true)}
              className="py-2.5 px-3 rounded-xl bg-[#4B6BFB] hover:bg-[#3B5BEB] text-white text-sm font-semibold transition-all text-center shadow-md shadow-blue-500/10"
            >
              Detail Kehadiran
            </button>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-md bg-white border border-slate-200 p-6 rounded-2xl shadow-xl outline-none">
          {selectedFisher && (
            <>
              <DialogHeader>
                <DialogTitle className="text-base font-semibold text-foreground">Detail Kehadiran & Telemetry</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Log data biometric dan telemetry nelayan.
                </DialogDescription>
              </DialogHeader>

              <div className="flex items-center gap-4 mt-2">
                <img src={selectedFisher.avatar} alt="" className="h-14 w-14 rounded-xl object-cover border border-slate-200 shadow-sm" />
                <div>
                  <h4 className="text-sm font-semibold text-foreground">{selectedFisher.name}</h4>
                  <p className="text-xs text-muted-foreground">Vest: {selectedFisher.assignedVestId}</p>
                  <p className="text-xs text-muted-foreground">{selectedFisher.phone}</p>
                </div>
              </div>

              <div className="space-y-3 mt-4">
                <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50 text-sm space-y-2.5">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Waktu Berangkat</span>
                    <span className="text-foreground font-semibold">{selectedFisher.tripDepartureTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Durasi Melaut</span>
                    <span className="text-foreground font-semibold">{Math.floor(selectedFisher.tripDuration / 60)}j {selectedFisher.tripDuration % 60}m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Jarak Tempuh</span>
                    <span className="text-foreground font-semibold">{selectedFisher.tripDistance} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Blood Oxygen (SpO₂)</span>
                    <span className={`font-semibold ${selectedFisher.spo2 < 95 ? "text-red-500 font-bold" : "text-emerald-600"}`}>{selectedFisher.spo2}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Heart Rate</span>
                    <span className="text-foreground font-semibold">{selectedFisher.heartRate} BPM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Suhu Tubuh</span>
                    <span className="text-foreground font-semibold">{selectedFisher.temperature} °C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Kecepatan Kapal</span>
                    <span className="text-foreground font-semibold">{selectedFisher.speed} Kts</span>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50 text-sm">
                  <span className="text-xs text-muted-foreground block mb-1">Emergency Contact</span>
                  <div className="text-foreground font-medium">{selectedFisher.emergencyContact}</div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button 
                  onClick={() => setShowDetailModal(false)}
                  className="py-2.5 px-5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-sm font-medium text-foreground transition-all"
                >
                  Tutup
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
