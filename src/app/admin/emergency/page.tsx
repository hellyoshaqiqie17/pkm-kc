"use client";

import { useEffect, useState } from "react";
import { simulator, EmergencyAlert } from "@/lib/mockData";
import Link from "next/link";

export default function EmergencyPage() {
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "resolved">("active");

  useEffect(() => {
    const syncAlerts = () => {
      setAlerts(simulator.getAlerts());
    };
    syncAlerts();
    return simulator.subscribe(syncAlerts);
  }, []);

  const handleResolve = (id: string) => {
    simulator.resolveAlert(id);
  };

  const handleDispatch = (id: string) => {
    simulator.dispatchAlert(id);
  };

  const filteredAlerts = alerts.filter((a) => {
    if (filter === "all") return true;
    if (filter === "active") return a.status === "active" || a.status === "dispatched";
    return a.status === "resolved";
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Papan Kasus Darurat</h1>
          <p className="text-sm text-slate-500 mt-1">Insiden keselamatan nelayan aktif dan antrean penyelamatan armada</p>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex bg-white border border-slate-200 rounded-xl p-1 text-sm font-medium" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          {[
            { id: "active", label: "Aktif" },
            { id: "resolved", label: "Selesai" },
            { id: "all", label: "Semua" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === tab.id
                  ? "bg-red-500 text-white shadow-sm"
                  : "text-slate-500 hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Queue Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAlerts.length === 0 ? (
          <div className="col-span-full bg-white border border-slate-200 rounded-2xl p-12 text-center" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div className="h-16 w-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
              <span className="material-icons text-emerald-500 text-3xl">verified_user</span>
            </div>
            <h3 className="text-base font-semibold text-foreground">Kondisi Aman</h3>
            <p className="text-slate-500 text-sm mt-1.5 max-w-sm mx-auto">Saat ini tidak ada insiden keselamatan darurat nelayan yang membutuhkan penanganan.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isHigh = alert.priority === "high";
            const isResolved = alert.status === "resolved";
            const isDispatched = alert.status === "dispatched";

            return (
              <div
                key={alert.id}
                className={`bg-white rounded-2xl p-5 border flex flex-col justify-between gap-4 relative overflow-hidden ${
                  isResolved ? "border-slate-200" :
                  isHigh ? "border-red-200" : "border-amber-200"
                }`}
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
              >
                {/* Warning strip */}
                {!isResolved && (
                  <div className={`absolute top-0 inset-x-0 h-1 ${isHigh ? "bg-red-500" : "bg-amber-500"}`}></div>
                )}

                {/* Card Header */}
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <span className="text-xs text-slate-400 font-mono">ID: {alert.id}</span>
                    <h3 className="text-base font-semibold text-foreground mt-1 truncate">{alert.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{alert.boatName} • Rompi {alert.vestId}</p>
                  </div>
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                    isResolved ? "bg-slate-100 text-slate-500" :
                    isDispatched ? "bg-blue-50 text-blue-600" : "bg-red-50 text-red-600"
                  }`}>
                    {alert.status === "active" ? "AKTIF" : alert.status === "dispatched" ? "DIKIRIM" : "SELESAI"}
                  </span>
                </div>

                {/* Info block */}
                <div className="space-y-2 bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Jenis Bahaya</span>
                    <span className={`font-semibold ${isResolved ? "text-slate-500" : "text-red-500"}`}>{alert.alertType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Prioritas Risiko</span>
                    <span className={`font-semibold ${alert.priority === "high" ? "text-red-500" : "text-amber-500"}`}>
                      {alert.priority === "high" ? "TINGGI" : "SEDANG"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Koordinat Lokasi</span>
                    <span className="text-foreground font-mono text-xs">{alert.lat.toFixed(4)}, {alert.lng.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Waktu Kejadian</span>
                    <span className="text-foreground">{new Date(alert.time).toLocaleTimeString("en-GB")}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 text-xs">
                  <Link
                    href="/admin/map"
                    className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 font-semibold text-center text-foreground transition-all flex items-center justify-center gap-1.5"
                  >
                    <span className="material-icons text-base">explore</span>
                    Peta
                  </Link>

                  {!isResolved && !isDispatched && (
                    <button
                      onClick={() => handleDispatch(alert.id)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-blue-500 hover:bg-blue-600 font-semibold text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-icons text-base">sailing</span>
                      Kirim Kapal
                    </button>
                  )}

                  {!isResolved && (
                    <button
                      onClick={() => handleResolve(alert.id)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 font-semibold text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-icons text-base">check_circle</span>
                      Selesaikan
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
