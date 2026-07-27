"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function BackgroundPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden relative">
      
      {/* Background patterns */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-20 z-0" />
      <div className="absolute top-[5%] left-[-15%] w-[45rem] h-[45rem] bg-blue-400/5 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute top-[40%] right-[-15%] w-[45rem] h-[45rem] bg-indigo-400/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[5%] left-[-10%] w-[40rem] h-[40rem] bg-blue-400/5 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Header Navigation */}
      <header className="relative z-10 max-w-[1300px] mx-auto px-6 py-8">
        <nav className="flex items-center justify-between pb-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-50 border border-slate-200 overflow-hidden flex items-center justify-center shadow-sm">
              <span className="material-icons text-[#4B6BFB] text-lg">sailing</span>
            </div>
            <span className="font-sans text-base font-bold tracking-tight text-slate-800 uppercase">PKM KC - OceanVest</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
            <Link href="/#overview" className="hover:text-slate-800 transition-colors">
              Overview
            </Link>
            <Link href="/background" className="text-[#4B6BFB] font-semibold hover:text-blue-700 transition-colors">
              Latar Belakang
            </Link>
            <Link href="/#features" className="hover:text-slate-800 transition-colors">Fitur Utama</Link>
            <Link href="/#schematics" className="hover:text-slate-800 transition-colors">Skema Perangkat</Link>
            <Link href="/#pricing" className="hover:text-slate-800 transition-colors">Rincian Harga</Link>
            <Link href="/#architecture" className="hover:text-slate-800 transition-colors">Alur Sistem</Link>
          </div>

          <Link href="/admin/dashboard" className="px-5 py-2.5 rounded-xl bg-[#4B6BFB] text-white hover:bg-blue-600 text-sm font-semibold transition-all shadow-md shadow-blue-500/10">
            Login Admin
          </Link>
        </nav>
      </header>

      {/* Main Title Hero */}
      <section className="relative z-10 max-w-4xl mx-auto text-center px-6 pt-16 pb-12">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full">
          Latar Belakang Inovasi & Masalah
        </span>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-950 mt-6 leading-tight">
          Mengatasi Krisis Keselamatan Jiwa Nelayan Tradisional
        </h1>
        <p className="mt-4 text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Mengapa sistem rompi pintar biometrik dan jaringan nirkabel LoRa dikembangkan? Di bawah ini dijabarkan analisis keterbatasan infrastruktur komunikasi, ancaman kecelakaan laut, dan solusi terpadu yang kami hadirkan.
        </p>
      </section>

      {/* Narrative Section 1: Keterbatasan Sinyal */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-lg">
          
          {/* LEFT: Animation Canvas (Step 1 - Blank Spot GSM - High Contrast Blue Sea) */}
          <div className="lg:col-span-6 bg-white border border-slate-300 rounded-2xl min-h-[340px] flex flex-col items-center justify-center relative p-6 overflow-hidden shadow-inner">
            <div className="absolute inset-0 bg-radial-gradient-light pointer-events-none opacity-30" />
            
            {/* Unified SVG Canvas for Step 1 */}
            <svg width="320" height="200" viewBox="0 0 320 200" fill="none" className="overflow-visible z-10">
              {/* Faint clouds in sky */}
              <path d="M30 40 Q45 30 60 40 Q75 30 90 40 L90 50 L30 50 Z" fill="#F1F5F9" stroke="#E2E8F0" strokeWidth="1" />
              <path d="M220 50 Q235 40 250 50 Q265 40 280 50 L280 60 L220 60 Z" fill="#F1F5F9" stroke="#E2E8F0" strokeWidth="1" />

              {/* Calm ocean waves back layer (contrasting light blue) */}
              <motion.path 
                d="M-40 140 Q40 130 120 140 Q200 150 280 140 Q360 130 440 140 L440 210 L-40 210 Z" 
                fill="#93C5FD" 
                opacity="0.6"
                animate={{ x: [-15, 15, -15] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Ship, Mast, and Radar */}
              <g transform="translate(60, 40)">
                <motion.g
                  animate={{ 
                    y: [0, -5, 0],
                    rotate: [-1, 1, -1]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                >
                  {/* Mast */}
                  <line x1="100" x2="100" y1="40" y2="100" stroke="#334155" strokeWidth="2.5" />
                  {/* Flag */}
                  <path d="M100 40 L120 48 L100 56 Z" fill="#DC2626" />
                  {/* Boat Body (High contrast royal blue) */}
                  <path d="M40 100 L160 100 L145 120 L55 120 Z" fill="#1D4ED8" stroke="#1E40AF" strokeWidth="2.5" />
                  {/* Cabin */}
                  <rect x="75" y="70" width="50" height="30" rx="3" fill="#FFFFFF" stroke="#334155" strokeWidth="2.5" />
                  <rect x="85" y="78" width="12" height="12" rx="1.5" fill="#1E293B" />
                  <rect x="103" y="78" width="12" height="12" rx="1.5" fill="#1E293B" />

                  {/* Crossed-out Mobile Phone Icon Alert Box (Aligned at bottom) */}
                  <g transform="translate(100, 25)">
                    <rect x="-24" y="-34" width="48" height="26" rx="6" fill="#FFFFFF" stroke="#DC2626" strokeWidth="2" />
                    {/* Signal bars standing up from baseline y=-10 */}
                    <line x1="-12" y1="-10" x2="-12" y2="-14" stroke="#DC2626" strokeWidth="2" />
                    <line x1="-7" y1="-10" x2="-7" y2="-18" stroke="#CBD5E1" strokeWidth="2" />
                    <line x1="-2" y1="-10" x2="-2" y2="-22" stroke="#CBD5E1" strokeWidth="2" />
                    <line x1="3" y1="-10" x2="3" y2="-26" stroke="#CBD5E1" strokeWidth="2" />
                    {/* Slanted red cross bar */}
                    <line x1="-16" y1="-10" x2="16" y2="-30" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
                  </g>

                  {/* Radar signal waves radiating from the mast head */}
                  <motion.circle 
                    cx="100" 
                    cy="40" 
                    r="15" 
                    stroke="#DC2626" 
                    strokeWidth="2" 
                    opacity={0.8}
                    animate={{ r: [15, 85], opacity: [0.8, 0] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
                  />
                  <motion.circle 
                    cx="100" 
                    cy="40" 
                    r="15" 
                    stroke="#DC2626" 
                    strokeWidth="2" 
                    opacity={0.8}
                    animate={{ r: [15, 85], opacity: [0.8, 0] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut", delay: 1.1 }}
                  />
                </motion.g>
              </g>

              {/* Calm ocean waves front layer (high contrast blue) */}
              <motion.path 
                d="M-40 150 Q40 160 120 150 Q200 140 280 150 Q360 160 440 150 L440 210 L-40 210 Z" 
                fill="#2563EB" 
                opacity="0.9"
                animate={{ x: [15, -15, 15] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
            </svg>

            {/* Warning Overlay Card */}
            <div className="absolute bottom-6 bg-white border-2 border-red-500 px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-md z-20">
              <span className="material-icons text-red-600 text-sm animate-pulse">signal_cellular_connected_no_internet_0_bar</span>
              <span className="text-[10px] font-mono tracking-wider font-bold text-red-600">GSM SIGNAL: 0% (BLANK SPOT TOTAL)</span>
            </div>
          </div>

          {/* RIGHT: Text Content (Step 1) */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#4B6BFB] bg-blue-50 border border-blue-100 px-3 py-1 rounded-md w-fit">
              Latar Belakang Inovasi
            </span>
            <h2 className="text-2xl font-black text-slate-950 tracking-tight leading-snug">
              Keterbatasan Telekomunikasi di Tengah Laut
            </h2>
            <h3 className="text-sm font-semibold text-slate-600">
              Ketiadaan Sinyal Seluler (GSM) & Bahaya Isolasi Geografis Nelayan Tradisional
            </h3>
            <div className="space-y-4 text-xs sm:text-sm text-slate-800 leading-relaxed">
              <p>
                <strong>Kondisi Riil:</strong> Nelayan tradisional di Pantai Sine, Tulungagung, berlayar di malam hari hingga sejauh 5–25 kilometer dari garis pantai untuk mencari wilayah tangkapan potensial. Namun, akibat topografi pantai selatan Jawa yang curam dan jarak melaut yang jauh, sinyal telekomunikasi seluler GSM/BTS darat sama sekali tidak terjangkau.
              </p>
              <p>
                <strong>Dampak Fatal:</strong> Ketiadaan sinyal membuat perahu nelayan mengalami isolasi komunikasi penuh. Apabila terjadi malafungsi mesin, lambung bocor, badai ekstrem, atau kecelakaan di tengah laut, mereka tidak memiliki cara apa pun untuk menghubungi pos penyelamat darat atau membagikan koordinat posisi mereka.
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex gap-3 items-start">
              <span className="material-icons text-[#4B6BFB] text-lg">format_quote</span>
              <p className="text-xs text-slate-700 italic font-medium leading-relaxed">
                Ketiadaan infrastruktur komunikasi seluler di laut dalam mengunci nasib nelayan tradisional dalam ketidakpastian yang absolut.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Narrative Section 2: Bahaya Sunyi (Alternated layout) */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-lg">
          
          {/* LEFT: Text Content (Step 2) - Shows first on desktop */}
          <div className="lg:col-span-6 space-y-6 lg:order-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-red-600 bg-red-50 border border-red-200 px-3 py-1 rounded-md w-fit">
              Identifikasi Permasalahan
            </span>
            <h2 className="text-2xl font-black text-slate-950 tracking-tight leading-snug">
              Silent Death di Samudera Hindia
            </h2>
            <h3 className="text-sm font-semibold text-slate-600">
              Kegagalan Respon Darurat Akibat Hipotermia, Kelelahan Fisik, & Insiden Jatuh ke Laut
            </h3>
            <div className="space-y-4 text-xs sm:text-sm text-slate-800 leading-relaxed">
              <p>
                <strong>Kondisi Riil:</strong> Suhu laut selatan Jawa di malam hari dapat anjlok secara drastis, meningkatkan risiko hipotermia akut (penurunan suhu inti tubuh di bawah 35°C). Selain itu, nelayan rentan mengalami kelelahan otot dan jantung karena aktivitas melaut yang berat. Kasus nelayan tergelincir jatuh ke laut (*fall overboard*) pun sering terjadi tanpa disadari akibat keterbatasan pandangan malam hari.
              </p>
              <p>
                <strong>Dampak Fatal:</strong> Tanpa adanya sensor pemantau biometrik otomatis, penurunan suhu tubuh, detak jantung anomali, maupun status jatuh tidak terdeteksi sejak awal. Korban tenggelam atau pingsan secara perlahan di lautan tanpa bantuan medis, yang memicu tingginya angka *silent death* di kalangan nelayan kecil.
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex gap-3 items-start">
              <span className="material-icons text-red-500 text-lg">format_quote</span>
              <p className="text-xs text-slate-700 italic font-medium leading-relaxed">
                Setiap detik keterlambatan deteksi kegawatdaruratan di tengah laut dingin memperbesar risiko fatalitas secara permanen.
              </p>
            </div>
          </div>

          {/* RIGHT: Animation Canvas (Step 2 - The Crisis/Storm/Drowning - Blue Sea Waves) */}
          <div className="lg:col-span-6 bg-white border border-slate-300 rounded-2xl min-h-[340px] flex flex-col items-center justify-center relative p-6 overflow-hidden shadow-inner lg:order-2">
            
            {/* EKG monitor box in high-contrast light mode */}
            <div className="absolute top-8 left-6 right-6 h-12 bg-white border-2 border-red-200 rounded-xl p-2 flex items-center justify-center overflow-hidden z-20 shadow-sm">
              <div className="absolute left-3 top-1.5 text-[7px] font-mono text-red-600 font-bold uppercase flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-ping" />
                VITAL: LAUT DINGIN (34.2 °C) • HR: 42 BPM (HIPOTERMIA)
              </div>
              <svg className="w-full h-full text-red-650" viewBox="0 0 200 40" fill="none">
                <motion.path
                  // bradycardia pulse (slowed heart rate)
                  d="M0 20 L80 20 L83 10 L87 30 L90 20 L180 20 L183 10 L187 30 L190 20"
                  stroke="#DC2626"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
              </svg>
            </div>

            {/* Storm Clouds at the top */}
            <div className="absolute top-0 left-0 right-0 h-8 bg-slate-200/50 opacity-40 z-10" />

            {/* Heavy diagonal rain animation */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50 z-10">
              {[...Array(12)].map((_, i) => (
                <motion.line
                  key={i}
                  x1={20 + i * 28}
                  y1={-40}
                  x2={0 + i * 28}
                  y2={180}
                  stroke="#475569"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  animate={{ y: [-40, 240] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "linear", delay: i * 0.08 }}
                />
              ))}
            </div>

            {/* Unified SVG Canvas for Step 2 */}
            <svg width="320" height="200" viewBox="0 0 320 200" fill="none" className="overflow-visible z-10 mt-8">
              
              {/* Stormy sea waves back layer (contrasting blue) */}
              <motion.path 
                d="M-40 130 Q30 150 100 130 Q170 110 240 130 Q310 150 380 130 L380 210 L-40 210 Z" 
                fill="#3B82F6" 
                opacity="0.6"
                animate={{ x: [-15, 15, -15], y: [0, 5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Tilted empty boat drifting away to the left */}
              <g transform="translate(30, 95) rotate(-16)">
                <motion.g
                  animate={{ 
                    y: [-3, 3, -3],
                    rotate: [0, -5, 0],
                    x: [0, -10, 0]
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  {/* Boat shape */}
                  <path d="M10 25 L90 25 L80 40 L20 40 Z" fill="#334155" stroke="#0F172A" strokeWidth="2.5" />
                  {/* Cabin */}
                  <rect x="35" y="10" width="30" height="15" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
                </motion.g>
              </g>

              {/* Drowning fisherman struggling on the right */}
              <g transform="translate(200, 110)">
                <motion.g
                  animate={{ 
                    y: [0, 8, 0],
                    rotate: [-3, 3, -3]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  {/* Head */}
                  <circle cx="20" cy="-5" r="7.5" fill="#DC2626" stroke="#7F1D1D" strokeWidth="2.5" />
                  {/* Left Arm waving up */}
                  <path d="M11 5 Q3 -10, 5 -22" stroke="#DC2626" strokeWidth="3.5" strokeLinecap="round" />
                  <path d="M11 5 Q3 -10, 5 -22" stroke="#7F1D1D" strokeWidth="1" strokeLinecap="round" />
                  {/* Right Arm waving up */}
                  <path d="M29 5 Q37 -10, 35 -22" stroke="#DC2626" strokeWidth="3.5" strokeLinecap="round" />
                  <path d="M29 5 Q37 -10, 35 -22" stroke="#7F1D1D" strokeWidth="1" strokeLinecap="round" />
                  {/* Body drowning in waves */}
                  <path d="M8 15 C10 8, 30 8, 32 15 L28 35 L12 35 Z" fill="#DC2626" stroke="#7F1D1D" strokeWidth="2.5" />
                  
                  {/* Splashing water effects around him */}
                  <motion.path 
                    d="M-5 12 Q5 0, 8 15" 
                    stroke="#0EA5E9" 
                    strokeWidth="2.5" 
                    fill="none" 
                    animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  />
                  <motion.path 
                    d="M45 12 Q35 0, 32 15" 
                    stroke="#0EA5E9" 
                    strokeWidth="2.5" 
                    fill="none" 
                    animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: 0.6 }}
                  />
                </motion.g>
              </g>

              {/* Stormy sea waves front layer (High contrast royal blue) */}
              <motion.path 
                d="M-40 145 Q30 120 100 145 Q170 170 240 145 Q310 120 380 145 L380 210 L-40 210 Z" 
                fill="#1D4ED8" 
                opacity="0.95"
                animate={{ x: [15, -15, 15], y: [0, -4, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </svg>

            {/* Flashing Alert Banner */}
            <div className="absolute bottom-6 bg-red-50 border-2 border-red-500 px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-md z-20">
              <span className="material-icons text-red-600 text-sm animate-pulse">warning</span>
              <span className="text-[10px] font-mono tracking-wider font-black text-red-700">ALERT: SILENT DROWNING & DANGER TO LIFE</span>
            </div>
          </div>

        </div>
      </section>

      {/* Narrative Section 3: Solusi SMS-Vest */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-lg">
          
          {/* LEFT: Animation Canvas (Step 3 - LoRa transmission and rescue - Fisherman on Boat, Boat on Water) */}
          <div className="lg:col-span-6 bg-white border border-slate-300 rounded-2xl min-h-[340px] flex flex-col items-center justify-center relative p-6 overflow-hidden shadow-inner">
            <div className="absolute inset-0 bg-radial-gradient-light pointer-events-none opacity-30" />
            
            {/* Calm ocean waves back layer (Contrasting Sky Blue) */}
            <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden">
              <svg className="w-[200%] h-full text-blue-100" viewBox="0 0 1200 120" preserveAspectRatio="none" fill="currentColor">
                <path d="M0,60 C150,80 350,40 500,60 C650,80 850,40 1000,60 C1150,80 1350,40 1500,60 L1500,120 L0,120 Z" />
              </svg>
            </div>

            {/* Unified SVG Canvas for Step 3 */}
            <svg width="320" height="200" viewBox="0 0 320 200" fill="none" className="overflow-visible z-10">
              
              {/* Calm ocean waves back layer (Blue 400) */}
              <motion.path 
                d="M-40 140 Q40 150 120 140 Q200 130 280 140 Q360 150 440 140 L440 210 L-40 210 Z" 
                fill="#60A5FA" 
                opacity="0.6"
                animate={{ x: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Boat carrying the fisherman, floating perfectly ON the waves */}
              <g transform="translate(45, 122)">
                <motion.g
                  animate={{ 
                    y: [0, -3, 0],
                    rotate: [-1, 1, -1]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  {/* Green SAR/Rescue Boat */}
                  <path d="M0 12 L45 12 L52 4 L62 12 L57 20 L5 20 Z" fill="#10B981" stroke="#065F46" strokeWidth="2.5" />
                  {/* Cabin */}
                  <rect x="12" y="5" width="18" height="7" fill="#FFFFFF" stroke="#065F46" strokeWidth="1.5" />

                  {/* Fisherman standing safely on the boat deck, wearing orange vest */}
                  <g transform="translate(14, -14)">
                    {/* Head */}
                    <circle cx="8" cy="5" r="4.5" fill="#334155" stroke="#0F172A" strokeWidth="1" />
                    {/* Bright orange life vest */}
                    <path d="M0 10 L16 10 L13 22 L3 22 Z" fill="#F97316" stroke="#C2410C" strokeWidth="2" />
                    {/* Flashing GPS LED */}
                    <motion.circle 
                      cx="8" 
                      cy="16" 
                      r="2" 
                      fill="#10B981" 
                      animate={{ opacity: [0.2, 1, 0.2] }} 
                      transition={{ duration: 1, repeat: Infinity }} 
                    />
                  </g>
                </motion.g>
              </g>

              {/* LoRa Wireless Signals propagating from the Vest (x=67) to Coastal Gateway (x=260) */}
              <g transform="translate(68, 105)">
                <motion.path
                  d="M20 -10 Q50 -40, 80 -10"
                  stroke="#2563EB"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                  animate={{ opacity: [0.1, 1, 0.1], scaleY: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.path
                  d="M40 -30 Q80 -70, 120 -30"
                  stroke="#2563EB"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                  animate={{ opacity: [0.1, 1, 0.1], scaleY: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                />
              </g>

              {/* Coastal base station tower on the right, resting on water level */}
              <g transform="translate(240, 50)">
                {/* Tower struts */}
                <path d="M15 90 L35 90 L27 20 L23 20 Z" fill="#F1F5F9" stroke="#334155" strokeWidth="2.5" />
                <line x1="20" y1="90" x2="25" y2="20" stroke="#334155" strokeWidth="2" />
                <line x1="30" y1="90" x2="25" y2="20" stroke="#334155" strokeWidth="2" />
                <rect x="23.5" y="40" width="3" height="15" fill="#DC2626" />
                
                {/* Platform */}
                <rect x="18" y="15" width="14" height="5" fill="#334155" rx="1" />
                
                {/* Radiating Green Signal rings */}
                <circle cx="25" cy="8" r="4.5" fill="#10B981" />
                <motion.circle 
                  cx="25" 
                  cy="8" 
                  r={15} 
                  stroke="#10B981" 
                  strokeWidth="2" 
                  opacity={0} 
                  animate={{ r: [5, 25], opacity: [0.8, 0] }} 
                  transition={{ duration: 1.5, repeat: Infinity }} 
                />
              </g>

              {/* Calm ocean waves front layer (Royal Blue 600) */}
              <motion.path 
                d="M-40 150 Q40 138 120 150 Q200 162 280 150 Q360 138 440 150 L440 210 L-40 210 Z" 
                fill="#2563EB" 
                opacity="0.95"
                animate={{ x: [10, -10, 10] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
            </svg>

            {/* Connected Status Card */}
            <div className="absolute bottom-6 bg-emerald-50 border-2 border-emerald-500 px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-md z-20">
              <span className="material-icons text-emerald-600 text-base animate-pulse">check_circle</span>
              <span className="text-[10px] font-mono tracking-wider font-black text-emerald-700">TELEMETRY LINKED • RANGE: 25 KM OK</span>
            </div>
          </div>

          {/* RIGHT: Text Content (Step 3) */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#4B6BFB] bg-blue-50 border border-blue-100 px-3 py-1 rounded-md w-fit">
              Solusi Teknologi
            </span>
            <h2 className="text-2xl font-black text-slate-950 tracking-tight leading-snug">
              Ekosistem Penyelamatan Ciptaan SMS-Vest
            </h2>
            <h3 className="text-sm font-semibold text-slate-600">
              Integrasi Rompi Pintar Biometrik, Transmisi Radio LoRa Jarak Jauh, & Alarm Komando Berbasis AI
            </h3>
            <div className="space-y-4 text-xs sm:text-sm text-slate-800 leading-relaxed">
              <p>
                <strong>Solusi SMS-Vest:</strong> Kami membangun ekosistem keselamatan mandiri dengan mengintegrasikan Smart Marine Safety Vest (SMS-Vest) yang dibekali sensor biometrik (MAX30102 untuk denyut nadi & SpO₂, DS18B20 untuk suhu tubuh) dan modul GPS u-blox.
              </p>
              <p>
                <strong>Mekanisme Kerja:</strong> Saat sensor air mendeteksi nelayan jatuh atau biometrik mendeteksi penurunan suhu/kelelahan ekstrem, sistem langsung memancarkan data secara instan via radio LoRa SX1262 (920 MHz) menembus jarak hingga 25 km ke Gateway Pantai Sine. Server darat langsung menerjemahkan koordinat GPS korban dan membunyikan alarm peringatan di dasbor agar tim SAR dapat diluncurkan secara cepat dan presisi.
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex gap-3 items-start">
              <span className="material-icons text-[#4B6BFB] text-lg">format_quote</span>
              <p className="text-xs text-slate-700 italic font-medium leading-relaxed">
                Menembus batas jaringan seluler, gelombang radio LoRa dan asisten AI menjadi penjamin kepastian keselamatan nelayan.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Deep-dive Statistics Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-28 border-t border-slate-200 pt-16">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Data & Fakta Permasalahan Maritim</h2>
          <p className="mt-2 text-slate-500 text-sm">Mengapa intervensi keselamatan digital sangat krusial bagi nelayan tradisional Indonesia.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm">
            <div className="h-10 w-10 rounded-xl bg-red-50 border border-red-100 text-red-500 flex items-center justify-center">
              <span className="material-icons text-xl">portable_wifi_off</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">0% Sinyal Seluler</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Jaringan GSM darat hanya menjangkau hingga 3–5 km dari pantai. Nelayan tradisional Pantai Sine sering berlayar sejauh 15–20 km, menempatkan mereka dalam isolasi telekomunikasi total.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm">
            <div className="h-10 w-10 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center">
              <span className="material-icons text-xl">thermostat</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">Bahaya Hipotermia</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Suhu air laut malam hari dapat turun hingga di bawah 22°C. Suhu inti tubuh nelayan yang basah atau terendam air dapat anjlok ke tingkat membahayakan (di bawah 35°C) hanya dalam hitungan jam.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm">
            <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-500 flex items-center justify-center">
              <span className="material-icons text-xl">timer</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">Kecepatan Respon SAR</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pencarian tanpa koordinat GPS memakan waktu berhari-hari. Dengan modul GPS u-blox dan alarm AI real-time, koordinat presisi langsung terkirim dalam 12 detik, mempercepat waktu tanggap darurat secara masif.
            </p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200 py-12 text-center text-[10px] font-mono tracking-widest text-slate-400">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Hellyoshaqiqie. SMS-Vest PKM KC.</p>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-slate-600 transition-colors">Utama</Link>
            <Link href="/admin/dashboard" className="hover:text-slate-600 transition-colors">Admin Dashboard</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
