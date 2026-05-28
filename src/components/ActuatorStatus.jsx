export default function ActuatorStatus({ riskScore }) {
  const actuators = [
    {
      name: "Air Pump",
      icon: "💨",
      active: riskScore >= 60,
      description: riskScore >= 60 ? "Inflating bladders" : "Standby",
    },
    {
      name: "Vibration",
      icon: "📳",
      active: riskScore >= 40 && riskScore < 60,
      description:
        riskScore >= 40 && riskScore < 60
          ? "Stimulating circulation"
          : "Standby",
    },
    {
      name: "Bed Tilt",
      icon: "🛏️",
      active: riskScore >= 80,
      description:
        riskScore >= 80 ? "Raising — redistributing weight" : "Flat position",
    },
    {
      name: "Alarm",
      icon: "🔊",
      active: riskScore >= 80,
      description: riskScore >= 80 ? "CRITICAL — audible alarm" : "Silent",
    },
  ];

  return (
    <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
      <h3 className="text-sm text-slate-400 font-medium mb-4">
        ACTUATOR STATUS
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {actuators.map((a) => (
          <div
            key={a.name}
            className={`p-3 rounded-lg border transition-all ${
              a.active
                ? "bg-blue-900/30 border-blue-500 text-blue-300"
                : "bg-slate-700/30 border-slate-600 text-slate-500"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{a.icon}</span>
              <span className="text-sm font-medium">{a.name}</span>
              {a.active && (
                <span className="ml-auto w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              )}
            </div>
            <p className="text-xs opacity-70">{a.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
