import { usePatientData } from "../hooks/usePatientData";
import SensorGauge from "../components/SensorGauge";
import RiskScoreBar from "../components/RiskScoreBar";
import ActuatorStatus from "../components/ActuatorStatus";

export default function DashboardPage() {
  const { latest, loading } = usePatientData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Connecting to patient monitor...</p>
        </div>
      </div>
    );
  }

  if (!latest) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center bg-slate-800 p-8 rounded-xl border border-slate-700">
          <p className="text-4xl mb-4">📡</p>
          <h2 className="text-xl text-white mb-2">No Data Yet</h2>
          <p className="text-slate-400">
            Waiting for ESP32 to send sensor data...
          </p>
          <p className="text-slate-500 text-sm mt-2">
            Make sure the device is powered on and connected to WiFi
          </p>
        </div>
      </div>
    );
  }

  const d = latest;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Live Dashboard</h1>
          <p className="text-slate-400 text-sm">
            Patient 001 — Bed A — ICU Ward
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          <span className="text-sm text-green-400">Live</span>
        </div>
      </div>

      {/* Risk Score — Full width */}
      <RiskScoreBar score={d.risk_score || 0} />

      {/* Sensor Gauges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <SensorGauge
          label="Pressure (FSR)"
          value={d.fsr_raw || 0}
          unit=""
          min={0}
          max={4095}
          icon="🔴"
          warning={2800}
          danger={3500}
        />
        <SensorGauge
          label="Temperature"
          value={d.temperature || 0}
          unit="°C"
          min={35}
          max={42}
          icon="🌡️"
          warning={37.5}
          danger={39.0}
        />
        <SensorGauge
          label="Humidity"
          value={d.humidity || 0}
          unit="%"
          min={0}
          max={100}
          icon="💧"
          warning={70}
          danger={85}
        />
        <SensorGauge
          label="Heart Rate"
          value={d.heart_rate || 0}
          unit="BPM"
          min={0}
          max={200}
          icon="❤️"
          warning={100}
          danger={130}
        />
        <SensorGauge
          label="SpO2"
          value={d.spo2 || 0}
          unit="%"
          min={70}
          max={100}
          icon="🫁"
        />
        <SensorGauge
          label="Pressure Duration"
          value={d.pressure_duration || 0}
          unit="sec"
          min={0}
          max={7200}
          icon="⏱️"
          warning={1800}
          danger={3600}
        />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Actuator Status */}
        <ActuatorStatus riskScore={d.risk_score || 0} />

        {/* Quick Info */}
        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
          <h3 className="text-sm text-slate-400 font-medium mb-4">
            PATIENT INFO
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-400">Moisture</span>
              <span
                className={
                  d.moisture_wet
                    ? "text-yellow-400 font-medium"
                    : "text-green-400"
                }
              >
                {d.moisture_wet ? "⚠️ WET" : "✅ Dry"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Weight</span>
              <span className="text-white">
                {(d.weight_kg || 0).toFixed(1)} kg
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Last Update</span>
              <span className="text-white">
                {d.timestamp
                  ? new Date(d.timestamp * 1000).toLocaleTimeString()
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Device Status</span>
              <span className="text-green-400">🟢 Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
