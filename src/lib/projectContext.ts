export const projectContext = {
  projectName: "Smart Marine Safety Vest (SMS-Vest)",
  projectDescription: "Sistem monitoring keselamatan maritim pintar untuk nelayan Pantai Sine, Tulungagung menggunakan rompi keselamatan sensorik dan transmisi radio LoRa SX1262 jarak jauh (hingga 25 km) ke gateway stasiun pangkalan darat, dianalisis secara real-time dengan asisten kecerdasan buatan.",
  
  hardwareComponents: {
    vest: [
      { name: "ESP32 DevKit V1 (ESP32-WROOM-32)", description: "Pengendali utama berbasis Wi-Fi & Bluetooth yang mengelola pembacaan sensor dan penjadwalan telemetri.", priceUSD: 7.10, priceIDR: 110000 },
      { name: "Modul LoRa SX1262 (Rompi)", description: "Modul komunikasi radio nirkabel jarak jauh berdaya rendah untuk mengirim paket data ke base station pantai.", priceUSD: 7.70, priceIDR: 120000 },
      { name: "Antena LoRa 868/915 MHz (SMA)", description: "Antena SMA berfrekuensi 868/915 MHz untuk mengoptimalkan pancaran sinyal komunikasi nirkabel LoRa.", priceUSD: 3.20, priceIDR: 50000 },
      { name: "Modul GPS u-blox NEO-M8N", description: "Modul navigasi satelit untuk melacak koordinat lintang, bujur, dan kecepatan nelayan melaut secara presisi.", priceUSD: 11.30, priceIDR: 175000 },
      { name: "MPU6050 (Accelerometer + Gyroscope)", description: "Sensor gerak 6-axis yang mengukur kemiringan dan percepatan tubuh nelayan untuk deteksi jatuh dan diam tanpa gerak.", priceUSD: 1.60, priceIDR: 25000 },
      { name: "Sensor Detak Jantung & SpO₂ (MAX30102)", description: "Sensor optik untuk mendeteksi denyut jantung dan persentase kejenuhan oksigen (SpO₂) dalam darah.", priceUSD: 2.90, priceIDR: 45000 },
      { name: "Sensor Suhu DS18B20", description: "Sensor suhu digital kedap air untuk memantau suhu tubuh nelayan dan suhu air laut sekitar.", priceUSD: 1.30, priceIDR: 20000 },
      { name: "BME280", description: "Mengukur parameter cuaca lokal termasuk suhu udara sekitar, kelembapan, dan tekanan udara (hPa).", priceUSD: 4.80, priceIDR: 75000 },
      { name: "Sirkuit Monitoring Baterai (Voltage Divider)", description: "Sirkuit pembagi tegangan analog-ke-digital untuk memantau kapasitas tegangan baterai rompi.", priceUSD: 0.60, priceIDR: 10000 },
      { name: "Baterai 18650 + Holder + BMS", description: "Sistem catu daya mandiri rompi lengkap dengan proteksi arus (BMS) dan port pengisian daya.", priceUSD: 7.70, priceIDR: 120000 },
      { name: "Tombol SOS + LED RGB + Buzzer", description: "Tombol darurat fisik nelayan, indikator status RGB, dan buzzer alarm suara lokal.", priceUSD: 1.60, priceIDR: 25000 },
      { name: "Casing Waterproof IP67 & Aksesori", description: "Casing pelindung kedap air yang mengapung beserta komponen pelindung tambahan.", priceUSD: 14.90, priceIDR: 230000 },
      { name: "Rompi Keselamatan (Life Vest)", description: "Rompi pelampung fisik sebagai penopang keselamatan utama dan tempat pemasangan modul elektronik.", priceUSD: 5.80, priceIDR: 90000 },
      { name: "Sistem Pemanas Tubuh (Heating System)", description: "Elemen pemanas mikro terintegrasi untuk memberikan kehangatan fisik aktif jika terdeteksi risiko hipotermia.", priceUSD: 8.40, priceIDR: 130000 }
    ],
    baseStation: [
      { name: "ESP32 DevKit V1 (ESP32-WROOM-32) (Gateway)", description: "Pusat pengendali base station yang menerima paket radio dan meneruskannya ke backend via Ethernet.", priceUSD: 7.10, priceIDR: 110000 },
      { name: "Modul LoRa SX1262 (Base Station)", description: "Penerima radio stasiun pangkalan pantai yang terus mendengarkan siaran data telemetri dari rompi nelayan.", priceUSD: 7.70, priceIDR: 120000 },
      { name: "Antena LoRa Outdoor (5–8 dBi)", description: "Antena tiang luar ruangan dengan penguatan sinyal tinggi untuk menangkap transmisi LoRa hingga 25 km.", priceUSD: 16.10, priceIDR: 250000 },
      { name: "Modul Ethernet W5500 & Wi-Fi", description: "Modul komunikasi jaringan kabel LAN berbasis W5500 untuk pengiriman data andal ke server komando.", priceUSD: 4.80, priceIDR: 75000 },
      { name: "Adaptor 12V + Converter Buck LM2596", description: "Catu daya 12V DC beserta modul regulator step-down penurun tegangan menjadi 5V/3.3V yang stabil.", priceUSD: 2.10, priceIDR: 32000 },
      { name: "Casing IP66 Waterproof & LED Indikator Status", description: "Kotak panel luar ruangan tahan cuaca dengan 3 unit LED indikator penanda status online stasiun.", priceUSD: 8.30, priceIDR: 129000 }
    ],
    software: [
      { name: "Langganan OpenAI ChatGPT API", description: "API Key untuk asisten diagnosa AI, memproses parameter kesehatan sensor, deteksi tingkat kelelahan, dan anomali secara cerdas.", priceUSD: 5.00, priceIDR: 78000 }
    ]
  },

  totals: {
    vestTotalUSD: 78.90,
    vestTotalIDR: 1225000,
    baseStationTotalUSD: 46.20,
    baseStationTotalIDR: 716000,
    softwareTotalUSD: 5.00,
    softwareTotalIDR: 78000
  },

  systemArchitecture: [
    { step: 1, label: "Pengumpulan Data Sensor Rompi", description: "MAX30102 (detak jantung/SpO₂), MAX30205 (suhu tubuh), dan MPU6050 mengukur fisiologi & gerak nelayan." },
    { step: 2, label: "Logika Keputusan Lokal", description: "ESP32-S3 pada rompi memantau nilai ambang batas kritis (seperti SpO₂ < 94%, detak jantung abnormal, jatuh terendam air, atau diam tanpa gerak) untuk memicu peringatan dini." },
    { step: 3, label: "Transmisi Telemetri LoRa 920 MHz", description: "Modul transceiver LoRa SX1262 mengirim paket data nirkabel jarak jauh melewati permukaan laut ke stasiun darat tanpa bergantung pada sinyal seluler." },
    { step: 4, label: "Penerusan Data Stasiun Darat", description: "Gateway stasiun pantai Pantai Sine menerima paket LoRa, mengonfirmasi data, dan meneruskannya ke backend/cloud via modul Ethernet W5500." },
    { step: 5, label: "Dasbor Operator & Analisis AI", description: "Dasbor menampilkan status kesehatan, koordinat GPS, peta visual, tren sinyal, serta mengaktifkan asisten AI Copilot untuk mendeteksi risiko kecelakaan maritim." }
  ],

  coastalBaseStation: {
    location: "Pantai Sine, Tulungagung",
    rangeKm: 25,
    connectedDevicesMax: 10,
    signalQualityOptimal: "95%"
  }
};
