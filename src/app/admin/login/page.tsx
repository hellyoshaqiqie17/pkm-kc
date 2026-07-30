"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("command123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    setTimeout(() => {
      if (username === "admin" && password === "command123") {
        sessionStorage.setItem("wearocean-auth", "true");
        router.push("/admin/dashboard");
      } else {
        setError("Kredensial Pusat Komando Salah.");
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 relative overflow-hidden font-sans">
      {/* Background Dotted Grid */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-[0.08] dark:opacity-[0.14] z-0" />

      {/* Floating Animated Gradient Blobs */}
      <div className="absolute top-[10%] left-[-10%] w-[30rem] h-[30rem] bg-blue-500/10 rounded-full blur-[90px] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] right-[-10%] w-[30rem] h-[30rem] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 relative z-10 shadow-lg" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div className="text-center mb-8">
          <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center mx-auto shadow-lg shadow-blue-500/10 mb-4">
            <span className="material-icons text-white text-2xl">settings_input_antenna</span>
          </div>
          <h1 className="font-sans text-xl font-bold text-slate-800 tracking-wider uppercase">Pusat Komando WearOcean</h1>
          <p className="text-[11px] text-slate-400 font-semibold tracking-wider mt-1.5 uppercase">Portal Telemetri Keselamatan Nelayan</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-center gap-2">
            <span className="material-icons text-sm">error</span>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">ID Operator</label>
            <div className="relative">
              <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">person</span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#4B6BFB] focus:outline-none text-slate-800 text-xs font-mono font-medium"
                placeholder="Masukkan username operator"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Kata Sandi</label>
            <div className="relative">
              <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">lock</span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#4B6BFB] focus:outline-none text-slate-800 text-xs font-mono font-medium"
                placeholder="Masukkan password konsol"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#4B6BFB] hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span className="material-icons text-sm animate-spin">sync</span>
              ) : (
                <span className="material-icons text-sm">login</span>
              )}
              {loading ? "Memverifikasi Kredensial..." : "Masuk & Akses Konsol"}
            </button>
          </div>
        </form>
        
        <div className="mt-8 text-center text-[9px] text-slate-400 font-mono tracking-wider border-t border-slate-100 pt-4">
          KHUSUS OPERATOR RESMI • KOMUNIKASI LORA JALUR 1
        </div>
      </div>
    </div>
  );
}
