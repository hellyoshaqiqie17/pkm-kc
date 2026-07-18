"use client";

import Sidebar from "@/components/Admin/Sidebar";
import TopBar from "@/components/Admin/TopBar";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Providers from "@/components/Providers";
import LoadingScreen from "@/components/LoadingScreen";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Providers>
      <div className={`admin-layout ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

        <main className="main-content">
          <TopBar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
          <div className="content-wrapper">
            {children}
          </div>
        </main>

        <style jsx global>{`
          body {
            margin: 0;
            padding: 0;
            overflow-x: hidden;
            background: var(--color-canvas);
          }

          .admin-layout {
            display: flex;
            height: 100vh;
            width: 100vw;
            overflow: hidden;
            position: relative;
            background: var(--color-canvas);
          }

          .main-content {
            margin-left: 260px;
            width: calc(100vw - 260px);
            flex: 0 0 calc(100vw - 260px);
            display: flex;
            flex-direction: column;
            min-width: 0;
            min-height: 0;
            overflow: hidden;
            transition: margin-left 0.3s ease, width 0.3s ease, flex-basis 0.3s ease;
          }

          .sidebar-collapsed .main-content {
            margin-left: 0;
            width: 100vw;
            flex-basis: 100vw;
          }

          .content-wrapper {
            padding: 24px;
            flex: 1;
            display: flex;
            flex-direction: column;
            width: 100%;
            max-width: 100%;
            box-sizing: border-box;
            min-height: 0;
            overflow-y: auto;
            overflow-x: hidden;
            background: var(--color-canvas);
          }

          @media (max-width: 1024px) {
            .main-content {
              margin-left: 0;
              width: 100vw;
              flex-basis: 100vw;
            }
          }
        `}</style>
      </div>
    </Providers>
  );
}
