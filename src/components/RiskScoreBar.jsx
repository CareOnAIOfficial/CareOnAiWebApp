export default function RiskScoreBar({ score }) {
  const normalizedScore = Math.max(0, Math.min(Number(score) || 0, 100));
  let color;
  let bg;
  let label;
  let marker;

  if (normalizedScore >= 80) {
    color = "text-red-400";
    bg = "bg-red-500";
    label = "CRITICAL";
    marker = "[!]";
  } else if (normalizedScore >= 60) {
    color = "text-orange-400";
    bg = "bg-orange-500";
    label = "DANGER";
    marker = "[~]";
  } else if (normalizedScore >= 40) {
    color = "text-yellow-400";
    bg = "bg-yellow-500";
    label = "CAUTION";
    marker = "[?]";
  } else {
    color = "text-green-400";
    bg = "bg-green-500";
    label = "SAFE";
    marker = "[OK]";
  }

  return (
    <div
      className={`bg-slate-800 rounded-xl p-6 border border-slate-700 ${
        normalizedScore >= 80 ? "pulse-critical" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm text-slate-400 font-medium">RISK SCORE</h3>
        <span className={`text-sm font-bold ${color}`}>
          {marker} {label}
        </span>
      </div>

      <div className="flex items-baseline gap-2 mb-4">
        <span className={`text-5xl font-bold ${color}`}>
          {normalizedScore}
        </span>
        <span className="text-xl text-slate-500">/100</span>
      </div>

      <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
        <div
          className={`h-4 rounded-full transition-all duration-700 ${bg}`}
          style={{ width: `${normalizedScore}%` }}
        />
      </div>

      <div className="flex justify-between mt-2 text-xs">
        <span className="text-green-600">SAFE</span>
        <span className="text-yellow-600">CAUTION</span>
        <span className="text-orange-600">DANGER</span>
        <span className="text-red-600">CRITICAL</span>
      </div>
    </div>
  );
}
