import { usePatientData } from "../hooks/usePatientData";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

export default function HistoryPage() {
  const { history, loading } = usePatientData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const chartData = history.map((h) => ({
    time: new Date(h.time * 1000).toLocaleTimeString(),
    risk: h.risk_score || 0,
    pressure: h.fsr_raw || 0,
    temp: h.temperature || 0,
  }));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">History & Trends</h1>
        <p className="text-slate-400 text-sm">
          Patient 001 — Last {history.length} readings
        </p>
      </div>

      {chartData.length === 0 ? (
        <div className="bg-slate-800 rounded-xl p-12 border border-slate-700 text-center">
          <p className="text-4xl mb-4">📈</p>
          <h2 className="text-xl text-white mb-2">No History Yet</h2>
          <p className="text-slate-400">
            Data will appear here once the ESP32 starts sending readings
          </p>
        </div>
      ) : (
        <>
          {/* Risk Score Over Time */}
          <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
            <h3 className="text-sm text-slate-400 font-medium mb-4">
              RISK SCORE OVER TIME
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#94a3b8" }}
                />
                <Area
                  type="monotone"
                  dataKey="risk"
                  stroke="#ef4444"
                  fill="#ef444420"
                  strokeWidth={2}
                  name="Risk Score"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Pressure Over Time */}
          <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
            <h3 className="text-sm text-slate-400 font-medium mb-4">
              PRESSURE (FSR) OVER TIME
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                <YAxis domain={[0, 4095]} stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#94a3b8" }}
                />
                <Line
                  type="monotone"
                  dataKey="pressure"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                  name="Pressure"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Temperature Over Time */}
          <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
            <h3 className="text-sm text-slate-400 font-medium mb-4">
              TEMPERATURE OVER TIME
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                <YAxis domain={[35, 42]} stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#94a3b8" }}
                />
                <Line
                  type="monotone"
                  dataKey="temp"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={false}
                  name="Temperature °C"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
