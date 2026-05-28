export default function RiskScoreBar({ score }) {
  let color, bg, label, emoji;

  if (score >= 80) {
    color = "text-red-400";
    bg = "bg-red-500";
    label = "CRITICAL";
    emoji = "🔴";
  } else if (score >= 60) {
    color = "text-orange-400";
    bg = "bg-orange-500";
    label = "DANGER";
    emoji = "🟠";
  } else if (score >= 40) {
    color = "text-yellow-400";
    bg = "bg-yellow-500";
    label = "CAUTION";
    emoji = "🟡";
  } else {
    color = "text-green-400";
    bg = "bg-green-500";
    label = "SAFE";
    emoji = "🟢";
  }

  return (
    <div
      className={`bg-slate-800 rounded-xl p-6 border border-slate-700 ${score >= 80 ? "pulse-critical" : ""}`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm text-slate-400 font-medium">RISK SCORE</h3>
        <span className={`text-sm font-bold ${color}`}>
          {emoji} {label}
        </span>
      </div>

      <div className="flex items-baseline gap-2 mb-4">
        <span className={`text-5xl font-bold ${color}`}>{score}</span>
        <span className="text-xl text-slate-500">/100</span>
      </div>

      {/* Score bar */}
      <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
        <div
          className={`h-4 rounded-full transition-all duration-700 ${bg}`}
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Scale labels */}
      <div className="flex justify-between mt-2 text-xs">
        <span className="text-green-600">SAFE</span>
        <span className="text-yellow-600">CAUTION</span>
        <span className="text-orange-600">DANGER</span>
        <span className="text-red-600">CRITICAL</span>
      </div>
    </div>
  );
}
