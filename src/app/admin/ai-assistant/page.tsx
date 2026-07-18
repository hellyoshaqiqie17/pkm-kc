"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { simulator, Fisherman, EmergencyAlert } from "@/lib/mockData";

interface Message {
  sender: "user" | "ai";
  text: string;
  time: string;
}

export default function AIAssistantPage() {
  const [fishermen, setFishermen] = useState<Fisherman[]>([]);
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "Halo! Saya adalah Asisten Keselamatan AI SMS-Vest Anda. Saya memproses paket telemetri LoRa secara real-time untuk mendeteksi kelelahan, risiko hipotermia, dan potensi keluar dari zona tangkap aman (geofence). Ada yang bisa saya bantu untuk memantau armada hari ini?",
      time: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [inputText, setInputText] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const syncData = () => {
      setFishermen(simulator.getFishermen());
      setAlerts(simulator.getAlerts());
    };
    syncData();
    return simulator.subscribe(syncData);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Compute live AI fleet diagnostics
  const diagnostics = useMemo(() => {
    const active = fishermen.filter(f => f.status !== "offline");
    const issues = active.filter(f => f.status === "emergency" || f.status === "warning");
    
    // Average metrics
    const avgSpO2 = active.length > 0 ? Math.round(active.reduce((sum, f) => sum + f.spo2, 0) / active.length) : 0;
    const avgHR = active.length > 0 ? Math.round(active.reduce((sum, f) => sum + f.heartRate, 0) / active.length) : 0;
    
    // Risk distribution
    let highRiskCount = active.filter(f => f.status === "emergency" || f.spo2 < 94 || f.hypothermiaRisk === "High Risk").length;
    let modRiskCount = active.filter(f => f.status === "warning" || f.fatigue === "Moderate Fatigue").length;
    let safeCount = active.length - highRiskCount - modRiskCount;

    return {
      activeCount: active.length,
      issueCount: issues.length,
      avgSpO2,
      avgHR,
      highRiskCount,
      modRiskCount,
      safeCount
    };
  }, [fishermen]);

  // Handle mock AI response based on live telemetry state
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText;
    const newMsg: Message = {
      sender: "user",
      text: userText,
      time: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText("");

    // Simulate AI thinking and response
    setTimeout(() => {
      let aiResponse = "";
      const lowerText = userText.toLowerCase();

      // Look up specific fishermen in query
      const matchFisher = fishermen.find(f => lowerText.includes(f.name.toLowerCase()) || lowerText.includes(f.id.toLowerCase()));

      if (matchFisher) {
        if (matchFisher.status === "offline") {
          aiResponse = `Rekam telemetri menunjukkan bahwa nelayan **${matchFisher.name}** saat ini sedang offline (waktu bersandar terakhir: ${matchFisher.tripDepartureTime}). Baterai rompi tidak memancarkan sinyal.`;
        } else {
          aiResponse = `**Analisis AI untuk Nelayan ${matchFisher.name}** (${matchFisher.assignedVestId}):
- **Status Keselamatan**: ${matchFisher.status === "emergency" ? "DARURAT KRITIS" : matchFisher.status === "warning" ? "PERINGATAN DIaktifkan" : "AMAN / OPERASIONAL"}
- **Fisiologi Medis**: Saturasi Oksigen (SpO₂) sebesar **${matchFisher.spo2}%** (Batas aman: >95%), Detak Jantung **${matchFisher.heartRate} BPM**, dan Suhu Tubuh **${matchFisher.temperature}°C**.
- **Evaluasi Indikator**: Tingkat Kelelahan: **${matchFisher.fatigue === "High Fatigue" ? "Sangat Lelah" : matchFisher.fatigue === "Moderate Fatigue" ? "Kelelahan Sedang" : "Aman / Bugar"}**, Risiko Hipotermia: **${matchFisher.hypothermiaRisk === "High Risk" ? "Risiko Tinggi" : matchFisher.hypothermiaRisk === "Low Risk" ? "Risiko Rendah" : "Aman"}**. Sensor Air: **${matchFisher.waterDetected ? "BASAH (Terendam)" : "KERING"}**.
- **Log Perjalanan**: Nelayan telah berada di laut selama **${matchFisher.tripDuration} menit** dengan jarak jelajah **${matchFisher.tripDistance} km** dari garis pantai.

*Rekomendasi Penanganan AI*: ${matchFisher.status === "emergency" ? "Kirimkan kapal patroli SAR segera ke koordinat nelayan!" : matchFisher.spo2 < 95 ? "Nelayan kekurangan oksigen darah. Minta bersandar untuk istirahat." : "Seluruh parameter fisiologis terpantau aman dan stabil."}`;
        }
      } else if (lowerText.includes("siapa") || lowerText.includes("bahaya") || lowerText.includes("risiko") || lowerText.includes("darurat") || lowerText.includes("alert")) {
        const criticalList = fishermen.filter(f => f.status === "emergency" || f.status === "warning");
        if (criticalList.length === 0) {
          aiResponse = "Semua nelayan di laut saat ini dalam kondisi **Aman**. Tidak ada anomali detak jantung, SpO₂ rendah, maupun indikasi jatuh ke laut (fall overboard).";
        } else {
          aiResponse = `Nelayan berikut terdeteksi memiliki indikator risiko keselamatan saat ini:
${criticalList.map((f, i) => `${i + 1}. **${f.name}** (${f.assignedVestId}): Status **${f.status === "emergency" ? "DARURAT" : "PERINGATAN"}**. SpO₂: **${f.spo2}%**, Kelelahan: **${f.fatigue}**, Suhu: **${f.temperature}°C**, Hipotermia: **${f.hypothermiaRisk}**`).join("\n")}

*Rekomendasi AI*: Hubungi kapal terdekat untuk melakukan konfirmasi visual atau bersiap mengirim unit penyelamat jika status naik menjadi Darurat Kritis.`;
        }
      } else if (lowerText.includes("rata") || lowerText.includes("average") || lowerText.includes("oksigen") || lowerText.includes("spo2")) {
        aiResponse = `Rata-rata saturasi oksigen (SpO₂) dari ${diagnostics.activeCount} nelayan aktif saat ini adalah **${diagnostics.avgSpO2}%**. Rata-rata denyut jantung berada di angka **${diagnostics.avgHR} BPM**. Seluruh parameter ini dipantau secara real-time dari chip sensor MAX30102.`;
      } else if (lowerText.includes("hipotermia") || lowerText.includes("kedinginan")) {
        aiResponse = "Risiko hipotermia dievaluasi saat sensor air mendeteksi kebasahan/terendam (water contact) bersamaan dengan pembacaan sensor suhu tubuh MAX30205 di bawah 35.5°C. Tindakan pertolongan pertama: Keringkan tubuh korban, ganti pakaian basah, dan selimuti dengan kain tebal.";
      } else if (lowerText.includes("lelah") || lowerText.includes("fatigue")) {
        aiResponse = "Tingkat kelelahan nelayan dihitung menggunakan model sensor gerak IMU (MPU6050) dan durasi perjalanan aktif di laut. Bila nelayan melaut lebih dari 5 jam berturut-turut, sistem akan menetapkan status 'High Fatigue' (Sangat Lelah) untuk mencegah kecelakaan akibat kelelahan fisik.";
      } else {
        aiResponse = `Laporan Pemantauan AI saat ini:
- Jumlah nelayan aktif di laut: **${diagnostics.activeCount} orang**.
- Sebaran tingkat keselamatan: **${diagnostics.highRiskCount}** Kritis, **${diagnostics.modRiskCount}** Peringatan, dan **${diagnostics.safeCount}** Aman.
- Rata-rata Oksigen SpO₂: **${diagnostics.avgSpO2}%**.
- Kualitas sinyal jaringan LoRa SX1262: **92% (Sangat Baik)**.

Apakah Anda ingin memeriksa kondisi nelayan tertentu secara spesifik? Silakan ketik nama nelayan (misal: 'Sutarno', 'Budi', atau 'Hendro').`;
      }

      const aiMsg: Message = {
        sender: "ai",
        text: aiResponse,
        time: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 1000);
  };

  return (
    <div className="space-y-6 font-sans text-foreground">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Asisten Keselamatan AI</h1>
        <p className="text-sm text-slate-500 mt-1">Pendamping analisis keselamatan armada nelayan secara real-time menggunakan kecerdasan buatan.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        
        {/* Left Side: Live Diagnostics summary */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Risk assessment */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <h3 className="text-sm font-semibold text-foreground border-b border-slate-100 pb-3 flex items-center gap-2">
              <span className="material-icons text-blue-500 text-lg">analytics</span>
              Diagnosis Armada AI
            </h3>

            <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold">
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-emerald-700">
                <span className="text-[10px] text-emerald-500 block uppercase">Aman</span>
                <span className="text-lg font-bold">{diagnostics.safeCount}</span>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-amber-700">
                <span className="text-[10px] text-amber-500 block uppercase">Sedang</span>
                <span className="text-lg font-bold">{diagnostics.modRiskCount}</span>
              </div>
              <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-red-700">
                <span className="text-[10px] text-red-500 block uppercase">Kritis</span>
                <span className="text-lg font-bold">{diagnostics.highRiskCount}</span>
              </div>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div className="flex justify-between border-b border-slate-100 pb-2.5">
                <span className="text-slate-500">Saluran Telemetri Aktif</span>
                <span className="text-foreground font-semibold">{diagnostics.activeCount} Nelayan</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2.5">
                <span className="text-slate-500">Rerata SpO₂ (Kadar Oksigen)</span>
                <span className={`font-semibold ${diagnostics.avgSpO2 < 95 ? "text-amber-500" : "text-foreground"}`}>
                  {diagnostics.avgSpO2}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Rerata Detak Jantung</span>
                <span className="text-foreground font-semibold">{diagnostics.avgHR} BPM</span>
              </div>
            </div>
          </div>

          {/* AI Insights banner */}
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl p-5 space-y-3 shadow-md">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <span className="material-icons text-lg">lightbulb</span>
              Saran Keselamatan AI
            </h3>
            <p className="text-xs leading-relaxed opacity-90">
              {diagnostics.highRiskCount > 0 
                ? "Mendeteksi sinyal jatuh ke air atau penekanan tombol SOS darurat nelayan! Segera lakukan konfirmasi visual dan persiapkan koordinat penyelamatan."
                : "Seluruh sensor fisiologis dan telemetry nelayan dalam batas operasional aman. Jalur transmisi nirkabel stasiun darat terpantau kondusif."}
            </p>
          </div>
        </div>

        {/* Right Side: Interactive Chat interface */}
        <div className="lg:col-span-8 flex flex-col bg-white border border-slate-200 rounded-2xl h-[520px] overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          {/* Chat Header */}
          <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <span className="material-icons text-xl">smart_toy</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Copilot Keselamatan AI</h3>
              <p className="text-[11px] text-slate-500">Tanyakan tentang parameter medis nelayan atau protokol pertolongan pertama</p>
            </div>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => {
              const isAi = msg.sender === "ai";
              return (
                <div key={idx} className={`flex ${isAi ? "justify-start" : "justify-end"} gap-3`}>
                  {isAi && (
                    <div className="h-8 w-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 text-sm shrink-0">
                      <span className="material-icons text-base">smart_toy</span>
                    </div>
                  )}
                  <div className={`max-w-[75%] rounded-2xl p-3.5 text-sm ${
                    isAi 
                      ? "bg-slate-100 text-slate-800 rounded-tl-none whitespace-pre-line" 
                      : "bg-[#4B6BFB] text-white rounded-tr-none"
                  }`}>
                    <p className="leading-relaxed">{msg.text}</p>
                    <span className={`text-[9px] block text-right mt-1.5 ${isAi ? "text-slate-400" : "text-blue-200"}`}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Input field */}
          <form onSubmit={handleSendMessage} className="border-t border-slate-100 p-3 bg-white flex gap-2">
            <input
              type="text"
              placeholder="Tanyakan keselamatan nelayan, misal: 'Siapa yang bahaya?' atau 'Periksa Budi'..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-foreground text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all placeholder:text-slate-400"
            />
            <button
              type="submit"
              className="h-11 w-11 rounded-xl bg-[#4B6BFB] hover:bg-blue-600 text-white flex items-center justify-center transition-all shadow-md shadow-blue-500/10 cursor-pointer"
            >
              <span className="material-icons text-base">send</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
