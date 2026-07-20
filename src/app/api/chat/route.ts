import { NextResponse } from "next/server";
import { projectContext } from "@/lib/projectContext";

export async function POST(req: Request) {
  try {
    const { message, history, fleetState } = await req.json();
    const groqKey = process.env.GROQ_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    // Filter history to prevent consecutive assistant messages (alternating roles rule)
    const cleanHistory = (history || []).filter((h: any, idx: number) => {
      if (idx === 0 && h.role === "model") return false;
      return h.parts?.[0]?.text?.trim() !== "";
    });

    // Sanitize fleetState to strip out massive path histories and prevent 413 Context/Token Limit Errors
    const sanitizedFishermen = (fleetState?.fishermen || []).map((f: any) => {
      const { path, ...rest } = f;
      return rest;
    });
    const sanitizedFleetState = {
      ...fleetState,
      fishermen: sanitizedFishermen,
      alerts: (fleetState?.alerts || []).slice(0, 10)
    };

    // System instruction prompt with embedded RAG context
    const systemPrompt = "Anda adalah Copilot Keselamatan AI untuk sistem monitoring Smart Marine Safety Vest (SMS-Vest) di perairan Pantai Sine, Tulungagung.\n" +
                         "Anda bertugas mendampingi operator dalam menganalisis data telemetri LoRa nelayan secara real-time.\n" +
                         "Jawablah dengan bahasa Indonesia yang santun, profesional, ringkas, dan langsung pada intinya.\n" +
                         "Gunakan pemformatan markdown (bullet points, bold text, dll) agar informasi mudah dibaca.\n" +
                         "Prioritaskan keselamatan jiwa nelayan. Jika ada nelayan dengan status 'emergency' atau 'warning' (seperti SpO2 rendah, detak jantung anomali, terendam air/fall overboard), sebutkan nama mereka dan desak operator untuk mengambil tindakan darurat segera.\n\n" +
                         "BERIKUT ADALAH KONTEN KNOWLEDGE BASE RESMI MENGENAI HARDWARE, HARGA, DAN ARSITEKTUR KAMI UNTUK DITELITI (RAG):\n" +
                         JSON.stringify(projectContext, null, 2);

    // 1. Call Groq API if GROQ_API_KEY is present
    if (groqKey) {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${groqKey}`
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            {
              role: "user",
              content: `Berikut adalah data status armada real-time saat ini:\n\nNelayan:\n${JSON.stringify(sanitizedFleetState?.fishermen, null, 2)}\n\nKapal:\n${JSON.stringify(sanitizedFleetState?.boats, null, 2)}\n\nPeringatan Darurat:\n${JSON.stringify(sanitizedFleetState?.alerts, null, 2)}\n\nRompi:\n${JSON.stringify(sanitizedFleetState?.vests, null, 2)}`
            },
            {
              role: "assistant",
              content: "Terima kasih atas data telemetri real-time yang diberikan. Saya telah memproses informasi ini dan siap menjawab pertanyaan Anda mengenai status nelayan, spesifikasi komponen hardware, harga alat, arsitektur sistem, dan prosedur keselamatan Pantai Sine."
            },
            ...cleanHistory.slice(-6).map((h: any) => ({
              role: h.role === "model" ? "assistant" : "user",
              content: h.parts?.[0]?.text || ""
            })),
            {
              role: "user",
              content: message
            }
          ],
          temperature: 0.1, // Low temperature for maximum accuracy on specs & prices
          max_tokens: 1000
        })
      });

      if (response.ok) {
        const resJson = await response.json();
        const generatedText = resJson?.choices?.[0]?.message?.content;
        if (generatedText) {
          return NextResponse.json({
            text: generatedText,
            provider: "groq"
          });
        }
      } else {
        const errText = await response.text();
        console.error("Groq API returned error status:", response.status, errText);
      }
      console.warn("Groq API response failed, falling back to other providers...");
    }

    // 2. Call Google Gemini API if GEMINI_API_KEY is present
    if (geminiKey) {
      const systemInstruction = {
        parts: [{ text: systemPrompt }]
      };

      const contents = [
        {
          role: "user",
          parts: [{
            text: `Halo, berikut adalah data status armada real-time saat ini:\n\nNelayan:\n${JSON.stringify(sanitizedFleetState?.fishermen, null, 2)}\n\nKapal:\n${JSON.stringify(sanitizedFleetState?.boats, null, 2)}\n\nPeringatan Darurat:\n${JSON.stringify(sanitizedFleetState?.alerts, null, 2)}\n\nRompi:\n${JSON.stringify(sanitizedFleetState?.vests, null, 2)}`
          }]
        },
        {
          role: "model",
          parts: [{
            text: "Terima kasih atas data telemetri real-time yang diberikan. Saya telah memproses informasi ini dan siap menjawab pertanyaan Anda mengenai status nelayan, spesifikasi komponen hardware, harga alat, arsitektur sistem, dan prosedur keselamatan Pantai Sine."
          }]
        },
        ...cleanHistory.slice(-6),
        {
          role: "user",
          parts: [{ text: message }]
        }
      ];

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents,
            systemInstruction,
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 1000,
            },
          }),
        }
      );

      if (response.ok) {
        const resJson = await response.json();
        const generatedText = resJson?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (generatedText) {
          return NextResponse.json({
            text: generatedText,
            provider: "gemini"
          });
        }
      }
      console.warn("Gemini API response failed, falling back to local fallback...");
    }

    // 3. Local fallback as final option
    const localResponse = getLocalResponse(message, sanitizedFleetState);
    return NextResponse.json({
      text: `[Sistem: Menggunakan analisis asisten offline lokal]\n\n${localResponse}`,
      provider: "local"
    });

  } catch (error: any) {
    console.error("API Chat route handler error:", error);
    return NextResponse.json(
      { text: `Terjadi kesalahan saat memproses permintaan AI: ${error?.message || "Internal Server Error"}` },
      { status: 500 }
    );
  }
}

function getLocalResponse(message: string, fleetState: any): string {
  const lower = message.toLowerCase();
  const fishermen = fleetState?.fishermen || [];

  // 1. Check if user asks about components, pricing, or BOM
  if (lower.includes("harga") || lower.includes("komponen") || lower.includes("alat") || lower.includes("biaya") || lower.includes("bom") || lower.includes("sensor") || lower.includes("spesifikasi") || lower.includes("suku cadang")) {
    const vestRows = projectContext.hardwareComponents.vest.map(v => 
      `| ${v.name} | ${v.description} | Rp ${v.priceIDR.toLocaleString('id-ID')} / $${v.priceUSD.toFixed(2)} |`
    ).join("\n");
    const baseRows = projectContext.hardwareComponents.baseStation.map(b => 
      `| ${b.name} | ${b.description} | Rp ${b.priceIDR.toLocaleString('id-ID')} / $${b.priceUSD.toFixed(2)} |`
    ).join("\n");
    const swRows = (projectContext.hardwareComponents as any).software.map((s: any) => 
      `| ${s.name} | ${s.description} | Rp ${s.priceIDR.toLocaleString('id-ID')} / $${s.priceUSD.toFixed(2)} |`
    ).join("\n");

    return `Berikut adalah spesifikasi perangkat keras, perangkat lunak, & anggaran biaya (BOM) sistem **${projectContext.projectName}**:\n\n` +
      `### 1. Komponen Rompi Keselamatan Nelayan (Total: Rp ${projectContext.totals.vestTotalIDR.toLocaleString('id-ID')} / $${projectContext.totals.vestTotalUSD.toFixed(2)})\n` +
      `| Nama Komponen | Deskripsi Fungsi | Estimasi Harga |\n` +
      `| :--- | :--- | :--- |\n` +
      vestRows + `\n\n` +
      `### 2. Komponen Gateway Stasiun Pangkalan (Total: Rp ${projectContext.totals.baseStationTotalIDR.toLocaleString('id-ID')} / $${projectContext.totals.baseStationTotalUSD.toFixed(2)})\n` +
      `| Nama Komponen | Deskripsi Fungsi | Estimasi Harga |\n` +
      `| :--- | :--- | :--- |\n` +
      baseRows + `\n\n` +
      `### 3. Layanan Software & API (Total: Rp ${projectContext.totals.softwareTotalIDR.toLocaleString('id-ID')} / $${projectContext.totals.softwareTotalUSD.toFixed(2)})\n` +
      `| Nama Layanan | Deskripsi Fungsi | Estimasi Harga |\n` +
      `| :--- | :--- | :--- |\n` +
      swRows + `\n\n` +
      `*Informasi*: Transmisi dilakukan menggunakan modul LoRa SX1262 nirkabel dengan jangkauan optimal hingga ${projectContext.coastalBaseStation.rangeKm} km di perairan ${projectContext.coastalBaseStation.location}.`;
  }

  // 2. Check if user asks about system architecture or flow
  if (lower.includes("arsitektur") || lower.includes("alur") || lower.includes("cara kerja") || lower.includes("sistem") || lower.includes("proses")) {
    const flowList = projectContext.systemArchitecture.map(s => `${s.step}. **${s.label}**\n   ${s.description}`).join("\n\n");
    return `Berikut adalah alur simulasi transmisi data telemetri pada sistem kami:\n\n${flowList}`;
  }

  // 3. Check if user asks about location (di mana / lokasi / koordinat)
  if (lower.includes("lokasi") || lower.includes("koordinat") || lower.includes("dimana") || lower.includes("di mana")) {
    const found = fishermen.find((f: any) => lower.includes(f.name.toLowerCase()) || lower.includes(f.id.toLowerCase()));
    if (found) {
      if (found.status === "offline") {
        return `Nelayan **${found.name}** sedang offline. Koordinat GPS terakhir yang tercatat di dasbor adalah Lintang **${found.lat.toFixed(5)}**, Bujur **${found.lng.toFixed(5)}** (${found.distanceFromShore} km dari darat). Peta tidak menerima sinyal aktif.`;
      }
      return `**Informasi Lokasi Nelayan: ${found.name}** (${found.assignedVestId})
- **Koordinat Saat Ini**: Lintang **${found.lat.toFixed(5)}**, Bujur **${found.lng.toFixed(5)}**
- **Jarak Dari Pantai Sine**: **${found.distanceFromShore} km**
- **Haluan Kapal**: **${found.heading}°** (Kecepatan: **${found.speed} Knot**)

*Rekomendasi AI*: Nelayan terpantau aktif. Posisi kapal ter-update secara real-time di halaman Peta Dasbor.`;
    }
    
    // Default show list of coordinates
    const activeCoords = fishermen
      .filter((f: any) => f.status !== "offline")
      .map((f: any) => `- **${f.name}**: Koordinat ${f.lat.toFixed(5)}, ${f.lng.toFixed(5)} (${f.distanceFromShore} km dari Pantai Sine)`)
      .join("\n");
    
    return `Berikut adalah koordinat lokasi real-time nelayan yang saat ini sedang aktif melaut:\n\n${activeCoords || "Tidak ada nelayan aktif melaut."}\n\n*Catatan*: Silakan ketik nama nelayan secara spesifik (misal: *"dimana Budi?"*) untuk rincian posisi.`;
  }

  // 4. Check if user asks if vest is still worn/active (dipakai / aktif)
  if (lower.includes("dipakai") || lower.includes("masih dipakai") || lower.includes("pakai") || lower.includes("digunakan")) {
    const found = fishermen.find((f: any) => lower.includes(f.name.toLowerCase()) || lower.includes(f.id.toLowerCase()));
    if (found) {
      if (found.status === "offline") {
        return `Nelayan **${found.name}** terdeteksi tidak mengenakan rompi secara aktif (atau rompi kehabisan baterai/offline). Status: **Offline**.`;
      }
      return `Rompi keselamatan **${found.assignedVestId}** saat ini sedang **Aktif Digunakan** oleh **${found.name}**. 
- Sensor detak jantung & SpO₂ mendeteksi denyut fisik secara langsung.
- Kondisi sensor air rompi saat ini adalah **${found.waterDetected ? "🚨 BASAH (Terendam Air)" : "KERING"}**.`;
    }
    const activeVests = fishermen.filter((f: any) => f.status !== "offline").length;
    return `Saat ini terdapat **${activeVests} unit rompi keselamatan** yang sedang aktif digunakan dan mengirimkan telemetri ke stasiun darat Pantai Sine.`;
  }

  // 5. Check if user asks about safety vest utility or importance
  if (lower.includes("berguna") || lower.includes("penting") || lower.includes("manfaat") || lower.includes("fungsi vest") || lower.includes("mengapa")) {
    return `**Mengapa Sistem Smart Marine Safety Vest (SMS-Vest) Ini Sangat Penting & Berguna?**

1. **Deteksi Fisiologis Otomatis**: Mengukur denyut jantung & SpO₂ (kadar oksigen) nelayan secara real-time dengan sensor MAX30102 untuk mencegah kelelahan berlebih.
2. **Koneksi Mandiri Tanpa Internet**: Menggunakan modul radio LoRa SX1262 dengan jangkauan nirkabel optimal hingga **25 km** langsung ke Pantai Sine, bebas dari ketergantungan sinyal GSM seluler.
3. **Penyelamatan Darurat Mandiri**: Tombol SOS fisik dan deteksi jatuh ke laut (fall overboard) secara instan mengirimkan sinyal koordinat GPS u-blox ke operator jika nelayan mengalami kecelakaan.
4. **Pencegahan Hipotermia**: Memonitor suhu tubuh secara berkala untuk mendeteksi penurunan suhu ekstrem jika nelayan terendam air laut.`;
  }

  // 6. Search for specific fisherman (general stats & reasoning)
  const foundFisherman = fishermen.find((f: any) => 
    lower.includes(f.name.toLowerCase()) || 
    lower.includes(f.id.toLowerCase())
  );

  if (foundFisherman) {
    if (foundFisherman.status === "offline") {
      return `Nelayan **${foundFisherman.name}** (${foundFisherman.id}) terdeteksi sedang **Offline**. Waktu bersandar terakhir terdaftar adalah pukul ${foundFisherman.tripDepartureTime || "05:00"}. Rompi tidak mengirimkan sinyal telemetri.`;
    }
    const statusText = foundFisherman.status === "emergency" ? "DARURAT KRITIS 🚨" : foundFisherman.status === "warning" ? "PERINGATAN AKTIF ⚠️" : "AMAN / NORMAL ✅";
    
    // Reasoning about why they are warning/emergency
    let reasonText = "";
    if (foundFisherman.status === "emergency") {
      if (foundFisherman.waterDetected) {
        reasonText = "Terjadi kecelakaan! Sensor air mendeteksi rompi basah/terendam air laut (nelayan jatuh dari kapal/fall overboard). SpO₂ darah rendah.";
      } else {
        reasonText = "Nelayan menekan tombol SOS darurat fisik atau detak jantung melesat tinggi secara abnormal.";
      }
    } else if (foundFisherman.status === "warning") {
      if (foundFisherman.fatigue === "High Fatigue") {
        reasonText = "Tingkat kelelahan nelayan berada pada tingkat kritis (Sangat Lelah) karena durasi melaut sudah terlalu lama.";
      } else if (foundFisherman.temperature < 35.8) {
        reasonText = "Suhu tubuh terdeteksi dingin (di bawah 35.8°C), menandakan adanya risiko hipotermia.";
      } else {
        reasonText = "Detak jantung nelayan atau tingkat kelembapan rompi menunjukkan indikasi anomali ringan.";
      }
    } else {
      reasonText = "Seluruh indikator fisiologis (SpO₂, suhu tubuh, detak jantung) dan sensor lingkungan dalam batas normal.";
    }

    return `**Analisis Keadaan Nelayan: ${foundFisherman.name}**
- **Status Rompi**: ${statusText}
- **Penyebab / Reasoning**: ${reasonText}
- **Fisiologi Medis**: Detak Jantung: **${foundFisherman.heartRate} BPM**, SpO₂: **${foundFisherman.spo2}%**, Suhu Tubuh: **${foundFisherman.temperature}°C**.
- **Indikator Sensor**:
  - Kelelahan: **${foundFisherman.fatigue === "High Fatigue" ? "Sangat Lelah (Kritis)" : foundFisherman.fatigue === "Moderate Fatigue" ? "Lelah Sedang" : "Aman / Bugar"}**
  - Risiko Hipotermia: **${foundFisherman.hypothermiaRisk === "High Risk" ? "Tinggi (Kritis)" : foundFisherman.hypothermiaRisk === "Low Risk" ? "Rendah" : "Aman"}**
  - Sensor Air: **${foundFisherman.waterDetected ? "Terendam Air Laut (Jatuh)" : "Kering"}**
- **Info Perjalanan**: Jarak: **${foundFisherman.tripDistance} km**, Koordinat: **${foundFisherman.lat.toFixed(5)}, ${foundFisherman.lng.toFixed(5)}**, Sisa Baterai: **${foundFisherman.battery}%**.

*Rekomendasi AI*: ${
      foundFisherman.status === "emergency" 
        ? "Segera instruksikan kapal penyelamat terdekat untuk melakukan pertolongan SAR ke koordinat nelayan!" 
        : foundFisherman.spo2 < 95 
        ? "Deteksi kadar oksigen rendah. Minta nelayan beristirahat di dek kapal." 
        : "Parameter kesehatan nelayan terpantau aman dan stabil."
    }`;
  }

  // 7. Who is in danger (with reasoning)
  if (lower.includes("siapa") || lower.includes("bahaya") || lower.includes("darurat") || lower.includes("risiko") || lower.includes("alert") || lower.includes("kritis")) {
    const dangerFishers = fishermen.filter((f: any) => f.status === "emergency" || f.status === "warning");
    if (dangerFishers.length === 0) {
      return "Saat ini semua nelayan terpantau **Aman & Stabil**. Tidak ada anomali SpO₂, detak jantung abnormal, atau pemicu sensor jatuh ke air.";
    }
    return `Berikut adalah daftar nelayan yang membutuhkan perhatian khusus:\n\n` +
      dangerFishers.map((f: any, idx: number) => {
        let reason = f.waterDetected ? "Terendam air (Jatuh)" : f.fatigue === "High Fatigue" ? "Sangat Lelah" : f.temperature < 35.8 ? "Risiko Hipotermia" : "Detak jantung tinggi";
        return `${idx + 1}. **${f.name}** (${f.assignedVestId}): Status **${f.status.toUpperCase()}**.\n` +
               `   - **Reasoning**: ${reason} (Koordinat: ${f.lat.toFixed(5)}, ${f.lng.toFixed(5)})\n` +
               `   - Medis: SpO₂ **${f.spo2}%**, Detak Jantung **${f.heartRate} BPM**, Suhu: **${f.temperature}°C**`;
      }).join("\n\n") + 
      `\n\n*Rekomendasi AI*: Hubungi kontak darurat nelayan terkait atau arahkan kapal terdekat ke koordinat mereka.`;
  }

  // 8. Average statistics
  if (lower.includes("rata") || lower.includes("oksigen") || lower.includes("spo2") || lower.includes("rata-rata")) {
    const active = fishermen.filter((f: any) => f.status !== "offline");
    if (active.length === 0) return "Tidak ada nelayan yang sedang aktif melaut saat ini.";
    const avgSpo2 = Math.round(active.reduce((sum: number, f: any) => sum + f.spo2, 0) / active.length);
    const avgHR = Math.round(active.reduce((sum: number, f: any) => sum + f.heartRate, 0) / active.length);
    return `**Laporan Rata-Rata Telemetri Armada**:\n` +
      `- Jumlah Nelayan Aktif: **${active.length} orang**\n` +
      `- Rata-rata Oksigen (SpO₂): **${avgSpo2}%**\n` +
      `- Rata-rata Detak Jantung: **${avgHR} BPM**\n\n` +
      `Seluruh data biometrik ini dipantau secara nirkabel melalui sensor MAX30102 pada rompi keselamatan.`;
  }

  // 9. Default response
  const activeCount = fishermen.filter((f: any) => f.status !== "offline").length;
  const criticalCount = fishermen.filter((f: any) => f.status === "emergency").length;
  const warningCount = fishermen.filter((f: any) => f.status === "warning").length;

  return `Berikut adalah rangkuman status armada saat ini:
- Nelayan Aktif Melaut: **${activeCount} orang**
- Status Kritis (Emergency): **${criticalCount} orang** 🚨
- Status Peringatan (Warning): **${warningCount} orang** ⚠️

Apakah Anda ingin memeriksa kondisi nelayan tertentu secara spesifik? Silakan ketik nama nelayan (misal: 'Sutarno', 'Budi', atau 'Hendro') atau tanyakan *"Siapa yang bahaya?"*`;
}
