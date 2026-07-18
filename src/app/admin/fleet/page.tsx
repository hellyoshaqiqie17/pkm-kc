"use client";

import { useEffect, useState } from "react";
import { simulator, Boat, Fisherman } from "@/lib/mockData";

export default function FleetPage() {
  const [boats, setBoats] = useState<Boat[]>([]);
  const [fishermen, setFishermen] = useState<Fisherman[]>([]);

  useEffect(() => {
    const syncData = () => {
      setBoats(simulator.getBoats());
      setFishermen(simulator.getFishermen());
    };
    syncData();
    return simulator.subscribe(syncData);
  }, []);

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Armada Kapal</h1>
        <p className="text-sm text-slate-500 mt-1">Pemantauan armada kapal dan penugasan kru nelayan</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {boats.map((boat) => {
          const crewDetails = fishermen.filter(f => f.assignedBoatId === boat.id);
          const isDocked = boat.status === "docked";
          const isMaintenance = boat.status === "maintenance";

          return (
            <div
              key={boat.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between gap-5 relative overflow-hidden"
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
            >
              {/* Status bar */}
              <div className={`absolute top-0 inset-x-0 h-1 ${
                isDocked ? "bg-slate-300" :
                isMaintenance ? "bg-amber-400" : "bg-blue-500"
              }`}></div>

              {/* Title */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-mono">ID: {boat.id.toUpperCase()}</span>
                  <h3 className="text-base font-semibold text-foreground mt-0.5">{boat.name}</h3>
                </div>
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                  isDocked ? "bg-slate-100 text-slate-500" :
                  isMaintenance ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
                }`}>
                  {boat.status === "docked" ? "Bersandar" : boat.status === "maintenance" ? "Pemeliharaan" : "Melaut"}
                </span>
              </div>

              {/* Crew */}
              <div>
                <span className="text-xs text-slate-500 block mb-2 font-medium">Kru Kapal ({crewDetails.length})</span>
                <div className="space-y-2">
                  {crewDetails.map((crew) => (
                    <div key={crew.id} className="flex items-center justify-between bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                      <div className="flex items-center gap-2 min-w-0">
                        <img src={crew.avatar} alt="" className="h-7 w-7 rounded-full object-cover border border-slate-200" />
                        <span className="text-sm font-medium text-foreground truncate">{crew.name}</span>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        crew.status === "emergency" ? "bg-red-50 text-red-600 animate-pulse" :
                        crew.status === "warning" ? "bg-amber-50 text-amber-600" :
                        crew.status === "offline" ? "bg-slate-100 text-slate-500" : "bg-emerald-50 text-emerald-600"
                      }`}>
                        {crew.status === "normal" ? "Aktif" : crew.status === "offline" ? "Offline" : crew.status.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Telemetry */}
              <div className="grid grid-cols-2 gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs">
                <div>
                  <span className="text-xs text-slate-400">Lintang (Latitude)</span>
                  <div className="text-foreground font-semibold mt-0.5 font-mono">{boat.lat.toFixed(5)}</div>
                </div>
                <div>
                  <span className="text-xs text-slate-400">Bujur (Longitude)</span>
                  <div className="text-foreground font-semibold mt-0.5 font-mono">{boat.lng.toFixed(5)}</div>
                </div>
                <div>
                  <span className="text-xs text-slate-400">Arah Haluan</span>
                  <div className="text-foreground font-semibold mt-0.5">
                    {isDocked ? "—" : `${crewDetails[0]?.heading || 0}°`}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-slate-400">Kecepatan Kapal</span>
                  <div className="text-foreground font-semibold mt-0.5">
                    {isDocked ? "—" : `${crewDetails[0]?.speed || 0} Knot`}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
