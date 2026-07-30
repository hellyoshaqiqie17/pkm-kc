"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { simulator } from "@/lib/mockData";

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export default function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [activeAlertCount, setActiveAlertCount] = useState(0);

  useEffect(() => {
    // Subscribe to simulator updates to keep the alert count badge updated
    const updateAlerts = () => {
      const activeAlerts = simulator.getAlerts().filter(a => a.status === "active");
      setActiveAlertCount(activeAlerts.length);
    };

    updateAlerts();
    return simulator.subscribe(updateAlerts);
  }, []);

  const isActive = (path: string) => {
    return pathname === path ? "active" : "";
  };

  const handleLogout = () => {
    sessionStorage.removeItem("wearocean-auth");
    router.push("/admin/login");
  };

  return (
    <aside className={`admin-sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* Logo Header */}
      <div className="admin-sidebar-header">
        <div className="admin-logo">
          <div className="logo-icon">
            <span className="material-icons">sailing</span>
          </div>
          <div className="logo-text">
            <span className="logo-name">WearOcean</span>
            <span className="logo-sub">Monitoring System</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="admin-nav-section">
        <div className="nav-group-label">Menu Utama</div>
        <Link href="/admin/dashboard" className={`admin-nav-item ${isActive("/admin/dashboard")}`}>
          <span className="material-icons">grid_view</span>
          Dasbor
        </Link>
        <Link href="/admin/map" className={`admin-nav-item ${isActive("/admin/map")}`}>
          <span className="material-icons">map</span>
          Peta Live
        </Link>
        <Link href="/admin/emergency" className={`admin-nav-item ${isActive("/admin/emergency")}`}>
          <span className="material-icons">emergency</span>
          Darurat SOS
          {activeAlertCount > 0 && (
            <span className="nav-badge danger">
              {activeAlertCount}
            </span>
          )}
        </Link>
        <Link href="/admin/attendance" className={`admin-nav-item ${isActive("/admin/attendance")}`}>
          <span className="material-icons">event_available</span>
          Kehadiran
        </Link>

        <div className="nav-group-label">Manajemen</div>
        <Link href="/admin/fishermen" className={`admin-nav-item ${isActive("/admin/fishermen")}`}>
          <span className="material-icons">group</span>
          Daftar Nelayan
        </Link>
        <Link href="/admin/fleet" className={`admin-nav-item ${isActive("/admin/fleet")}`}>
          <span className="material-icons">directions_boat</span>
          Armada Kapal
        </Link>
        <Link href="/admin/vests" className={`admin-nav-item ${isActive("/admin/vests")}`}>
          <span className="material-icons">watch</span>
          Unit Rompi
        </Link>

        <div className="nav-group-label">Analitik & AI</div>
        <Link href="/admin/ai-assistant" className={`admin-nav-item ${isActive("/admin/ai-assistant")}`}>
          <span className="material-icons">smart_toy</span>
          Asisten AI
        </Link>
        <Link href="/admin/intelligence" className={`admin-nav-item ${isActive("/admin/intelligence")}`}>
          <span className="material-icons">memory</span>
          Inteligensi Node
        </Link>
        <Link href="/admin/history" className={`admin-nav-item ${isActive("/admin/history")}`}>
          <span className="material-icons">history</span>
          Pemutaran Rute
        </Link>
        <Link href="/admin/analytics" className={`admin-nav-item ${isActive("/admin/analytics")}`}>
          <span className="material-icons">insights</span>
          Grafik Laporan
        </Link>
        <Link href="/admin/settings" className={`admin-nav-item ${isActive("/admin/settings")}`}>
          <span className="material-icons">settings</span>
          Pengaturan
        </Link>
      </nav>

      {/* Footer */}
      <div className="admin-sidebar-footer">
        <Link href="/" className="back-to-site">
          <span className="material-icons">arrow_back</span>
          Kembali ke Beranda
        </Link>
      </div>

      <style jsx global>{`
        .admin-sidebar {
          width: 260px;
          height: 100vh;
          background: #ffffff;
          border-right: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
          position: fixed;
          left: 0;
          top: 0;
          overflow-y: auto;
          z-index: 100;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .admin-sidebar.collapsed {
          transform: translateX(-100%);
        }

        /* Logo */
        .admin-sidebar-header {
          padding: 20px 20px 16px;
          border-bottom: 1px solid var(--color-border);
        }

        .admin-logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: var(--color-accent);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-icon .material-icons {
          color: white;
          font-size: 20px;
        }

        .logo-text {
          display: flex;
          flex-direction: column;
        }

        .logo-name {
          font-size: 15px;
          font-weight: 700;
          color: var(--color-foreground);
          letter-spacing: -0.2px;
          line-height: 1.2;
        }

        .logo-sub {
          font-size: 11px;
          color: var(--color-muted);
          font-weight: 500;
        }

        /* Navigation */
        .admin-nav-section {
          flex: 1;
          padding: 8px 12px;
          overflow-y: auto;
        }

        .nav-group-label {
          font-size: 11px;
          font-weight: 600;
          color: var(--color-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 16px 12px 6px;
        }

        .nav-group-label:first-child {
          padding-top: 8px;
        }

        .admin-nav-item {
          display: flex !important;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          border-radius: 10px;
          color: #475569;
          text-decoration: none;
          font-size: 13.5px;
          font-weight: 500;
          transition: all 0.15s ease;
          margin-bottom: 2px;
          width: 100%;
          box-sizing: border-box;
          position: relative;
        }

        .admin-nav-item:hover {
          background: var(--color-shell);
          color: var(--color-foreground);
        }

        .admin-nav-item.active {
          background: var(--color-accent-light);
          color: var(--color-accent);
          font-weight: 600;
        }

        .admin-nav-item.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 20px;
          background: var(--color-accent);
          border-radius: 0 4px 4px 0;
        }

        .admin-nav-item .material-icons {
          font-size: 20px;
          color: #94A3B8;
          transition: color 0.15s;
        }

        .admin-nav-item:hover .material-icons {
          color: #64748B;
        }

        .admin-nav-item.active .material-icons {
          color: var(--color-accent);
        }

        .nav-badge {
          margin-left: auto;
          min-width: 20px;
          height: 20px;
          padding: 0 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 99px;
          font-size: 11px;
          font-weight: 700;
        }

        .nav-badge.danger {
          background: #FEE2E2;
          color: #DC2626;
        }

        /* Footer */
        .admin-sidebar-footer {
          padding: 16px 16px 20px;
          border-top: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .admin-logout-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 10px;
          color: #64748B;
          font-size: 13.5px;
          font-weight: 500;
          transition: all 0.2s ease;
          cursor: pointer;
          border: 1px solid var(--color-border);
          background: white;
          width: 100%;
          font-family: var(--font-sans);
        }

        .admin-logout-btn:hover {
          background: #FEF2F2;
          color: #DC2626;
          border-color: #FECACA;
        }

        .admin-logout-btn .material-icons {
          font-size: 18px;
        }

        .back-to-site {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 10px;
          color: var(--color-muted);
          font-size: 12px;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.15s;
          justify-content: center;
        }

        .back-to-site:hover {
          background: var(--color-shell);
          color: var(--color-foreground);
        }

        .back-to-site .material-icons {
          font-size: 16px;
        }
      `}</style>
    </aside>
  );
}
