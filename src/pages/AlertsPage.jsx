import {
  MdCheckCircle,
  MdInfo,
  MdNotificationsActive,
  MdWarning,
} from "react-icons/md";
import { usePatientData } from "../hooks/usePatientData";

const alertStyles = {
  critical: {
    icon: MdWarning,
    badge: "CRITICAL",
    card: "border-red-700 bg-red-950/30",
    iconColor: "text-red-400",
    badgeColor: "bg-red-500/20 text-red-300 border-red-500/30",
  },
  warning: {
    icon: MdNotificationsActive,
    badge: "WARNING",
    card: "border-yellow-700 bg-yellow-950/20",
    iconColor: "text-yellow-400",
    badgeColor: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  },
  info: {
    icon: MdInfo,
    badge: "INFO",
    card: "border-blue-700 bg-blue-950/20",
    iconColor: "text-blue-400",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  },
};

function buildAlerts(data) {
  if (!data) return [];

  const alerts = [];
  const riskScore = data.risk_score || 0;

  if (riskScore >= 80) {
    alerts.push({
      level: "critical",
      title: "High bed sore risk",
      detail: "Immediate repositioning is recommended.",
      value: `${riskScore}/100`,
    });
  } else if (riskScore >= 60) {
    alerts.push({
      level: "warning",
      title: "Elevated bed sore risk",
      detail: "Monitor pressure and consider an air pump cycle.",
      value: `${riskScore}/100`,
    });
  }

  if ((data.fsr_raw || 0) >= 3500) {
    alerts.push({
      level: "critical",
      title: "Pressure is above safe range",
      detail: "Pressure sensor reading is critically high.",
      value: data.fsr_raw,
    });
  } else if ((data.fsr_raw || 0) >= 2800) {
    alerts.push({
      level: "warning",
      title: "Pressure is rising",
      detail: "Check patient position and mattress support.",
      value: data.fsr_raw,
    });
  }

  if ((data.temperature || 0) >= 39) {
    alerts.push({
      level: "critical",
      title: "Temperature is high",
      detail: "Skin temperature is above the critical threshold.",
      value: `${data.temperature.toFixed(1)} C`,
    });
  } else if ((data.temperature || 0) >= 37.5) {
    alerts.push({
      level: "warning",
      title: "Temperature is elevated",
      detail: "Keep monitoring the affected area.",
      value: `${data.temperature.toFixed(1)} C`,
    });
  }

  if ((data.humidity || 0) >= 85 || data.moisture_wet) {
    alerts.push({
      level: "critical",
      title: "Moisture detected",
      detail: "Skin or bedding moisture needs attention.",
      value: data.moisture_wet ? "Wet" : `${data.humidity}%`,
    });
  } else if ((data.humidity || 0) >= 70) {
    alerts.push({
      level: "warning",
      title: "Humidity is elevated",
      detail: "Moisture level may increase skin breakdown risk.",
      value: `${data.humidity}%`,
    });
  }

  if ((data.spo2 || 100) < 90 && (data.spo2 || 0) > 0) {
    alerts.push({
      level: "critical",
      title: "SpO2 is critically low",
      detail: "Oxygen saturation requires immediate attention.",
      value: `${data.spo2}%`,
    });
  } else if ((data.spo2 || 100) < 95 && (data.spo2 || 0) > 0) {
    alerts.push({
      level: "warning",
      title: "SpO2 is below target",
      detail: "Continue close monitoring.",
      value: `${data.spo2}%`,
    });
  }

  if ((data.pressure_duration || 0) >= 3600) {
    alerts.push({
      level: "critical",
      title: "Pressure duration is too long",
      detail: "Patient has remained under pressure for over one hour.",
      value: `${Math.round(data.pressure_duration / 60)} min`,
    });
  } else if ((data.pressure_duration || 0) >= 1800) {
    alerts.push({
      level: "warning",
      title: "Repositioning window approaching",
      detail: "Consider repositioning before pressure duration increases.",
      value: `${Math.round(data.pressure_duration / 60)} min`,
    });
  }

  return alerts;
}

export default function AlertsPage() {
  const { latest, loading } = usePatientData();
  const alerts = buildAlerts(latest);
  const criticalCount = alerts.filter(
    (alert) => alert.level === "critical",
  ).length;
  const warningCount = alerts.filter((alert) => alert.level === "warning").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Alerts</h1>
          <p className="text-slate-400 text-sm">
            Patient 001 - active safety notifications
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:flex">
          <div className="rounded-lg border border-red-800 bg-red-950/20 px-4 py-3">
            <p className="text-xs text-red-300">Critical</p>
            <p className="text-2xl font-bold text-white">{criticalCount}</p>
          </div>
          <div className="rounded-lg border border-yellow-800 bg-yellow-950/20 px-4 py-3">
            <p className="text-xs text-yellow-300">Warnings</p>
            <p className="text-2xl font-bold text-white">{warningCount}</p>
          </div>
        </div>
      </div>

      {!latest ? (
        <div className="bg-slate-800 rounded-xl p-12 border border-slate-700 text-center">
          <MdInfo className="mx-auto mb-4 text-5xl text-blue-400" />
          <h2 className="text-xl text-white mb-2">No Sensor Data</h2>
          <p className="text-slate-400">
            Alerts will appear after the ESP32 sends its first reading.
          </p>
        </div>
      ) : alerts.length === 0 ? (
        <div className="bg-slate-800 rounded-xl p-12 border border-slate-700 text-center">
          <MdCheckCircle className="mx-auto mb-4 text-5xl text-green-400" />
          <h2 className="text-xl text-white mb-2">All Clear</h2>
          <p className="text-slate-400">
            Current readings are within the configured safety ranges.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => {
            const style = alertStyles[alert.level] || alertStyles.info;
            const Icon = style.icon;

            return (
              <div
                key={`${alert.title}-${alert.value}`}
                className={`rounded-xl border p-5 ${style.card}`}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex gap-3">
                    <Icon
                      className={`mt-1 shrink-0 text-2xl ${style.iconColor}`}
                    />
                    <div>
                      <h2 className="font-semibold text-white">{alert.title}</h2>
                      <p className="mt-1 text-sm text-slate-300">
                        {alert.detail}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:justify-end">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${style.badgeColor}`}
                    >
                      {style.badge}
                    </span>
                    <span className="min-w-16 text-right text-sm font-medium text-white">
                      {alert.value}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
