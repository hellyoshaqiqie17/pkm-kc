"use client";

export interface Fisherman {
  id: string;
  name: string;
  age: number;
  phone: string;
  emergencyContact: string;
  avatar: string;
  status: "normal" | "warning" | "emergency" | "offline";
  heartRate: number;
  temperature: number;
  speed: number; // knots
  heading: number; // degrees
  distanceFromShore: number; // km
  battery: number; // percentage
  lat: number;
  lng: number;
  assignedBoatId: string;
  assignedVestId: string;
  rssi: number; // signal strength
  packetLoss: number; // percentage
  packetDelay: number; // ms
  lastPacketTime: string;
  sosStatus: "Inactive" | "Active";
  path: [number, number][]; // coordinates history
  
  // New Physiological & Safety parameters
  spo2: number; // SpO2 percentage (90-100)
  fatigue: "Safe" | "Moderate Fatigue" | "High Fatigue";
  hypothermiaRisk: "None" | "Low Risk" | "High Risk";
  fallOverboard: boolean;
  waterDetected: boolean;

  // New environmental sensor (BME280)
  ambientTemp: number; // °C
  ambientHumidity: number; // %
  ambientPressure: number; // hPa

  // New Battery Fuel Gauge (MAX17048)
  batteryRuntime: number; // Estimated hours remaining

  // New Trip Monitoring parameters
  tripDepartureTime: string;
  tripDuration: number; // minutes elapsed
  tripDistance: number; // km travelled
  tripReturnTime?: string;
}

export interface Boat {
  id: string;
  name: string;
  status: "active" | "docked" | "maintenance";
  crewCount: number;
  members: string[];
  avgHealthScore: number;
  lat: number;
  lng: number;
}

export interface Vest {
  id: string;
  battery: number;
  firmware: string;
  lastMaintenance: string;
  activationDate: string;
  frequency: string; // e.g. "920.4 MHz"
  radioId: string;
  calibration: "Calibrated" | "Needs Calibration" | "Faulty";
}

export interface EmergencyAlert {
  id: string;
  fishermanId: string;
  name: string;
  boatName: string;
  vestId: string;
  alertType: 
    | "SOS Button" 
    | "Fall Overboard" 
    | "No Movement" 
    | "Heart Rate Abnormal" 
    | "Temp Abnormal" 
    | "Low Battery" 
    | "Lost Signal" 
    | "Low SpO2" 
    | "High Fatigue" 
    | "Hypothermia Risk" 
    | "Outside Fishing Area";
  time: string;
  priority: "high" | "medium" | "low";
  lat: number;
  lng: number;
  status: "active" | "dispatched" | "resolved";
}

export interface BaseStation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radius: number; // coverage radius in meters
  connectedDevices: number;
  signalQuality: number;
  status: "online" | "offline";
}

// Initial mock coordinates centered around Laut Pucang Laban / Pantai Sine, Tulungagung
const BASE_LAT = -8.285;
const BASE_LNG = 111.995;

const INITIAL_FISHERMEN: Fisherman[] = [
  {
    id: "fish-1",
    name: "Sutarno Wijaya",
    age: 48,
    phone: "+62 812-3456-7890",
    emergencyContact: "Rina Wijaya (Istri) - 0812-9876-5432",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sutarno",
    status: "normal",
    heartRate: 72,
    temperature: 36.5,
    speed: 4.8,
    heading: 235,
    distanceFromShore: 4.2,
    battery: 88,
    lat: -8.295,
    lng: 111.985,
    assignedBoatId: "boat-1",
    assignedVestId: "vest-101",
    rssi: -72,
    packetLoss: 1.2,
    packetDelay: 120,
    lastPacketTime: "Baru saja",
    sosStatus: "Inactive",
    path: [
      [-8.285, 111.995],
      [-8.290, 111.990],
      [-8.295, 111.985]
    ],
    spo2: 98,
    fatigue: "Safe",
    hypothermiaRisk: "None",
    fallOverboard: false,
    waterDetected: false,
    ambientTemp: 29.2,
    ambientHumidity: 76,
    ambientPressure: 1011,
    batteryRuntime: 42.2,
    tripDepartureTime: "05:15",
    tripDuration: 250,
    tripDistance: 12.4
  },
  {
    id: "fish-2",
    name: "Hendro Prasetyo",
    age: 35,
    phone: "+62 821-2233-4455",
    emergencyContact: "Bambang Prasetyo (Kakak) - 0821-9988-7766",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hendro",
    status: "normal",
    heartRate: 78,
    temperature: 36.8,
    speed: 6.2,
    heading: 180,
    distanceFromShore: 6.8,
    battery: 92,
    lat: -8.315,
    lng: 112.005,
    assignedBoatId: "boat-2",
    assignedVestId: "vest-102",
    rssi: -85,
    packetLoss: 2.5,
    packetDelay: 155,
    lastPacketTime: "2d lalu",
    sosStatus: "Inactive",
    path: [
      [-8.285, 111.995],
      [-8.300, 112.000],
      [-8.315, 112.005]
    ],
    spo2: 99,
    fatigue: "Safe",
    hypothermiaRisk: "None",
    fallOverboard: false,
    waterDetected: false,
    ambientTemp: 28.8,
    ambientHumidity: 79,
    ambientPressure: 1012,
    batteryRuntime: 44.1,
    tripDepartureTime: "05:30",
    tripDuration: 235,
    tripDistance: 15.6
  },
  {
    id: "fish-3",
    name: "Budi Santoso",
    age: 52,
    phone: "+62 857-4455-6677",
    emergencyContact: "Anisa Santoso (Anak) - 0857-1122-3344",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi",
    status: "warning",
    heartRate: 98,
    temperature: 35.5,
    speed: 2.1,
    heading: 45,
    distanceFromShore: 14.5,
    battery: 45,
    lat: -8.345,
    lng: 111.965,
    assignedBoatId: "boat-3",
    assignedVestId: "vest-103",
    rssi: -94,
    packetLoss: 8.4,
    packetDelay: 280,
    lastPacketTime: "4d lalu",
    sosStatus: "Inactive",
    path: [
      [-8.285, 111.995],
      [-8.310, 111.980],
      [-8.345, 111.965]
    ],
    spo2: 94,
    fatigue: "High Fatigue",
    hypothermiaRisk: "High Risk",
    fallOverboard: false,
    waterDetected: true,
    ambientTemp: 24.5,
    ambientHumidity: 85,
    ambientPressure: 1009,
    batteryRuntime: 21.6,
    tripDepartureTime: "04:45",
    tripDuration: 280,
    tripDistance: 24.2
  },
  {
    id: "fish-4",
    name: "Rahmat Hidayat",
    age: 29,
    phone: "+62 813-8899-0011",
    emergencyContact: "Siti Hidayat (Ibu) - 0813-7766-5544",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahmat",
    status: "normal",
    heartRate: 68,
    temperature: 36.2,
    speed: 0.5,
    heading: 90,
    distanceFromShore: 3.5,
    battery: 12,
    lat: -8.300,
    lng: 112.025,
    assignedBoatId: "boat-4",
    assignedVestId: "vest-104",
    rssi: -60,
    packetLoss: 0.1,
    packetDelay: 95,
    lastPacketTime: "Baru saja",
    sosStatus: "Inactive",
    path: [
      [-8.285, 111.995],
      [-8.292, 112.010],
      [-8.300, 112.025]
    ],
    spo2: 98,
    fatigue: "Moderate Fatigue",
    hypothermiaRisk: "None",
    fallOverboard: false,
    waterDetected: false,
    ambientTemp: 29.8,
    ambientHumidity: 74,
    ambientPressure: 1011,
    batteryRuntime: 5.7,
    tripDepartureTime: "06:10",
    tripDuration: 195,
    tripDistance: 6.8
  },
  {
    id: "fish-5",
    name: "Agus Salim",
    age: 41,
    phone: "+62 819-7766-2211",
    emergencyContact: "Dewi Salim (Istri) - 0819-5544-3322",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Agus",
    status: "offline",
    heartRate: 0,
    temperature: 0,
    speed: 0,
    heading: 0,
    distanceFromShore: 8.2,
    battery: 0,
    lat: -8.320,
    lng: 111.945,
    assignedBoatId: "boat-5",
    assignedVestId: "vest-105",
    rssi: -120,
    packetLoss: 100,
    packetDelay: 0,
    lastPacketTime: "25m lalu",
    sosStatus: "Inactive",
    path: [
      [-8.285, 111.995],
      [-8.302, 111.970],
      [-8.320, 111.945]
    ],
    spo2: 0,
    fatigue: "Safe",
    hypothermiaRisk: "None",
    fallOverboard: false,
    waterDetected: false,
    ambientTemp: 0,
    ambientHumidity: 0,
    ambientPressure: 0,
    batteryRuntime: 0,
    tripDepartureTime: "05:00",
    tripDuration: 0,
    tripDistance: 0,
    tripReturnTime: "17:00"
  },
  // Added 5 new fishermen for fleet expansion
  {
    id: "fish-6",
    name: "Sutrisno Widodo",
    age: 42,
    phone: "+62 822-1111-2222",
    emergencyContact: "Hartati Widodo (Istri) - 0822-2222-3333",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sutrisno",
    status: "normal",
    heartRate: 74,
    temperature: 36.4,
    speed: 5.1,
    heading: 260,
    distanceFromShore: 5.1,
    battery: 85,
    lat: -8.290,
    lng: 111.970,
    assignedBoatId: "boat-1",
    assignedVestId: "vest-106",
    rssi: -68,
    packetLoss: 0.5,
    packetDelay: 100,
    lastPacketTime: "Baru saja",
    sosStatus: "Inactive",
    path: [
      [-8.285, 111.995],
      [-8.288, 111.980],
      [-8.290, 111.970]
    ],
    spo2: 97,
    fatigue: "Safe",
    hypothermiaRisk: "None",
    fallOverboard: false,
    waterDetected: false,
    ambientTemp: 29.0,
    ambientHumidity: 75,
    ambientPressure: 1011,
    batteryRuntime: 40.8,
    tripDepartureTime: "05:20",
    tripDuration: 245,
    tripDistance: 11.2
  },
  {
    id: "fish-7",
    name: "Yusuf Mansur",
    age: 38,
    phone: "+62 858-3333-4444",
    emergencyContact: "Zainab Mansur (Ibu) - 0858-4444-5555",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Yusuf",
    status: "normal",
    heartRate: 75,
    temperature: 36.6,
    speed: 4.5,
    heading: 140,
    distanceFromShore: 3.2,
    battery: 90,
    lat: -8.305,
    lng: 112.012,
    assignedBoatId: "boat-2",
    assignedVestId: "vest-107",
    rssi: -70,
    packetLoss: 0.8,
    packetDelay: 115,
    lastPacketTime: "Baru saja",
    sosStatus: "Inactive",
    path: [
      [-8.285, 111.995],
      [-8.295, 112.005],
      [-8.305, 112.012]
    ],
    spo2: 98,
    fatigue: "Safe",
    hypothermiaRisk: "None",
    fallOverboard: false,
    waterDetected: false,
    ambientTemp: 29.1,
    ambientHumidity: 77,
    ambientPressure: 1012,
    batteryRuntime: 43.2,
    tripDepartureTime: "05:45",
    tripDuration: 220,
    tripDistance: 10.8
  },
  {
    id: "fish-8",
    name: "Joko Purwanto",
    age: 50,
    phone: "+62 811-5555-6666",
    emergencyContact: "Lilik Purwanto (Istri) - 0811-6666-7777",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Joko",
    status: "normal",
    heartRate: 70,
    temperature: 36.1,
    speed: 3.8,
    heading: 200,
    distanceFromShore: 7.2,
    battery: 78,
    lat: -8.325,
    lng: 111.990,
    assignedBoatId: "boat-3",
    assignedVestId: "vest-108",
    rssi: -82,
    packetLoss: 1.8,
    packetDelay: 140,
    lastPacketTime: "Just now",
    sosStatus: "Inactive",
    path: [
      [-8.285, 111.995],
      [-8.305, 111.992],
      [-8.325, 111.990]
    ],
    spo2: 97,
    fatigue: "Moderate Fatigue",
    hypothermiaRisk: "None",
    fallOverboard: false,
    waterDetected: false,
    ambientTemp: 28.5,
    ambientHumidity: 80,
    ambientPressure: 1011,
    batteryRuntime: 37.4,
    tripDepartureTime: "05:05",
    tripDuration: 260,
    tripDistance: 14.1
  },
  {
    id: "fish-9",
    name: "Mulyono Saputra",
    age: 33,
    phone: "+62 877-7777-8888",
    emergencyContact: "Endang Saputra (Istri) - 0877-8888-9999",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mulyono",
    status: "normal",
    heartRate: 76,
    temperature: 36.7,
    speed: 5.8,
    heading: 105,
    distanceFromShore: 4.8,
    battery: 89,
    lat: -8.280,
    lng: 112.030,
    assignedBoatId: "boat-4",
    assignedVestId: "vest-109",
    rssi: -65,
    packetLoss: 0.2,
    packetDelay: 98,
    lastPacketTime: "Baru saja",
    sosStatus: "Inactive",
    path: [
      [-8.285, 111.995],
      [-8.282, 112.015],
      [-8.280, 112.030]
    ],
    spo2: 98,
    fatigue: "Safe",
    hypothermiaRisk: "None",
    fallOverboard: false,
    waterDetected: false,
    ambientTemp: 29.5,
    ambientHumidity: 73,
    ambientPressure: 1011,
    batteryRuntime: 42.7,
    tripDepartureTime: "06:00",
    tripDuration: 205,
    tripDistance: 9.5
  },
  {
    id: "fish-10",
    name: "Slamet Hariadi",
    age: 46,
    phone: "+62 899-9999-0000",
    emergencyContact: "Mujiati Hariadi (Istri) - 0899-0000-1111",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Slamet",
    status: "normal",
    heartRate: 73,
    temperature: 36.3,
    speed: 4.2,
    heading: 220,
    distanceFromShore: 5.6,
    battery: 80,
    lat: -8.330,
    lng: 111.975,
    assignedBoatId: "boat-5",
    assignedVestId: "vest-110",
    rssi: -78,
    packetLoss: 1.0,
    packetDelay: 130,
    lastPacketTime: "Baru saja",
    sosStatus: "Inactive",
    path: [
      [-8.285, 111.995],
      [-8.310, 111.985],
      [-8.330, 111.975]
    ],
    spo2: 96,
    fatigue: "Safe",
    hypothermiaRisk: "None",
    fallOverboard: false,
    waterDetected: false,
    ambientTemp: 28.7,
    ambientHumidity: 78,
    ambientPressure: 1011,
    batteryRuntime: 38.4,
    tripDepartureTime: "05:10",
    tripDuration: 255,
    tripDistance: 13.0
  }
];

const INITIAL_BOATS: Boat[] = [
  { id: "boat-1", name: "Kuda Laut 02", status: "active", crewCount: 2, members: ["Sutarno Wijaya", "Sutrisno Widodo"], avgHealthScore: 92, lat: -8.295, lng: 111.985 },
  { id: "boat-2", name: "Baruna Jaya VII", status: "active", crewCount: 2, members: ["Hendro Prasetyo", "Yusuf Mansur"], avgHealthScore: 94, lat: -8.315, lng: 112.005 },
  { id: "boat-3", name: "Nila Raya", status: "active", crewCount: 2, members: ["Budi Santoso", "Joko Purwanto"], avgHealthScore: 78, lat: -8.345, lng: 111.965 },
  { id: "boat-4", name: "Mina Makmur", status: "active", crewCount: 2, members: ["Rahmat Hidayat", "Mulyono Saputra"], avgHealthScore: 88, lat: -8.300, lng: 112.025 },
  { id: "boat-5", name: "Sinar Jaya 08", status: "active", crewCount: 1, members: ["Slamet Hariadi"], avgHealthScore: 84, lat: -8.330, lng: 111.975 }
];

const INITIAL_VESTS: Vest[] = [
  { id: "vest-101", battery: 88, firmware: "v3.0.1", lastMaintenance: "2026-05-10", activationDate: "2024-02-15", frequency: "920.4 MHz", radioId: "LORA-NODE-01", calibration: "Calibrated" },
  { id: "vest-102", battery: 92, firmware: "v3.0.1", lastMaintenance: "2026-06-01", activationDate: "2024-02-15", frequency: "920.4 MHz", radioId: "LORA-NODE-02", calibration: "Calibrated" },
  { id: "vest-103", battery: 45, firmware: "v3.0.1", lastMaintenance: "2026-04-18", activationDate: "2024-03-20", frequency: "920.4 MHz", radioId: "LORA-NODE-03", calibration: "Needs Calibration" },
  { id: "vest-104", battery: 12, firmware: "v3.0.1", lastMaintenance: "2026-06-25", activationDate: "2024-04-11", frequency: "920.4 MHz", radioId: "LORA-NODE-04", calibration: "Calibrated" },
  { id: "vest-105", battery: 0, firmware: "v3.0.0", lastMaintenance: "2025-11-12", activationDate: "2023-08-01", frequency: "920.4 MHz", radioId: "LORA-NODE-05", calibration: "Faulty" },
  { id: "vest-106", battery: 85, firmware: "v3.0.1", lastMaintenance: "2026-07-02", activationDate: "2024-05-12", frequency: "920.4 MHz", radioId: "LORA-NODE-06", calibration: "Calibrated" },
  { id: "vest-107", battery: 90, firmware: "v3.0.1", lastMaintenance: "2026-07-10", activationDate: "2024-05-15", frequency: "920.4 MHz", radioId: "LORA-NODE-07", calibration: "Calibrated" },
  { id: "vest-108", battery: 78, firmware: "v3.0.1", lastMaintenance: "2026-06-18", activationDate: "2024-04-20", frequency: "920.4 MHz", radioId: "LORA-NODE-08", calibration: "Calibrated" },
  { id: "vest-109", battery: 89, firmware: "v3.0.1", lastMaintenance: "2026-07-01", activationDate: "2024-05-22", frequency: "920.4 MHz", radioId: "LORA-NODE-09", calibration: "Calibrated" },
  { id: "vest-110", battery: 80, firmware: "v3.0.1", lastMaintenance: "2026-06-30", activationDate: "2024-05-10", frequency: "920.4 MHz", radioId: "LORA-NODE-10", calibration: "Calibrated" }
];

const INITIAL_ALERTS: EmergencyAlert[] = [
  {
    id: "alert-1",
    fishermanId: "fish-3",
    name: "Budi Santoso",
    boatName: "Nila Raya",
    vestId: "vest-103",
    alertType: "Temp Abnormal",
    time: "2026-07-18T00:10:00Z",
    priority: "medium",
    lat: -8.345,
    lng: 111.965,
    status: "active"
  },
  {
    id: "alert-2",
    fishermanId: "fish-4",
    name: "Rahmat Hidayat",
    boatName: "Mina Makmur",
    vestId: "vest-104",
    alertType: "Low Battery",
    time: "2026-07-18T00:15:00Z",
    priority: "low",
    lat: -8.300,
    lng: 112.025,
    status: "active"
  }
];

const BASE_STATIONS: BaseStation[] = [
  {
    id: "station-main",
    name: "Stasiun Pangkalan Pantai Sine (Tulungagung)",
    lat: BASE_LAT,
    lng: BASE_LNG,
    radius: 25000, // 25 km range in meters
    connectedDevices: 9,
    signalQuality: 95,
    status: "online"
  }
];

// In-Memory state holder for simulation (Singleton)
class SimulationEngine {
  private fishermen: Fisherman[] = [...INITIAL_FISHERMEN];
  private boats: Boat[] = [...INITIAL_BOATS];
  private vests: Vest[] = [...INITIAL_VESTS];
  private alerts: EmergencyAlert[] = [...INITIAL_ALERTS];
  private stations: BaseStation[] = [...BASE_STATIONS];
  private listeners: Set<() => void> = new Set();
  private intervalId: NodeJS.Timeout | null = null;
  private soundEnabled: boolean = false;
  private latestSOSId: string | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.start();
    }
  }

  public getFishermen() {
    return this.fishermen;
  }

  public getBoats() {
    return this.boats;
  }

  public getVests() {
    return this.vests;
  }

  public getAlerts() {
    return this.alerts;
  }

  public getStations() {
    return this.stations;
  }

  public enableSound(val: boolean) {
    this.soundEnabled = val;
  }

  public getLatestSOS() {
    return this.latestSOSId;
  }

  public clearLatestSOS() {
    this.latestSOSId = null;
    this.notify();
  }

  public subscribe(callback: () => void) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => cb());
  }

  public resolveAlert(alertId: string) {
    this.alerts = this.alerts.map((alert) => {
      if (alert.id === alertId) {
        // Also update corresponding fisherman status
        this.fishermen = this.fishermen.map((f) => {
          if (f.id === alert.fishermanId) {
            return { 
              ...f, 
              status: "normal", 
              sosStatus: "Inactive" as const,
              fallOverboard: false,
              waterDetected: false,
              spo2: 98
            };
          }
          return f;
        });
        return { ...alert, status: "resolved" as const };
      }
      return alert;
    });
    this.notify();
  }

  public dispatchAlert(alertId: string) {
    this.alerts = this.alerts.map((alert) => {
      if (alert.id === alertId) {
        return { ...alert, status: "dispatched" as const };
      }
      return alert;
    });
    this.notify();
  }

  // Trigger manual SOS for testing
  public triggerSOS(fishermanId: string) {
    const fisher = this.fishermen.find((f) => f.id === fishermanId);
    if (!fisher) return;

    if (this.alerts.some((a) => a.fishermanId === fishermanId && a.alertType === "SOS Button" && a.status === "active")) {
      return;
    }

    const newAlert: EmergencyAlert = {
      id: `alert-${Date.now()}`,
      fishermanId: fisher.id,
      name: fisher.name,
      boatName: this.boats.find((b) => b.id === fisher.assignedBoatId)?.name || "Unknown Boat",
      vestId: fisher.assignedVestId,
      alertType: "SOS Button",
      time: new Date().toISOString(),
      priority: "high",
      lat: fisher.lat,
      lng: fisher.lng,
      status: "active"
    };

    this.fishermen = this.fishermen.map((f) => {
      if (f.id === fishermanId) {
        return { 
          ...f, 
          status: "emergency", 
          sosStatus: "Active" as const,
          spo2: 92,
          fatigue: "High Fatigue"
        };
      }
      return f;
    });

    this.alerts = [newAlert, ...this.alerts];
    this.latestSOSId = fisher.id;

    if (this.soundEnabled && typeof window !== "undefined") {
      this.playAlarmSound();
    }

    this.notify();
  }

  private playAlarmSound() {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(880, audioContext.currentTime);
      osc.frequency.linearRampToValueAtTime(440, audioContext.currentTime + 0.4);

      gain.gain.setValueAtTime(0.3, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(audioContext.destination);

      osc.start();
      osc.stop(audioContext.currentTime + 0.8);

      setTimeout(() => {
        const osc2 = audioContext.createOscillator();
        const gain2 = audioContext.createGain();
        osc2.type = "sawtooth";
        osc2.frequency.setValueAtTime(880, audioContext.currentTime);
        osc2.frequency.linearRampToValueAtTime(440, audioContext.currentTime + 0.4);
        gain2.gain.setValueAtTime(0.3, audioContext.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
        osc2.connect(gain2);
        gain2.connect(audioContext.destination);
        osc2.start();
        osc2.stop(audioContext.currentTime + 0.8);
      }, 300);

    } catch (e) {
      console.warn("Alarm audio play blocked by browser", e);
    }
  }

  public start() {
    if (this.intervalId) return;

    this.intervalId = setInterval(() => {
      this.fishermen = this.fishermen.map((f) => {
        if (f.status === "offline") return f;

        const rad = (f.heading * Math.PI) / 180;
        const latChange = Math.cos(rad) * 0.0003 * (f.speed / 4);
        const lngChange = Math.sin(rad) * 0.0003 * (f.speed / 4);

        const newLat = f.lat + latChange;
        const newLng = f.lng + lngChange;

        // Fluctuations in heart rate
        let newHR = f.heartRate;
        if (f.status !== "emergency") {
          newHR = Math.max(60, Math.min(110, f.heartRate + (Math.random() > 0.5 ? 1 : -1)));
        } else if (f.status === "emergency") {
          newHR = Math.max(120, Math.min(145, f.heartRate + (Math.random() > 0.5 ? 2 : -2)));
        }

        // Fluctuations in temperature
        let newTemp = f.temperature;
        if (f.waterDetected) {
          // Drops temperature due to hypothermia risk simulation
          newTemp = Math.max(34.8, f.temperature - 0.1);
        } else {
          newTemp = Math.max(35.8, Math.min(37.5, f.temperature + (Math.random() > 0.5 ? 0.05 : -0.05)));
        }

        // Battery drainage (0.05% per tick)
        const newBat = Math.max(0, parseFloat((f.battery - 0.05).toFixed(2)));
        const newRuntime = parseFloat((newBat * 0.48).toFixed(1)); // max 48 hours

        // SpO2 dynamic simulation
        let newSpo2 = f.spo2;
        if (f.status === "emergency" || f.fallOverboard) {
          newSpo2 = Math.max(90, Math.min(94, f.spo2 - (Math.random() > 0.5 ? 1 : 0)));
        } else {
          newSpo2 = Math.max(95, Math.min(100, f.spo2 + (Math.random() > 0.7 ? 1 : Math.random() > 0.7 ? -1 : 0)));
        }

        // RSSI variation
        const newRssi = Math.max(-110, Math.min(-45, f.rssi + Math.floor(Math.random() * 5 - 2)));

        // Increment trip stats
        const newDuration = f.tripDuration + 1; // 1 min per interval tick
        const newDistance = parseFloat((f.tripDistance + (f.speed * 0.02)).toFixed(2));

        // Fatigue level calculation
        let newFatigue = f.fatigue;
        if (newDuration > 300 || newHR > 105) {
          newFatigue = "High Fatigue";
        } else if (newDuration > 180 || newHR > 90) {
          newFatigue = "Moderate Fatigue";
        } else {
          newFatigue = "Safe";
        }

        // Hypothermia risk calculation
        let newHypo = f.hypothermiaRisk;
        if (newTemp < 35.2 && f.waterDetected) {
          newHypo = "High Risk";
        } else if (newTemp < 35.8) {
          newHypo = "Low Risk";
        } else {
          newHypo = "None";
        }

        // Ambient sensor variations (BME280)
        const newAmbientTemp = parseFloat((28.5 + Math.sin(newDuration / 50) * 1.5 + (Math.random() * 0.2 - 0.1)).toFixed(1));
        const newHumidity = Math.min(100, Math.max(50, Math.round(75 + Math.cos(newDuration / 50) * 5 + (Math.random() * 2 - 1))));
        const newPressure = Math.round(1010 + Math.sin(newDuration / 100) * 3);

        const newPath = [...f.path];
        if (newPath.length > 50) newPath.shift();
        newPath.push([newLat, newLng]);

        return {
          ...f,
          lat: newLat,
          lng: newLng,
          heartRate: parseFloat(newHR.toFixed(0)),
          temperature: parseFloat(newTemp.toFixed(1)),
          battery: newBat,
          rssi: newRssi,
          path: newPath,
          lastPacketTime: "Baru saja",
          spo2: newSpo2,
          fatigue: newFatigue,
          hypothermiaRisk: newHypo,
          ambientTemp: newAmbientTemp,
          ambientHumidity: newHumidity,
          ambientPressure: newPressure,
          batteryRuntime: newRuntime,
          tripDuration: newDuration,
          tripDistance: newDistance
        };
      });

      this.boats = this.boats.map((boat) => {
        const matchingFisherObj = this.fishermen.find((f) => f.assignedBoatId === boat.id);
        if (matchingFisherObj && matchingFisherObj.status !== "offline") {
          return {
            ...boat,
            lat: matchingFisherObj.lat,
            lng: matchingFisherObj.lng,
            status: "active" as const
          };
        }
        return boat;
      });

      this.vests = this.vests.map((vest) => {
        const matchingFisherObj = this.fishermen.find((f) => f.assignedVestId === vest.id);
        if (matchingFisherObj) {
          return {
            ...vest,
            battery: Math.floor(matchingFisherObj.battery)
          };
        }
        return vest;
      });

      const onlineVests = this.fishermen.filter((f) => f.status !== "offline").length;
      this.stations = this.stations.map((st) => ({
        ...st,
        connectedDevices: onlineVests
      }));

      // Random Alert Spawner (5% chance)
      if (Math.random() < 0.05) {
        const activeFishers = this.fishermen.filter((f) => f.status === "normal");
        if (activeFishers.length > 0) {
          const target = activeFishers[Math.floor(Math.random() * activeFishers.length)];
          
          const types: EmergencyAlert["alertType"][] = [
            "Fall Overboard", 
            "No Movement", 
            "Heart Rate Abnormal", 
            "Temp Abnormal", 
            "Low SpO2", 
            "High Fatigue", 
            "Hypothermia Risk",
            "Outside Fishing Area"
          ];
          const alertType = types[Math.floor(Math.random() * types.length)];
          const priority = (alertType === "Fall Overboard" || alertType === "No Movement" || alertType === "Outside Fishing Area") ? "high" : "medium";

          const newAlert: EmergencyAlert = {
            id: `alert-${Date.now()}`,
            fishermanId: target.id,
            name: target.name,
            boatName: this.boats.find((b) => b.id === target.assignedBoatId)?.name || "Unknown Boat",
            vestId: target.assignedVestId,
            alertType,
            time: new Date().toISOString(),
            priority,
            lat: target.lat,
            lng: target.lng,
            status: "active"
          };

          this.fishermen = this.fishermen.map((f) => {
            if (f.id === target.id) {
              const updatedStatus = (priority === "high") ? "emergency" : "warning";
              const wasFall = alertType === "Fall Overboard";
              return { 
                ...f, 
                status: updatedStatus as any,
                fallOverboard: wasFall ? true : f.fallOverboard,
                waterDetected: wasFall ? true : f.waterDetected,
                spo2: wasFall ? 91 : f.spo2
              };
            }
            return f;
          });

          this.alerts = [newAlert, ...this.alerts];
          if (priority === "high") {
            this.latestSOSId = target.id;
            if (this.soundEnabled && typeof window !== "undefined") {
              this.playAlarmSound();
            }
          }
        }
      }

      this.notify();
    }, 3000);
  }

  public stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

export const simulator = new SimulationEngine();
