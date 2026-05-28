export default function SensorGauge({
  label,
  value,
  unit,
  min,
  max,
  icon,
  warning,
  danger,
}) {
  const range = max - min;
  const percentage = Math.max(
    0,
    Math.min(range > 0 ? ((value - min) / range) * 100 : 0, 100),
  );

  // Determine status color
  let statusColor = "text-green-400";
  let barColor = "bg-green-500";
  let status = "Normal";

  if (danger !== undefined && value >= danger) {
    statusColor = "text-red-400";
    barColor = "bg-red-500";
    status = "Critical";
  } else if (warning !== undefined && value >= warning) {
    statusColor = "text-yellow-400";
    barColor = "bg-yellow-500";
    status = "Warning";
  }

  // For SpO2, low values are dangerous (reverse logic)
  if (label === "SpO2" && value > 0) {
    if (value < 90) {
      statusColor = "text-red-400";
      barColor = "bg-red-500";
      status = "Critical";
    } else if (value < 95) {
      statusColor = "text-yellow-400";
      barColor = "bg-yellow-500";
      status = "Warning";
    } else {
      statusColor = "text-green-400";
      barColor = "bg-green-500";
      status = "Normal";
    }
  }

  return (
    <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 hover:border-slate-600 transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          <span className="text-sm text-slate-400">{label}</span>
        </div>
        <span className={`text-xs font-medium ${statusColor}`}>{status}</span>
      </div>

      <div className="flex items-baseline gap-1 mb-3">
        <span className="text-3xl font-bold text-white">
          {typeof value === "number" ? value.toFixed(1) : value}
        </span>
        <span className="text-sm text-slate-500">{unit}</span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-slate-700 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex justify-between mt-1">
        <span className="text-xs text-slate-600">{min}</span>
        <span className="text-xs text-slate-600">{max}</span>
      </div>
    </div>
  );
}
