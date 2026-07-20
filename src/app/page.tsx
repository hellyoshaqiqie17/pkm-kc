"use client";

import Link from "next/link";
import { useState } from "react";

export default function LandingPage() {
  const [hoveredComponent, setHoveredComponent] = useState<string | null>(null);

  const allHardware = [
    // Vest Components
    { id: "esp32s3", name: "ESP32 DevKit V1 (ESP32-WROOM-32)", desc: "Pengendali utama berbasis Wi-Fi & Bluetooth yang mengelola pembacaan sensor dan penjadwalan telemetri.", price: "$7.10", priceIdr: "Rp 110.000" },
    { id: "lora", name: "Modul LoRa SX1262 (Rompi)", desc: "Modul komunikasi radio nirkabel jarak jauh berdaya rendah untuk mengirim paket data ke base station pantai.", price: "$7.70", priceIdr: "Rp 120.000" },
    { id: "gps", name: "Modul GPS u-blox NEO-M8N", desc: "Modul navigasi satelit untuk melacak koordinat lintang, bujur, dan kecepatan nelayan melaut secara presisi.", price: "$11.30", priceIdr: "Rp 175.000" },
    { id: "imu", name: "MPU6050 Akselerometer + Giroskop", desc: "Sensor gerak 6-axis yang mengukur kemiringan dan percepatan tubuh nelayan untuk deteksi jatuh dan diam tanpa gerak.", price: "$1.60", priceIdr: "Rp 25.000" },
    { id: "max30102", name: "Sensor Detak Jantung & SpO₂ MAX30102", desc: "Sensor optik untuk mendeteksi denyut jantung dan persentase kejenuhan oksigen (SpO₂) dalam darah.", price: "$2.90", priceIdr: "Rp 45.000" },
    { id: "max30205", name: "Sensor Suhu Air/Tubuh DS18B20 (Waterproof)", desc: "Sensor suhu digital kedap air untuk memantau suhu tubuh nelayan dan suhu air laut sekitar.", price: "$1.30", priceIdr: "Rp 20.000" },
    { id: "bme280", name: "Sensor Cuaca & Lingkungan BME280", desc: "Mengukur parameter cuaca lokal termasuk suhu udara sekitar, kelembapan, dan tekanan udara (hPa).", price: "$4.80", priceIdr: "Rp 75.000" },
    { id: "water", name: "Sensor Deteksi Air Laut", desc: "Sensor konduktivitas dengan probe terbuka untuk mendeteksi jika nelayan jatuh terendam ke dalam air laut.", price: "$1.00", priceIdr: "Rp 15.000" },
    { id: "fuel", name: "Sirkuit Monitoring Baterai (Voltage Divider)", desc: "Sirkuit pembagi tegangan analog-ke-digital untuk memantau kapasitas tegangan baterai rompi.", price: "$0.60", priceIdr: "Rp 10.000" },
    { id: "battery", name: "Baterai 18650 + Holder + BMS + Charger USB-C", desc: "Sistem catu daya mandiri rompi lengkap dengan proteksi arus (BMS) dan port pengisian daya.", price: "$7.70", priceIdr: "Rp 120.000" },
    { id: "ui", name: "Tombol SOS + LED RGB + Buzzer Peringatan", desc: "Tombol darurat fisik nelayan, indikator status RGB, dan buzzer alarm suara lokal.", price: "$1.60", priceIdr: "Rp 25.000" },
    { id: "enc", name: "Casing Waterproof IP67 & Antena (LoRa + GPS)", desc: "Casing pelindung kedap air yang mengapung beserta antena cambuk untuk memaksimalkan pancaran RF.", price: "$14.90", priceIdr: "Rp 230.000" },

    // Base Station Components
    { id: "bs_esp32", name: "ESP32 DevKit V1 (ESP32-WROOM-32) (Gateway)", desc: "Pusat pengendali base station yang menerima paket radio dan meneruskannya ke backend backend via Ethernet.", price: "$7.10", priceIdr: "Rp 110.000" },
    { id: "bs_lora", name: "Modul LoRa SX1262 (Base Station)", desc: "Penerima radio stasiun pangkalan pantai yang terus mendengarkan siaran data telemetri dari rompi nelayan.", price: "$7.70", priceIdr: "Rp 120.000" },
    { id: "bs_ant", name: "Antena LoRa Outdoor (5–8 dBi)", desc: "Antena tiang luar ruangan dengan penguatan sinyal tinggi untuk menangkap transmisi LoRa hingga 25 km.", price: "$16.10", priceIdr: "Rp 250.000" },
    { id: "bs_wifi", name: "Modul Ethernet W5500 & Wi-Fi", desc: "Modul komunikasi jaringan kabel LAN berbasis W5500 untuk pengiriman data andal ke server komando.", price: "$4.80", priceIdr: "Rp 75.000" },
    { id: "bs_power", name: "Adaptor 12V + Converter Buck LM2596", desc: "Catu daya 12V DC beserta modul regulator step-down penurun tegangan menjadi 5V/3.3V yang stabil.", price: "$2.10", priceIdr: "Rp 32.000" },
    { id: "bs_box", name: "Casing IP66 Waterproof & LED Indikator Status", desc: "Kotak panel luar ruangan tahan cuaca dengan 3 unit LED indikator penanda status online stasiun.", price: "$8.30", priceIdr: "Rp 129.000" },

    // Software & API Components
    { id: "sw_chatgpt", name: "Langganan OpenAI ChatGPT API", desc: "API Key untuk asisten diagnosa AI, memproses parameter kesehatan sensor, deteksi tingkat kelelahan, dan anomali secara cerdas.", price: "$5.00", priceIdr: "Rp 78.000" }
  ];

  const activeHardware = allHardware.find(h => h.id === hoveredComponent);

  return (
    <div className="relative min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans theme-transition overflow-hidden text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      
      {/* Background Dotted Grid */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-20 z-0" />

      {/* Floating Animated Gradient Blobs */}
      <div className="absolute top-[5%] left-[-15%] w-[40rem] h-[40rem] bg-blue-400/10 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute top-[35%] right-[-15%] w-[45rem] h-[45rem] bg-emerald-400/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[5%] left-[10%] w-[35rem] h-[35rem] bg-indigo-400/15 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* Main Glass Content Card */}
      <div className="relative z-10 max-w-[1300px] mx-auto bg-white rounded-3xl p-6 sm:p-10 md:p-14 lg:p-16 shadow-xl border border-slate-200 theme-transition space-y-16">
        
        {/* Navigation Bar */}
        <nav className="flex items-center justify-between pb-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-50 border border-slate-200 overflow-hidden flex items-center justify-center shadow-sm">
              <span className="material-icons text-[#4B6BFB] text-lg">sailing</span>
            </div>
            <span className="font-sans text-base font-bold tracking-tight text-slate-800 uppercase">PKM KC GG GAMING</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
            <Link href="/background" className="text-[#4B6BFB] font-semibold hover:text-blue-700 transition-colors">
              Latar Belakang
            </Link>
            <a href="#features" className="hover:text-slate-800 transition-colors">Fitur Utama</a>
            <a href="#schematics" className="hover:text-slate-800 transition-colors">Skema Perangkat</a>
            <a href="#pricing" className="hover:text-slate-800 transition-colors">Rincian Harga</a>
            <a href="#architecture" className="hover:text-slate-800 transition-colors">Alur Sistem</a>
          </div>

          <Link href="/admin/dashboard" className="px-5 py-2.5 rounded-xl bg-[#4B6BFB] text-white hover:bg-blue-600 text-sm font-semibold transition-all shadow-md shadow-blue-500/10">
            Login Admin
          </Link>
        </nav>

        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
          
          {/* Left Column */}
          <div className="flex flex-col gap-y-8">
            <div className="space-y-4">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full w-fit">Vest Keselamatan Nelayan</span>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Rompi Keselamatan Pintar Generasi Baru untuk Nelayan Maritim
              </h1>
              <p className="text-base text-slate-600 leading-relaxed max-w-xl">
                Rangkaian diagnosis biometrik berkelanjutan, deteksi hipotermia, dan model deteksi jatuh. Terhubung secara aman melalui gelombang radio <strong className="text-blue-600 font-semibold">LoRa</strong> langsung ke stasiun pangkalan pantai tanpa ketergantungan jaringan seluler.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-white bg-[#4B6BFB] hover:bg-blue-600 px-6 py-3.5 rounded-xl font-semibold shadow-lg shadow-blue-500/15 transition-all">
                <span className="material-icons text-base">space_dashboard</span>
                <span>Masuk ke Admin panel</span>
              </Link>
              <a href="#schematics" className="inline-flex items-center gap-2 text-slate-700 bg-slate-100 hover:bg-slate-200 px-6 py-3.5 rounded-xl font-semibold transition-all">
                <span className="material-icons text-base">developer_board</span>
                <span>Skema hardware</span>
              </a>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 bg-slate-50">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                <span>Biometrik Real-Time</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 bg-slate-50">
                <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                <span>Telemetri LoRa 25 km</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 bg-slate-50">
                <span className="h-2 w-2 rounded-full bg-indigo-500"></span>
                <span>Asisten Keselamatan AI</span>
              </div>
            </div>
          </div>

          {/* Right Column - Live Admin Dashboard Visualizations */}
          <div className="grid grid-cols-2 gap-4 h-full text-left font-sans">
            {/* Card 1: Detail Panel Telemetri Nelayan (col-span-2) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 col-span-2 flex flex-col justify-between shadow-sm min-h-[220px]" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                <h3 className="text-xs font-bold text-slate-800 tracking-tight">Detail Telemetri Nelayan</h3>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-bold">vest-101</span>
              </div>

              {/* Profile info */}
              <div className="flex items-center gap-3 my-2.5">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sutarno" alt="" className="h-9 w-9 rounded-xl object-cover border border-slate-200 bg-slate-50" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 truncate">Sutarno Wijaya</h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[9px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider animate-pulse">EMERGENCY</span>
                    <span className="text-[9px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5">
                      <span className="material-icons text-[9px]">psychology</span> AI: Risiko Tinggi
                    </span>
                  </div>
                </div>
              </div>

              {/* Physiological status grid */}
              <div className="grid grid-cols-3 gap-2 text-[10px] bg-slate-50 border border-slate-200/60 rounded-xl p-3">
                <div>
                  <span className="text-slate-400 block text-[9px]">Detak Jantung</span>
                  <span className="font-bold text-red-500">128 BPM</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px]">Saturasi SpO₂</span>
                  <span className="font-bold text-red-500">91% (Rendah)</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px]">Suhu Tubuh</span>
                  <span className="font-bold text-slate-800">36.5 °C</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px]">Kelelahan</span>
                  <span className="font-bold text-red-500">Sangat Lelah</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px]">Hipotermia</span>
                  <span className="font-bold text-slate-500">Aman</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px]">Deteksi Air</span>
                  <span className="font-bold text-blue-600">TERENDAM</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-3 flex gap-2">
                <button className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg text-[10px] transition-all cursor-pointer shadow-sm">
                  Hubungi Kontak Darurat
                </button>
                <button className="px-3 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold py-2 rounded-lg text-[10px] transition-all cursor-pointer">
                  Abaikan
                </button>
              </div>
            </div>

            {/* Card 2: Parameter Lingkungan BME280 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4.5 flex flex-col justify-between shadow-sm min-h-[190px]" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-[10px] font-bold text-slate-800 tracking-tight">Kondisi Cuaca (BME280)</span>
                <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-mono font-semibold">SINE-BASE</span>
              </div>

              <div className="my-2.5 space-y-2 text-[10px]">
                <div className="flex justify-between items-center border-b border-slate-100 pb-1">
                  <span className="text-slate-400">Suhu Sekitar</span>
                  <span className="font-bold text-slate-800">29.2 °C</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-1">
                  <span className="text-slate-400">Kelembaban Udara</span>
                  <span className="font-bold text-slate-800">76%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Tekanan Atmosfer</span>
                  <span className="font-bold text-slate-800">1011 hPa</span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200/50 rounded-lg p-2 text-[9px] text-slate-500 font-medium leading-relaxed">
                Kondisi sekitar perairan Sine terpantau berawan dengan hembusan angin laut normal.
              </div>
            </div>

            {/* Card 3: Asisten AI: Rekomendasi Keselamatan */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4.5 flex flex-col justify-between shadow-sm min-h-[190px]" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-[10px] font-bold text-slate-800 tracking-tight flex items-center gap-1">
                  <span className="material-icons text-indigo-500 text-xs">psychology</span> Asisten Diagnosa AI
                </span>
                <span className="text-[9px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded font-mono font-semibold">COPILOT-AI</span>
              </div>

              <div className="my-2 z-10 text-[10px]">
                <div className="font-bold text-slate-800 leading-tight">Analisis Risiko Hipotermia</div>
                <div className="text-slate-400 text-[9px] mt-0.5">Nelayan: Budi Santoso (vest-103)</div>
                <p className="text-slate-500 mt-1.5 leading-relaxed text-[9px]">
                  Suhu badan rendah (<span className="font-bold text-amber-600">35.5°C</span>) dan air terdeteksi pada rompi.
                </p>
              </div>

              <div className="bg-indigo-50 border border-indigo-100/50 rounded-lg p-2 text-[9px] text-indigo-700 font-medium">
                Peringatan suara "Harap gunakan mantel hangat" dikirim ke unit rompi.
              </div>

              <button className="mt-2 w-full bg-[#4B6BFB] hover:bg-[#3B5BEB] text-white font-bold py-2 rounded-lg text-[9px] transition-all cursor-pointer shadow-sm">
                Kirim Saran ke Rompi
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-12 border-t border-slate-200">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Fungsional</h2>
            <p className="mt-2 text-sm text-slate-500"> fitur utama.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "monitor_heart", title: "Pemantauan Kesehatan Real-Time", desc: "Memantau detak jantung, SpO₂ (kadar oksigen darah), dan suhu tubuh secara kontinu untuk mendeteksi tanda-tanda stres fisiologis nelayan." },
              { icon: "sentiment_very_dissatisfied", title: "Model Deteksi Kelelahan", desc: "Menggabungkan durasi melaut, sensor gerakan, dan detak jantung untuk mengklasifikasikan tingkat kelelahan nelayan (Aman / Sedang / Tinggi)." },
              { icon: "thermostat", title: "Peringatan Risiko Hipotermia", desc: "Mengkorelasikan pembacaan sensor air dengan penurunan suhu inti tubuh nelayan untuk memberi peringatan dini hipotermia." },
              { icon: "gpp_maybe", title: "Deteksi Jatuh ke Laut Otomatis", desc: "Mendeteksi secara instan pemicu sensor kontak air yang dikombinasikan dengan anomali posisi orientasi tubuh (IMU)." },
              { icon: "accessibility_new", title: "Deteksi Tanpa Gerakan", desc: "Memantau data akselerometer; jika nelayan tidak bergerak dalam jangka waktu tertentu (pingsan/cedera), peringatan darurat langsung dikirim." },
              { icon: "wifi_tethering", title: "Radio LoRa & Geofencing", desc: "Pemantauan kekuatan sinyal RSSI beserta batas zona tangkap aman geofence GPS untuk mendeteksi nelayan yang terbawa arus terlalu jauh." }
            ].map((f, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 text-[#4B6BFB] flex items-center justify-center mb-5">
                  <span className="material-icons text-xl">{f.icon}</span>
                </div>
                <h3 className="text-sm font-semibold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Interactive Schematics */}
        <section id="schematics" className="py-12 border-t border-slate-200">
          <div className="mb-6 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Skema Hardware</h2>
            <p className="mt-2 text-sm text-slate-500">Arahkan kursor ke modul mana saja pada diagram Rompi Keselamatan atau Stasiun Pangkalan Pantai untuk melihat detail spesifikasi dan biaya komponen.</p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
            
            {/* 1. Wearable Vest Diagram */}
            <div className="xl:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col items-center">
              <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-1.5">
                <span className="material-icons text-blue-600 text-lg">watch</span>
                Papan Sirkuit Rompi Keselamatan
              </h3>
              
              <svg width="340" height="360" viewBox="0 0 340 360" className="w-full drop-shadow-sm select-none">
                {/* Vest Outline */}
                <path d="M90 30 C90 15, 140 15, 140 30 L200 30 C200 15, 250 15, 250 30 L290 70 L270 190 L250 320 L90 320 L70 190 L50 70 Z" fill="none" stroke="#E2E8F0" strokeWidth="2" strokeDasharray="3 3" />
                
                {/* Board Box */}
                <rect x="95" y="80" width="150" height="210" rx="12" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2.5" />
                
                {/* Vest CPU (ESP32-S3) */}
                <g 
                  onMouseEnter={() => setHoveredComponent("esp32s3")}
                  onMouseLeave={() => setHoveredComponent(null)}
                  className="cursor-pointer transition-opacity"
                  opacity={hoveredComponent && hoveredComponent !== "esp32s3" ? "0.3" : "1"}
                >
                  <rect x="145" y="150" width="50" height="50" rx="4" fill="#ffffff" stroke="#4B6BFB" strokeWidth="2" />
                  <text x="147" y="178" fill="#4B6BFB" fontSize="7" fontWeight="bold" fontFamily="monospace">ESP32-DEV</text>
                  <circle cx="170" cy="195" r="2.5" fill="#10B981" />
                </g>

                {/* LoRa SX1262 */}
                <g 
                  onMouseEnter={() => setHoveredComponent("lora")}
                  onMouseLeave={() => setHoveredComponent(null)}
                  className="cursor-pointer transition-opacity"
                  opacity={hoveredComponent && hoveredComponent !== "lora" ? "0.3" : "1"}
                >
                  <rect x="105" y="100" width="40" height="35" rx="3" fill="#ffffff" stroke="#4B6BFB" strokeWidth="1.5" />
                  <text x="111" y="121" fill="#1e293b" fontSize="8" fontWeight="bold" fontFamily="monospace">SX1262</text>
                  {/* antenna */}
                  <line x1="125" y1="100" x2="125" y2="55" stroke="#EF4444" strokeWidth="2" strokeDasharray="2 2" />
                  <circle cx="125" cy="55" r="3" fill="#EF4444" />
                </g>

                {/* GPS NEO-M8N */}
                <g 
                  onMouseEnter={() => setHoveredComponent("gps")}
                  onMouseLeave={() => setHoveredComponent(null)}
                  className="cursor-pointer transition-opacity"
                  opacity={hoveredComponent && hoveredComponent !== "gps" ? "0.3" : "1"}
                >
                  <rect x="195" y="100" width="40" height="35" rx="3" fill="#ffffff" stroke="#4B6BFB" strokeWidth="1.5" />
                  <text x="199" y="121" fill="#1e293b" fontSize="8" fontWeight="bold" fontFamily="monospace">NEO-M8N</text>
                </g>

                {/* IMU MPU6050 */}
                <g 
                  onMouseEnter={() => setHoveredComponent("imu")}
                  onMouseLeave={() => setHoveredComponent(null)}
                  className="cursor-pointer transition-opacity"
                  opacity={hoveredComponent && hoveredComponent !== "imu" ? "0.3" : "1"}
                >
                  <rect x="105" y="150" width="30" height="30" rx="3" fill="#ffffff" stroke="#94A3B8" strokeWidth="1.5" />
                  <text x="111" y="168" fill="#64748B" fontSize="8" fontWeight="bold" fontFamily="monospace">MPU</text>
                </g>

                {/* MAX30102 SpO2/HR */}
                <g 
                  onMouseEnter={() => setHoveredComponent("max30102")}
                  onMouseLeave={() => setHoveredComponent(null)}
                  className="cursor-pointer transition-opacity"
                  opacity={hoveredComponent && hoveredComponent !== "max30102" ? "0.3" : "1"}
                >
                  <rect x="205" y="150" width="30" height="30" rx="3" fill="#ffffff" stroke="#EF4444" strokeWidth="1.5" />
                  <text x="208" y="168" fill="#EF4444" fontSize="7" fontWeight="bold" fontFamily="monospace">30102</text>
                </g>

                {/* DS18B20 Temp */}
                <g 
                  onMouseEnter={() => setHoveredComponent("max30205")}
                  onMouseLeave={() => setHoveredComponent(null)}
                  className="cursor-pointer transition-opacity"
                  opacity={hoveredComponent && hoveredComponent !== "max30205" ? "0.3" : "1"}
                >
                  <rect x="105" y="190" width="30" height="25" rx="3" fill="#ffffff" stroke="#94A3B8" strokeWidth="1.5" />
                  <text x="106" y="206" fill="#64748B" fontSize="7" fontWeight="bold" fontFamily="monospace">DS18B2</text>
                </g>

                {/* BME280 Env */}
                <g 
                  onMouseEnter={() => setHoveredComponent("bme280")}
                  onMouseLeave={() => setHoveredComponent(null)}
                  className="cursor-pointer transition-opacity"
                  opacity={hoveredComponent && hoveredComponent !== "bme280" ? "0.3" : "1"}
                >
                  <rect x="205" y="190" width="30" height="25" rx="3" fill="#ffffff" stroke="#94A3B8" strokeWidth="1.5" />
                  <text x="208" y="206" fill="#64748B" fontSize="7" fontWeight="bold" fontFamily="monospace">BME</text>
                </g>

                {/* Battery Divider */}
                <g 
                  onMouseEnter={() => setHoveredComponent("fuel")}
                  onMouseLeave={() => setHoveredComponent(null)}
                  className="cursor-pointer transition-opacity"
                  opacity={hoveredComponent && hoveredComponent !== "fuel" ? "0.3" : "1"}
                >
                  <rect x="145" y="210" width="50" height="20" rx="3" fill="#ffffff" stroke="#10B981" strokeWidth="1.5" />
                  <text x="151" y="223" fill="#10B981" fontSize="7" fontWeight="bold" fontFamily="monospace">V-DIV</text>
                </g>

                {/* LIPO battery pack */}
                <g 
                  onMouseEnter={() => setHoveredComponent("battery")}
                  onMouseLeave={() => setHoveredComponent(null)}
                  className="cursor-pointer transition-opacity"
                  opacity={hoveredComponent && hoveredComponent !== "battery" ? "0.3" : "1"}
                >
                  <rect x="105" y="240" width="130" height="40" rx="6" fill="#ffffff" stroke="#10B981" strokeWidth="2" />
                  <text x="125" y="264" fill="#10B981" fontSize="9" fontWeight="bold" fontFamily="monospace">BATERAI LIPO 18650</text>
                </g>

                {/* Water contact sensor */}
                <g 
                  onMouseEnter={() => setHoveredComponent("water")}
                  onMouseLeave={() => setHoveredComponent(null)}
                  className="cursor-pointer transition-opacity"
                  opacity={hoveredComponent && hoveredComponent !== "water" ? "0.3" : "1"}
                >
                  <rect x="145" y="300" width="50" height="15" rx="2" fill="#ffffff" stroke="#3B82F6" strokeWidth="1.5" />
                  <text x="155" y="311" fill="#3B82F6" fontSize="8" fontWeight="bold" fontFamily="monospace">AIR</text>
                </g>

                {/* SOS Button */}
                <g 
                  onMouseEnter={() => setHoveredComponent("ui")}
                  onMouseLeave={() => setHoveredComponent(null)}
                  className="cursor-pointer transition-opacity"
                  opacity={hoveredComponent && hoveredComponent !== "ui" ? "0.3" : "1"}
                >
                  <circle cx="170" cy="40" r="14" fill="#EF4444" stroke="#FFF" strokeWidth="2.5" />
                  <text x="161" y="44" fill="#FFF" fontSize="8" fontWeight="black" fontFamily="sans-serif">SOS</text>
                  <line x1="170" y1="54" x2="170" y2="80" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="2 2" />
                </g>
              </svg>
            </div>

            {/* 2. Coastal Base Station Diagram */}
            <div className="xl:col-span-4 bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col items-center">
              <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-1.5">
                <span className="material-icons text-blue-600 text-lg">cell_tower</span>
                Gateway Stasiun Pangkalan Pantai
              </h3>

              <svg width="340" height="360" viewBox="0 0 340 360" className="w-full drop-shadow-sm select-none">
                {/* Gateway Box Enclosure */}
                <rect x="75" y="55" width="190" height="260" rx="16" fill="none" stroke="#E2E8F0" strokeWidth="2" strokeDasharray="3 3" />
                
                {/* Main Gateway Board */}
                <rect x="95" y="80" width="150" height="210" rx="12" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2.5" />
                <text x="110" y="102" fill="#94A3B8" fontSize="8" fontWeight="bold" fontFamily="monospace">SMS-GATEWAY-v3.0</text>

                {/* ESP32-S3 gateway CPU */}
                <g 
                  onMouseEnter={() => setHoveredComponent("bs_esp32")}
                  onMouseLeave={() => setHoveredComponent(null)}
                  className="cursor-pointer transition-opacity"
                  opacity={hoveredComponent && hoveredComponent !== "bs_esp32" ? "0.3" : "1"}
                >
                  <rect x="145" y="140" width="50" height="50" rx="4" fill="#ffffff" stroke="#4B6BFB" strokeWidth="2" />
                  <text x="150" y="168" fill="#4B6BFB" fontSize="8" fontWeight="bold" fontFamily="monospace">ESP32-S3</text>
                  <circle cx="170" cy="182" r="2.5" fill="#10B981" />
                </g>

                {/* LoRa SX1262 receiver board */}
                <g 
                  onMouseEnter={() => setHoveredComponent("bs_lora")}
                  onMouseLeave={() => setHoveredComponent(null)}
                  className="cursor-pointer transition-opacity"
                  opacity={hoveredComponent && hoveredComponent !== "bs_lora" ? "0.3" : "1"}
                >
                  <rect x="105" y="120" width="35" height="35" rx="3" fill="#ffffff" stroke="#4B6BFB" strokeWidth="1.5" />
                  <text x="108" y="141" fill="#1e293b" fontSize="7" fontWeight="bold" fontFamily="monospace">SX1262</text>
                </g>

                {/* Wi-Fi / Ethernet W5500 modules */}
                <g 
                  onMouseEnter={() => setHoveredComponent("bs_wifi")}
                  onMouseLeave={() => setHoveredComponent(null)}
                  className="cursor-pointer transition-opacity"
                  opacity={hoveredComponent && hoveredComponent !== "bs_wifi" ? "0.3" : "1"}
                >
                  <rect x="200" y="120" width="35" height="35" rx="3" fill="#ffffff" stroke="#4B6BFB" strokeWidth="1.5" />
                  <text x="203" y="141" fill="#1e293b" fontSize="7" fontWeight="bold" fontFamily="monospace">W5500</text>
                </g>

                {/* 12V DC Adapter & Buck Regulator */}
                <g 
                  onMouseEnter={() => setHoveredComponent("bs_power")}
                  onMouseLeave={() => setHoveredComponent(null)}
                  className="cursor-pointer transition-opacity"
                  opacity={hoveredComponent && hoveredComponent !== "bs_power" ? "0.3" : "1"}
                >
                  <rect x="105" y="210" width="130" height="45" rx="6" fill="#ffffff" stroke="#64748B" strokeWidth="1.5" />
                  <text x="125" y="236" fill="#64748B" fontSize="9" fontWeight="bold" fontFamily="monospace">REGULATOR BUCK</text>
                </g>

                {/* Outdoor LoRa fiberglass high gain antenna */}
                <g 
                  onMouseEnter={() => setHoveredComponent("bs_ant")}
                  onMouseLeave={() => setHoveredComponent(null)}
                  className="cursor-pointer transition-opacity"
                  opacity={hoveredComponent && hoveredComponent !== "bs_ant" ? "0.3" : "1"}
                >
                  {/* mast/pole drawing */}
                  <line x1="45" y1="300" x2="45" y2="40" stroke="#475569" strokeWidth="3" />
                  <rect x="35" y="20" width="20" height="60" rx="3" fill="#ffffff" stroke="#4B6BFB" strokeWidth="2" />
                  <text x="39" y="55" fill="#4B6BFB" fontSize="7" fontWeight="bold" transform="rotate(-90 39 55)">8dBi</text>
                  <line x1="45" y1="80" x2="105" y2="137" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="3 3" />
                </g>

                {/* Outer Waterproof box enclosure */}
                <g 
                  onMouseEnter={() => setHoveredComponent("bs_box")}
                  onMouseLeave={() => setHoveredComponent(null)}
                  className="cursor-pointer transition-opacity"
                  opacity={hoveredComponent && hoveredComponent !== "bs_box" ? "0.3" : "1"}
                >
                  <rect x="220" y="65" width="35" height="15" rx="2" fill="#ffffff" stroke="#94A3B8" strokeWidth="1" />
                  <circle cx="228" cy="72" r="2.5" fill="#10B981" />
                  <circle cx="238" cy="72" r="2.5" fill="#3B82F6" />
                  <text x="225" y="75" fill="#475569" fontSize="6" fontWeight="bold" fontFamily="monospace">LEDS</text>
                </g>
              </svg>
            </div>

            {/* 3. Central Hover Info Card */}
            <div className="xl:col-span-3 space-y-6 self-stretch flex flex-col justify-between">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 min-h-[240px] flex flex-col justify-between shadow-sm flex-1">
                {activeHardware ? (
                  <div>
                    <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider font-mono">MODUL TERPILIH</span>
                    <h3 className="text-base font-bold mt-1 text-slate-900 leading-snug">{activeHardware.name}</h3>
                    <p className="text-slate-600 text-xs mt-3 leading-relaxed">
                      {activeHardware.desc}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center h-full my-auto py-8">
                    <span className="material-icons text-slate-400 text-3xl animate-pulse">touch_app</span>
                    <p className="text-slate-500 text-xs mt-3 font-semibold">Arahkan kursor ke komponen Rompi atau Stasiun Pangkalan untuk memeriksa detail skema dan biaya komponen.</p>
                  </div>
                )}
                
                {activeHardware && (
                  <div className="text-[10px] text-slate-500 font-mono tracking-widest mt-4 uppercase border-t border-slate-200 pt-3">
                    Estimasi Biaya: <strong className="text-blue-600">{activeHardware.price}</strong> ({activeHardware.priceIdr})
                  </div>
                )}
              </div>
            </div>

          </div>
        </section>

        {/* Pricing / Bill of Materials (BOM) Section */}
        <section id="pricing" className="py-12 border-t border-slate-200">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Rincian Anggaran Komponen (BOM)</h2>
            <p className="mt-2 text-sm text-slate-500">Daftar harga komponen berbiaya rendah untuk implementasi rompi keselamatan maritim pintar.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Vest BOM */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4 flex justify-between">
                <span>BOM Rompi Keselamatan Pintar</span>
                <span className="text-[#4B6BFB] text-sm">$62.50 (~Rp 970.000)</span>
              </h3>
              <div className="divide-y divide-slate-100 text-xs">
                {allHardware.filter(h => !h.id.startsWith("bs_") && !h.id.startsWith("sw_")).map((item, i) => (
                  <div key={i} className="py-2.5 flex justify-between gap-4">
                    <div className="min-w-0">
                      <span className="font-semibold text-slate-800 block truncate">{item.name}</span>
                    </div>
                    <div className="text-right font-mono text-slate-600 shrink-0">
                      {item.price} <span className="text-slate-400">({item.priceIdr})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Base Station BOM */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4 flex justify-between">
                <span>BOM Gateway Stasiun Pangkalan</span>
                <span className="text-[#4B6BFB] text-sm">$46.20 (~Rp 716.000)</span>
              </h3>
              <div className="divide-y divide-slate-100 text-xs">
                {allHardware.filter(h => h.id.startsWith("bs_")).map((item, i) => (
                  <div key={i} className="py-2.5 flex justify-between gap-4">
                    <div className="min-w-0">
                      <span className="font-semibold text-slate-800 block truncate">{item.name}</span>
                    </div>
                    <div className="text-right font-mono text-slate-600 shrink-0">
                      {item.price} <span className="text-slate-400">({item.priceIdr})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Software & API Subscription BOM */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4 flex justify-between">
                <span>Layanan Software & API</span>
                <span className="text-[#4B6BFB] text-sm">$5.00 (~Rp 78.000)</span>
              </h3>
              <div className="divide-y divide-slate-100 text-xs">
                {allHardware.filter(h => h.id.startsWith("sw_")).map((item, i) => (
                  <div key={i} className="py-2.5 flex justify-between gap-4">
                    <div className="min-w-0">
                      <span className="font-semibold text-slate-800 block truncate">{item.name}</span>
                    </div>
                    <div className="text-right font-mono text-slate-600 shrink-0">
                      {item.price} <span className="text-slate-400">({item.priceIdr})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* System Architecture Section */}
        <section id="architecture" className="py-12 border-t border-slate-200">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Alur Simulasi Transmisi Data Telemetri</h2>
            <p className="mt-2 text-sm text-slate-500">Bagaimana modul perangkat keras beroperasi bersama untuk mengirimkan peringatan keselamatan melalui LoRa.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { step: 1, label: "Pengumpulan Data Sensor Rompi", desc: "MAX30102 (detak jantung/SpO₂), MAX30205 (suhu tubuh), dan MPU6050 mengukur fisiologi & gerak." },
              { step: 2, label: "Logika Keputusan Lokal", desc: "ESP32-S3 pada rompi memantau nilai ambang batas (SpO₂ < 94%, jatuh, pingsan) untuk peringatan dini." },
              { step: 3, label: "Transmisi Telemetri LoRa 920 MHz", desc: "Transceiver SX1262 mengirim paket data nirkabel jarak jauh melewati permukaan laut ke stasiun darat." },
              { step: 4, label: "Penerusan Data Stasiun Darat", desc: "Gateway stasiun pantai menerima paket LoRa, mengonfirmasi data, dan mengunggah ke backend via Ethernet/Wi-Fi." },
              { step: 5, label: "Dasbor Operator & Analisis AI", desc: "Konsol pemantau menampilkan parameter kesehatan secara real-time, memetakan koordinat GPS, dan menjalankan model analisis AI." }
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 relative shadow-sm hover:shadow-md transition-shadow">
                <div className="absolute top-4 right-4 h-6 w-6 rounded-full bg-blue-50 border border-blue-100 text-[#4B6BFB] flex items-center justify-center text-xs font-bold font-mono">
                  {item.step}
                </div>
                <h4 className="font-sans text-xs font-bold text-slate-950 mt-4 leading-snug">{item.label}</h4>
                <p className="text-slate-500 text-[11px] mt-2 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200 pt-8 text-center text-slate-400 text-[10px] font-mono tracking-widest">
          <p>© 2026 Hellyoshaqiqie</p>
        </footer>
      </div>
    </div>
  );
}
