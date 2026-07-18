"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { simulator, EmergencyAlert } from "@/lib/mockData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface TopBarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export default function TopBar({ collapsed = false, onToggle }: TopBarProps) {
  const router = useRouter();
  const [activeSOS, setActiveSOS] = useState<EmergencyAlert | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [connectedCount, setConnectedCount] = useState(0);
  const [shownAlertIds, setShownAlertIds] = useState<string[]>([]);

  useEffect(() => {
    simulator.enableSound(!isMuted);
  }, [isMuted]);

  useEffect(() => {
    const handleUpdate = () => {
      const activeAlerts = simulator.getAlerts();
      const currentActiveSOS = activeAlerts.find(
        (a) => a.status === "active" && 
               (a.alertType === "SOS Button" || a.alertType === "Fall Overboard") &&
               !shownAlertIds.includes(a.id)
      );

      if (currentActiveSOS) {
        setActiveSOS(currentActiveSOS);
      } else {
        setActiveSOS(null);
      }

      const mainStation = simulator.getStations()[0];
      if (mainStation) {
        setConnectedCount(mainStation.connectedDevices);
      }
    };

    handleUpdate();
    return simulator.subscribe(handleUpdate);
  }, [shownAlertIds]);

  const handleAcknowledge = () => {
    if (activeSOS) {
      setShownAlertIds((prev) => [...prev, activeSOS.id]);
      router.push("/admin/emergency");
      setActiveSOS(null);
    }
  };

  const handleClosePopup = () => {
    if (activeSOS) {
      setShownAlertIds((prev) => [...prev, activeSOS.id]);
      setActiveSOS(null);
    }
  };

  return (
    <>
      <header className="admin-topbar">
        {/* Menu Toggle */}
        <button className="topbar-menu-btn" onClick={onToggle} title="Toggle Sidebar">
          <span className="material-icons">menu</span>
        </button>

        {/* System Status */}
        <div className="topbar-status">
          <span className="status-dot"></span>
          <span className="status-text">Sistem Online</span>
          <span className="status-divider"></span>
          <span className="status-text">{connectedCount} Perangkat</span>
        </div>

        {/* Right Section */}
        <div className="topbar-right">
          {/* Mute/Unmute */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`topbar-icon-btn ${isMuted ? "muted" : ""}`}
            title={isMuted ? "Alarm Senyap" : "Senyapkan Alarm"}
          >
            <span className="material-icons">{isMuted ? "volume_off" : "volume_up"}</span>
          </button>

          {/* Notification Bell */}
          <button className="topbar-icon-btn" title="Notifikasi">
            <span className="material-icons">notifications_none</span>
          </button>

          <span className="topbar-divider"></span>

          {/* Profile */}
          <div className="topbar-profile">
            <div className="profile-info">
              <span className="profile-name">Petugas Komando</span>
              <span className="profile-role">Muara Angke</span>
            </div>
            <div className="profile-avatar">
              PK
            </div>
          </div>
        </div>
      </header>

      {/* SOS Dialog */}
      <Dialog open={!!activeSOS} onOpenChange={(open) => { if (!open) setActiveSOS(null); }}>
        <DialogContent className="max-w-lg bg-white border border-red-200 p-6 md:p-8 rounded-2xl text-center text-foreground shadow-xl outline-none" showCloseButton={false}>
          {activeSOS && (
            <>
              <div className="absolute inset-0 border-[4px] border-red-400 animate-pulse pointer-events-none rounded-2xl"></div>

              <div className="mx-auto h-16 w-16 rounded-full bg-red-500 flex items-center justify-center animate-bounce shadow-lg shadow-red-500/20 relative z-10">
                <span className="material-icons text-white text-3xl">emergency_share</span>
              </div>

              <DialogHeader className="relative z-10">
                <DialogTitle className="mt-5 font-sans text-2xl font-bold text-red-600 text-center">
                  Peringatan Darurat SOS
                </DialogTitle>
                <DialogDescription className="mt-1 text-sm text-muted-foreground text-center">
                  Peringatan keselamatan darurat kritis telah terdeteksi!
                </DialogDescription>
              </DialogHeader>

              <div className="mt-5 bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-sm grid grid-cols-2 gap-y-3 relative z-10">
                <div>
                  <span className="text-muted-foreground text-xs">Nelayan</span>
                  <div className="font-semibold text-foreground mt-0.5">{activeSOS.name}</div>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs">Armada Kapal</span>
                  <div className="font-semibold text-foreground mt-0.5">{activeSOS.boatName}</div>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs">Jenis Bahaya</span>
                  <div className="font-semibold text-red-600 mt-0.5">{activeSOS.alertType}</div>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs">ID Rompi</span>
                  <div className="font-semibold text-foreground mt-0.5">{activeSOS.vestId}</div>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground text-xs">Koordinat GPS</span>
                  <div className="text-sm font-mono font-semibold text-blue-600 mt-0.5">
                    {activeSOS.lat.toFixed(6)}, {activeSOS.lng.toFixed(6)}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3 relative z-10">
                <button
                  onClick={handleClosePopup}
                  className="flex-1 py-3 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold hover:bg-slate-100 text-foreground transition-all cursor-pointer"
                >
                  Abaikan Peringatan
                </button>
                <button
                  onClick={handleAcknowledge}
                  className="flex-1 py-3 px-4 rounded-xl bg-red-500 hover:bg-red-600 text-sm font-semibold text-white transition-all shadow-lg shadow-red-500/15 cursor-pointer"
                >
                  Buka Pusat Darurat
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        .admin-topbar {
          height: 56px;
          background: #ffffff;
          border-bottom: 1px solid var(--color-border);
          display: flex;
          align-items: center;
          padding: 0 20px;
          position: sticky;
          top: 0;
          z-index: 90;
        }

        .topbar-menu-btn {
          color: #64748B;
          background: none;
          border: none;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s;
          border-radius: 8px;
        }

        .topbar-menu-btn:hover {
          background: var(--color-shell);
          color: var(--color-foreground);
        }

        .topbar-menu-btn .material-icons {
          font-size: 22px;
        }

        .topbar-status {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-left: 16px;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10B981;
          animation: pulse-dot 2s ease-in-out infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .status-text {
          font-size: 13px;
          color: #64748B;
          font-weight: 500;
        }

        .status-divider {
          width: 1px;
          height: 16px;
          background: var(--color-border);
        }

        .topbar-right {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .topbar-icon-btn {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          border: 1px solid var(--color-border);
          background: white;
          color: #64748B;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s;
        }

        .topbar-icon-btn:hover {
          background: var(--color-shell);
          color: var(--color-foreground);
        }

        .topbar-icon-btn.muted {
          background: #FEF2F2;
          border-color: #FECACA;
          color: #EF4444;
        }

        .topbar-icon-btn .material-icons {
          font-size: 18px;
        }

        .topbar-divider {
          width: 1px;
          height: 28px;
          background: var(--color-border);
          margin: 0 8px;
        }

        .topbar-profile {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          padding: 4px 4px 4px 12px;
          border-radius: 12px;
          transition: background 0.15s;
        }

        .topbar-profile:hover {
          background: var(--color-shell);
        }

        .profile-info {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .profile-name {
          font-size: 13px;
          font-weight: 600;
          color: var(--color-foreground);
          line-height: 1.2;
        }

        .profile-role {
          font-size: 11px;
          color: var(--color-muted);
          font-weight: 500;
        }

        .profile-avatar {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: var(--color-accent);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: white;
          font-size: 13px;
        }

        @media (max-width: 640px) {
          .topbar-status,
          .profile-info {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
