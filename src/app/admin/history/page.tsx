"use client";

import { useEffect, useState } from "react";
import { simulator, Fisherman } from "@/lib/mockData";

export default function HistoryPlaybackPage() {
  const [fishermen, setFishermen] = useState<Fisherman[]>([]);
  const [selectedFisherId, setSelectedFisherId] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  useEffect(() => {
    const syncFishermen = () => {
      const all = simulator.getFishermen();
      setFishermen(all);
      if (all.length > 0 && !selectedFisherId) {
        setSelectedFisherId(all[0].id);
      }
    };
    syncFishermen();
    return simulator.subscribe(syncFishermen);
  }, [selectedFisherId]);

  const activeFisherObj = fishermen.find(f => f.id === selectedFisherId);
  const pathCoordinates = activeFisherObj ? activeFisherObj.path : [];

  useEffect(() => {
    if (!isPlaying || pathCoordinates.length === 0) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= pathCoordinates.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1000 / playbackSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, pathCoordinates, playbackSpeed]);

  const handlePlayPause = () => {
    if (currentStep >= pathCoordinates.length - 1) {
      setCurrentStep(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleSliderChange = (val: number) => {
    setCurrentStep(val);
  };

  const currentCoords = pathCoordinates[currentStep] || [0, 0];

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Pemutaran Rute Nelayan</h1>
        <p className="text-sm text-slate-500 mt-1">Memutar kembali koordinat perjalanan GPS dan data biometrik nelayan</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Controls */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between gap-6" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4 border-b border-slate-100 pb-3">Kontrol Pemutaran</h3>
            
            <div className="space-y-4 text-xs">
              {/* Select Fisherman */}
              <div>
                <label className="block text-xs text-slate-500 font-semibold mb-2">Pilih Nelayan</label>
                <select
                  value={selectedFisherId}
                  onChange={(e) => {
                    setSelectedFisherId(e.target.value);
                    setCurrentStep(0);
                    setIsPlaying(false);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm text-foreground focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 font-medium"
                >
                  {fishermen.map((f) => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>

              {/* Playback Speed */}
              <div>
                <label className="block text-xs text-slate-500 font-semibold mb-2">Kecepatan Pemutaran</label>
                <div className="grid grid-cols-3 gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1 text-center text-sm font-medium">
                  {[1, 2, 4].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => setPlaybackSpeed(speed)}
                      className={`py-2 rounded-lg transition-all ${
                        playbackSpeed === speed ? "bg-[#4B6BFB] text-white shadow-sm font-bold" : "text-slate-500 hover:text-foreground"
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Frame Info */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2.5">
            <span className="text-xs text-slate-400 font-semibold block mb-2">Detail Data Saat Ini</span>
            <div className="flex justify-between">
              <span className="text-slate-500">Posisi Pemutaran</span>
              <span className="text-foreground font-semibold">Langkah {currentStep + 1} / {pathCoordinates.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Lintang (Latitude)</span>
              <span className="text-foreground font-mono font-semibold">{currentCoords[0].toFixed(6)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Bujur (Longitude)</span>
              <span className="text-foreground font-mono font-semibold">{currentCoords[1].toFixed(6)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Detak Jantung</span>
              <span className="text-foreground font-semibold">{activeFisherObj ? 72 + Math.floor(Math.sin(currentStep) * 4) : 0} BPM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Sisa Daya Baterai</span>
              <span className="text-foreground font-semibold">{activeFisherObj ? Math.round(activeFisherObj.battery) : 0}%</span>
            </div>
          </div>
        </div>

        {/* Playback Area */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between gap-6 min-h-[300px]" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          
          {/* Map Visualization */}
          <div className="flex-1 border border-slate-200 rounded-xl bg-slate-50 p-4 flex flex-col justify-center items-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#E2E8F0_1px,transparent_1px),linear-gradient(to_bottom,#E2E8F0_1px,transparent_1px)] bg-[size:24px_24px] opacity-30"></div>
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-44 w-44 rounded-full border border-blue-200/30 animate-ping"></div>

            <div className="relative z-10 text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto">
                <span className="material-icons text-blue-500 text-3xl animate-bounce">sailing</span>
              </div>
              <div className="text-sm text-slate-500">
                <span className="font-mono text-foreground font-semibold">{currentCoords[0].toFixed(5)}</span>
                {" • "}
                <span className="font-mono text-foreground font-semibold">{currentCoords[1].toFixed(5)}</span>
              </div>
            </div>
          </div>

          {/* Timeline controls */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <button
                onClick={handlePlayPause}
                className="h-10 w-10 rounded-xl bg-[#4B6BFB] hover:bg-[#3B5BEB] text-white flex items-center justify-center shadow-md shadow-blue-500/10 transition-all cursor-pointer"
              >
                <span className="material-icons text-lg">{isPlaying ? "pause" : "play_arrow"}</span>
              </button>

              <input
                type="range"
                min="0"
                max={Math.max(0, pathCoordinates.length - 1)}
                value={currentStep}
                onChange={(e) => handleSliderChange(parseInt(e.target.value))}
                className="flex-1 accent-blue-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            <div className="flex justify-between text-xs text-slate-500">
              <span>Mulai</span>
              <span>Waktu Berjalan: {currentStep * 5} Detik</span>
              <span>Selesai</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
