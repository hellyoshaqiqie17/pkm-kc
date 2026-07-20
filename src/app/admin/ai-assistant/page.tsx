"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { simulator, Fisherman, EmergencyAlert } from "@/lib/mockData";

interface Message {
  sender: "user" | "ai";
  text: string;
  time: string;
  isTyping?: boolean;
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
  const [isLoading, setIsLoading] = useState(false);
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
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userText = inputText;
    const newMsg: Message = {
      sender: "user",
      text: userText,
      time: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText("");
    setIsLoading(true);

    // Show animated typing indicator
    setMessages(prev => [...prev, {
      sender: "ai",
      text: "",
      time: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
      isTyping: true
    }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: userText,
          history: messages
            .filter(m => !m.isTyping)
            .map(m => ({
              role: m.sender === "user" ? "user" : "model",
              parts: [{ text: m.text }]
            })),
          fleetState: {
            fishermen,
            alerts,
            boats: simulator.getBoats(),
            vests: simulator.getVests(),
            stations: simulator.getStations()
          }
        })
      });

      if (!response.ok) {
        throw new Error("Chat request failed");
      }

      const resData = await response.json();
      
      setMessages(prev => 
        prev.filter(m => !m.isTyping).concat({
          sender: "ai",
          text: resData.text || "Maaf, sistem asisten AI tidak merespons. Silakan coba kembali.",
          time: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
        })
      );
    } catch (err) {
      console.error("Assistant chat error:", err);
      setMessages(prev => 
        prev.filter(m => !m.isTyping).concat({
          sender: "ai",
          text: "Gagal terhubung dengan server asisten AI. Silakan periksa jaringan Anda atau coba kembali.",
          time: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
        })
      );
    } finally {
      setIsLoading(false);
    }
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
                  <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 text-xs sm:text-sm ${
                    isAi 
                      ? "bg-slate-100 text-slate-800 rounded-tl-none" 
                      : "bg-[#4B6BFB] text-white rounded-tr-none"
                  }`}>
                    {msg.isTyping ? (
                      <div className="flex items-center gap-1.5 py-1 px-0.5">
                        <span className="h-2 w-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                        <span className="h-2 w-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                        <span className="h-2 w-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-1.5 break-words">
                          {renderMarkdownToReact(msg.text, isAi)}
                        </div>
                        <span className={`text-[9px] block text-right mt-2 ${isAi ? "text-slate-400" : "text-blue-200"}`}>
                          {msg.time}
                        </span>
                      </>
                    )}
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
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-foreground text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all placeholder:text-slate-400 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="h-11 w-11 rounded-xl bg-[#4B6BFB] hover:bg-blue-600 text-white flex items-center justify-center transition-all shadow-md shadow-blue-500/10 cursor-pointer disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed"
            >
              <span className="material-icons text-base">
                {isLoading ? "hourglass_empty" : "send"}
              </span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

function renderMarkdownToReact(text: string, isAi: boolean): React.ReactNode {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  
  let currentTableRows: string[][] = [];
  let inTable = false;
  
  let currentListItems: React.ReactNode[] = [];
  let inList = false;

  const flushTable = (key: string) => {
    if (currentTableRows.length > 0) {
      let headerRow = null;
      let bodyRows = [];
      
      const rowsToProcess = [...currentTableRows];
      if (
        rowsToProcess.length > 1 && 
        rowsToProcess[1].every((cell: string) => cell.trim().startsWith("---") || cell.trim() === "")
      ) {
        headerRow = rowsToProcess[0];
        bodyRows = rowsToProcess.slice(2);
      } else {
        bodyRows = rowsToProcess;
      }

      elements.push(
        <div key={`table-${key}`} className="overflow-x-auto my-3 border border-slate-200 rounded-xl bg-white shadow-sm max-w-full">
          <table className="min-w-full text-[11px] sm:text-xs text-left text-slate-700 divide-y divide-slate-200">
            {headerRow && (
              <thead className="bg-slate-50 text-[9px] sm:text-[10px] uppercase font-bold text-slate-500">
                <tr>
                  {headerRow.map((cell: string, idx: number) => (
                    <th key={`th-${idx}`} className="px-3 py-2 font-bold border-b border-slate-200">{parseInlineMarkdown(cell)}</th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody className="divide-y divide-slate-100">
              {bodyRows.map((row: string[], rowIdx: number) => (
                <tr key={`tr-${rowIdx}`} className={rowIdx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                  {row.map((cell: string, cellIdx: number) => (
                    <td key={`td-${cellIdx}`} className="px-3 py-1.5 border-r last:border-r-0 border-slate-100">{parseInlineMarkdown(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      currentTableRows = [];
      inTable = false;
    }
  };

  const flushList = (key: string) => {
    if (currentListItems.length > 0) {
      elements.push(
        <ul key={`list-${key}`} className={`list-disc pl-5 my-2 space-y-1.5 ${isAi ? "text-slate-700" : "text-blue-50"} leading-relaxed`}>
          {currentListItems}
        </ul>
      );
      currentListItems = [];
      inList = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Table checking
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      if (inList) flushList(`list-before-table-${i}`);
      inTable = true;
      const cells = line.split("|").slice(1, -1).map(c => c.trim());
      currentTableRows.push(cells);
      continue;
    } else {
      if (inTable) {
        flushTable(`table-end-${i}`);
      }
    }

    // List item checking
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      inList = true;
      const charIndex = line.indexOf("- ") !== -1 ? line.indexOf("- ") + 2 : line.indexOf("* ") + 2;
      const content = line.substring(charIndex);
      currentListItems.push(
        <li key={`li-${i}`} className="leading-relaxed">
          {parseInlineMarkdown(content)}
        </li>
      );
      continue;
    } else {
      if (inList) {
        flushList(`list-end-${i}`);
      }
    }

    // Paragraph rendering
    if (trimmed !== "") {
      elements.push(
        <p key={`p-${i}`} className={`leading-relaxed my-1 ${isAi ? "text-slate-700" : "text-white"}`}>
          {parseInlineMarkdown(line)}
        </p>
      );
    }
  }

  flushTable("final-table");
  flushList("final-list");

  return elements;
}

function parseInlineMarkdown(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={idx} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}
