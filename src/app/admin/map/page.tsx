"use client";

import { useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import { simulator, Fisherman, BaseStation } from "@/lib/mockData";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

export default function MarineMapPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const markers = useRef<Record<string, any>>({});
  
  const [mapboxgl, setMapboxgl] = useState<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapStyle, setMapStyle] = useState("light");
  
  const [fishermen, setFishermen] = useState<Fisherman[]>([]);
  const [selectedFisher, setSelectedFisher] = useState<Fisherman | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "active" | "emergency">("all");
  const [showGeofence, setShowGeofence] = useState(true);
  const [showCoverage, setShowCoverage] = useState(true);

  useEffect(() => {
    import("mapbox-gl").then((mapboxModule) => {
      const mapbox = mapboxModule.default;
      mapbox.accessToken = MAPBOX_TOKEN;
      setMapboxgl(mapbox);
    });
  }, []);

  useEffect(() => {
    const syncData = () => {
      const all = simulator.getFishermen();
      setFishermen(all);

      if (selectedFisher) {
        const updated = all.find(f => f.id === selectedFisher.id);
        if (updated) setSelectedFisher(updated);
      }
    };

    syncData();
    return simulator.subscribe(syncData);
  }, [selectedFisher]);

  useEffect(() => {
    if (!mapboxgl || map.current || !mapContainer.current) return;

    const styleUrl = 
      mapStyle === "satellite" ? "mapbox://styles/mapbox/satellite-streets-v12" :
      mapStyle === "light" ? "mapbox://styles/mapbox/light-v11" :
      "mapbox://styles/mapbox/dark-v11";

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: styleUrl,
      center: [111.995, -8.285],
      zoom: 10.5,
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
  }, [mapboxgl, mapStyle]);

  // Draw Geofence & Coverage
  useEffect(() => {
    if (!mapLoaded || !map.current || !mapboxgl) return;

    const drawLayers = () => {
      if (!map.current) return;
      
      try {
        if (map.current.getLayer("geofence-layer")) map.current.removeLayer("geofence-layer");
        if (map.current.getLayer("geofence-outline-layer")) map.current.removeLayer("geofence-outline-layer");
        if (map.current.getSource("geofence-source")) map.current.removeSource("geofence-source");
        if (map.current.getLayer("coverage-layer")) map.current.removeLayer("coverage-layer");
        if (map.current.getSource("coverage-source")) map.current.removeSource("coverage-source");
      } catch (e) {
        console.warn("Clean sources warning", e);
      }

      if (showGeofence) {
        try {
          const centerLat = -8.285;
          const centerLng = 111.995;
          const radiusKm = 20; // 20 km safe zone
          const points = 64;
          const coords = [];
          const latConv = radiusKm / 110.574;
          const lngConv = radiusKm / (111.320 * Math.cos(centerLat * Math.PI / 180));

          for (let i = 0; i < points; i++) {
            const theta = (i / points) * (2 * Math.PI);
            const x = Math.cos(theta) * lngConv;
            const y = Math.sin(theta) * latConv;
            coords.push([centerLng + x, centerLat + y]);
          }
          coords.push(coords[0]);

          map.current.addSource("geofence-source", {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: {
                type: "Polygon",
                coordinates: [coords]
              }
            }
          });

          map.current.addLayer({
            id: "geofence-layer",
            type: "fill",
            source: "geofence-source",
            layout: {},
            paint: {
              "fill-color": "#3B82F6",
              "fill-opacity": 0.06,
              "fill-outline-color": "#3B82F6"
            }
          });

          map.current.addLayer({
            id: "geofence-outline-layer",
            type: "line",
            source: "geofence-source",
            layout: {},
            paint: {
              "line-color": "#3B82F6",
              "line-width": 1.5,
              "line-dasharray": [3, 3]
            }
          });
        } catch (err) {
          console.error("Error drawing geofence", err);
        }
      }

      if (showCoverage) {
        const hq = simulator.getStations()[0];
        if (hq) {
          try {
            const points = 64;
            const coords = [];
            const kmRad = hq.radius / 1000;
            const latConv = kmRad / 110.574;
            const lngConv = kmRad / (111.320 * Math.cos(hq.lat * Math.PI / 180));

            for (let i = 0; i < points; i++) {
              const theta = (i / points) * (2 * Math.PI);
              const x = Math.cos(theta) * lngConv;
              const y = Math.sin(theta) * latConv;
              coords.push([hq.lng + x, hq.lat + y]);
            }
            coords.push(coords[0]);

            map.current.addSource("coverage-source", {
              type: "geojson",
              data: {
                type: "Feature",
                properties: {},
                geometry: {
                  type: "Polygon",
                  coordinates: [coords]
                }
              }
            });

            map.current.addLayer({
              id: "coverage-layer",
              type: "fill",
              source: "coverage-source",
              layout: {},
              paint: {
                "fill-color": "#4B6BFB",
                "fill-opacity": 0.05,
                "fill-outline-color": "#4B6BFB"
              }
            });
          } catch (err) {
            console.error("Error drawing coverage", err);
          }
        }
      }
    };

    if (!map.current.isStyleLoaded()) {
      map.current.once("style.load", drawLayers);
      return () => {
        map.current?.off("style.load", drawLayers);
      };
    }

    drawLayers();
  }, [mapLoaded, showGeofence, showCoverage, mapboxgl, mapStyle]);

  // Update markers
  useEffect(() => {
    if (!mapLoaded || !map.current || !mapboxgl) return;

    const hq = simulator.getStations()[0];
    if (hq && !markers.current["hq"]) {
      const hqEl = document.createElement("div");
      hqEl.className = "flex flex-col items-center cursor-pointer";
      hqEl.innerHTML = `
        <div class="h-10 w-10 rounded-xl bg-[#4B6BFB] border-2 border-white flex items-center justify-center shadow-lg">
          <span class="material-icons text-white text-lg">settings_input_antenna</span>
        </div>
      `;
      markers.current["hq"] = new mapboxgl.Marker({ element: hqEl })
        .setLngLat([hq.lng, hq.lat])
        .addTo(map.current);
    }

    fishermen.forEach((fish) => {
      const colorMap = {
        normal: "#10B981",
        warning: "#F59E0B",
        emergency: "#EF4444",
        offline: "#94A3B8"
      };
      const markerColor = colorMap[fish.status];
      const isSelected = selectedFisher?.id === fish.id;

      if (!markers.current[fish.id]) {
        const el = document.createElement("div");
        el.className = "fisherman-marker";
        el.style.color = markerColor;
        
        el.innerHTML = `
          <div class="marker-pulse"></div>
          <div class="marker-ring"></div>
          <div class="h-9 w-9 rounded-full bg-white border border-slate-200 flex items-center justify-center overflow-hidden relative shadow-md">
            <img src="${fish.avatar}" alt="" class="h-full w-full object-cover" />
            <div class="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-white border border-slate-200 flex items-center justify-center">
              <span class="material-icons text-foreground" style="font-size: 8px;">directions_boat</span>
            </div>
          </div>
        `;

        el.addEventListener("click", () => {
          setSelectedFisher(fish);
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
      if (key !== "hq" && !fishermen.some(f => f.id === key)) {
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
        zoom: 13.5,
        duration: 1000
      });
    }
  };

  const filteredFishermen = fishermen.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || f.assignedVestId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = 
      activeTab === "all" ? true :
      activeTab === "active" ? f.status !== "offline" :
      f.status === "emergency" || f.status === "warning";
    return matchesSearch && matchesTab;
  });

  const manualSOS = (fishId: string) => {
    simulator.triggerSOS(fishId);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row gap-5 h-[calc(100vh-112px)] overflow-hidden relative">
      
      {/* Sidebar */}
      <div className="w-full md:w-80 flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden shrink-0 h-full" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
            <input
              type="text"
              placeholder="Cari rompi atau nelayan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-foreground text-sm placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all"
            />
          </div>
        </div>

        <div className="border-b border-slate-100 px-4 py-2 bg-white flex justify-center">
          <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as any)} className="w-full">
            <TabsList className="bg-slate-100 p-1 rounded-xl flex gap-1 w-full justify-between">
              <TabsTrigger value="all" className="flex-1 px-3 py-1.5 rounded-lg text-xs font-medium text-center data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm">Semua</TabsTrigger>
              <TabsTrigger value="active" className="flex-1 px-3 py-1.5 rounded-lg text-xs font-medium text-center data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm">Aktif</TabsTrigger>
              <TabsTrigger value="emergency" className="flex-1 px-3 py-1.5 rounded-lg text-xs font-medium text-center data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm">Peringatan</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex-1 overflow-y-auto bg-white">
          {filteredFishermen.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">Tidak ada pemancar aktif.</div>
          ) : (
            filteredFishermen.map((fish) => (
              <div
                key={fish.id}
                onClick={() => handleFisherClick(fish)}
                className={`p-3.5 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50 transition-all border-b border-slate-50 ${
                  selectedFisher?.id === fish.id ? "bg-blue-50/60" : ""
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative">
                    <img src={fish.avatar} alt="" className="h-9 w-9 rounded-full object-cover border-2 border-white shadow-sm" />
                    <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white ${
                      fish.status === "emergency" ? "bg-red-500" :
                      fish.status === "warning" ? "bg-amber-500" :
                      fish.status === "offline" ? "bg-slate-300" : "bg-emerald-500"
                    }`}></span>
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">{fish.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">Rompi: {fish.assignedVestId}</div>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                    fish.status === "emergency" ? "bg-red-50 text-red-600" :
                    fish.status === "warning" ? "bg-amber-50 text-amber-600" :
                    fish.status === "offline" ? "bg-slate-100 text-slate-500" : "bg-emerald-50 text-emerald-600"
                  }`}>
                    {fish.status === "normal" ? "Aktif" : fish.status === "offline" ? "Mati" : fish.status.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1">{fish.battery}%</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 rounded-2xl overflow-hidden border border-slate-200 relative h-full" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        {!mapLoaded && (
          <div className="absolute inset-0 bg-slate-50 flex items-center justify-center z-50">
            <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
              <span className="material-icons animate-spin text-blue-500 text-xl">sync</span>
            </div>
          </div>
        )}

        <div ref={mapContainer} className="h-full w-full bg-slate-100" />

        {/* Map Controls */}
        <div className="absolute top-4 left-4 z-40 bg-white/95 border border-slate-200 rounded-xl p-3 flex flex-wrap gap-4 text-sm text-foreground font-medium shadow-sm backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-xs font-medium">Peta:</span>
            <select
              value={mapStyle}
              onChange={(e) => setMapStyle(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:border-blue-400 text-foreground text-xs"
            >
              <option value="dark">Gelap</option>
              <option value="light">Terang</option>
              <option value="satellite">Satelit</option>
            </select>
          </div>

          <div className="h-4 w-px bg-slate-200"></div>

          <label className="flex items-center gap-2 cursor-pointer select-none text-xs">
            <input
              type="checkbox"
              checked={showGeofence}
              onChange={(e) => setShowGeofence(e.target.checked)}
              className="accent-blue-500"
            />
            Geofence Peringatan
          </label>

          <div className="h-4 w-px bg-slate-200"></div>

          <label className="flex items-center gap-2 cursor-pointer select-none text-xs">
            <input
              type="checkbox"
              checked={showCoverage}
              onChange={(e) => setShowCoverage(e.target.checked)}
              className="accent-blue-500"
            />
            Cakupan Gateway Stasiun
          </label>
        </div>
      </div>

      {/* Right Drawer */}
      {selectedFisher && (
        <div className="absolute right-0 top-0 bottom-0 z-50 w-full sm:w-96 bg-white border-l border-slate-200 shadow-lg p-6 overflow-y-auto flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-sm font-semibold text-foreground">Profil Pemancar Nelayan</h3>
            <button
              onClick={() => setSelectedFisher(null)}
              className="h-8 w-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center border border-slate-200 transition-colors"
            >
              <span className="material-icons text-sm">close</span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <img src={selectedFisher.avatar} alt="" className="h-14 w-14 rounded-xl object-cover border border-slate-200 shadow-sm" />
            <div>
              <h4 className="text-base font-semibold text-foreground">{selectedFisher.name}</h4>
              <p className="text-xs text-slate-500 mt-1">Umur: {selectedFisher.age} Tahun • Rompi: {selectedFisher.assignedVestId}</p>
              <span className={`inline-block text-[11px] font-medium px-2.5 py-0.5 rounded-full mt-2 ${
                selectedFisher.status === "emergency" ? "bg-red-50 text-red-600 animate-pulse" :
                selectedFisher.status === "warning" ? "bg-amber-50 text-amber-600" :
                selectedFisher.status === "offline" ? "bg-slate-100 text-slate-500" : "bg-emerald-50 text-emerald-600"
              }`}>
                {selectedFisher.status === "normal" ? "AKtif" : selectedFisher.status === "offline" ? "OFFLINE" : selectedFisher.status.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="col-span-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Fisiologi & Keselamatan</div>
            <div>
              <span className="text-[10px] text-slate-500 block">Detak Jantung</span>
              <span className={`font-semibold ${selectedFisher.heartRate > 110 ? "text-red-500 font-bold" : "text-slate-800"}`}>
                {selectedFisher.status === "offline" ? "—" : `${selectedFisher.heartRate} BPM`}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Kadar Oksigen (SpO₂)</span>
              <span className={`font-semibold ${selectedFisher.spo2 < 95 ? "text-red-500 font-bold" : "text-slate-800"}`}>
                {selectedFisher.status === "offline" ? "—" : `${selectedFisher.spo2}%`}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Suhu Tubuh</span>
              <span className={`font-semibold ${selectedFisher.temperature < 35.5 ? "text-blue-500 font-bold" : "text-slate-800"}`}>
                {selectedFisher.status === "offline" ? "—" : `${selectedFisher.temperature} °C`}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Indeks Kelelahan</span>
              <span className={`font-semibold ${
                selectedFisher.fatigue === "High Fatigue" ? "text-red-500" : "text-slate-800"
              }`}>
                {selectedFisher.status === "offline" ? "—" : selectedFisher.fatigue === "High Fatigue" ? "Sangat Lelah" : selectedFisher.fatigue === "Moderate Fatigue" ? "Lelah Sedang" : "Aman / Bugar"}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Risiko Hipotermia</span>
              <span className={`font-semibold ${selectedFisher.hypothermiaRisk === "High Risk" ? "text-red-500" : "text-slate-800"}`}>
                {selectedFisher.status === "offline" ? "—" : selectedFisher.hypothermiaRisk === "High Risk" ? "Risiko Tinggi" : selectedFisher.hypothermiaRisk === "Low Risk" ? "Risiko Rendah" : "Aman"}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Sensor Air</span>
              <span className={`font-semibold ${selectedFisher.waterDetected ? "text-blue-500 font-bold" : "text-slate-500"}`}>
                {selectedFisher.status === "offline" ? "—" : selectedFisher.waterDetected ? "BASAH (Terendam)" : "KERING"}
              </span>
            </div>

            <div className="col-span-2 border-t border-slate-200 my-1 pt-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Kondisi Lingkungan (BME280)</div>
            <div>
              <span className="text-[10px] text-slate-500 block">Suhu Udara</span>
              <span className="font-semibold text-slate-700">{selectedFisher.status === "offline" ? "—" : `${selectedFisher.ambientTemp}°C`}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Kelembapan / Tekanan</span>
              <span className="font-semibold text-slate-700">{selectedFisher.status === "offline" ? "—" : `${selectedFisher.ambientHumidity}% / ${selectedFisher.ambientPressure} hPa`}</span>
            </div>

            <div className="col-span-2 border-t border-slate-200 my-1 pt-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Daya & Telemetri Perjalanan</div>
            <div>
              <span className="text-[10px] text-slate-500 block">Baterai (Fuel)</span>
              <span className="font-semibold text-slate-800">{selectedFisher.status === "offline" ? "—" : `${selectedFisher.battery}% (~${selectedFisher.batteryRuntime} Jam)`}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Durasi / Jarak</span>
              <span className="font-semibold text-slate-800">{selectedFisher.status === "offline" ? "—" : `${Math.floor(selectedFisher.tripDuration / 60)}j ${selectedFisher.tripDuration % 60}m / ${selectedFisher.tripDistance} km`}</span>
            </div>
          </div>

          <div className="space-y-3 bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs">
            <div>
              <span className="text-xs text-slate-500 block">Kontak Darurat</span>
              <span className="text-foreground font-medium block mt-1">{selectedFisher.emergencyContact}</span>
            </div>
          </div>

          {selectedFisher.status !== "offline" && selectedFisher.status !== "emergency" && (
            <button
              onClick={() => manualSOS(selectedFisher.id)}
              className="py-3 px-4 rounded-xl bg-red-500 hover:bg-red-600 text-sm font-semibold text-white transition-all shadow-lg shadow-red-500/15 flex items-center justify-center gap-2 mt-auto cursor-pointer"
            >
              <span className="material-icons text-sm">emergency</span>
              Uji Coba Pemicu SOS Manual
            </button>
          )}
        </div>
      )}
    </div>
  );
}
