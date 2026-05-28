import { useEffect, useRef, useState } from "react";
import { database, ref, set } from "../services/firebase";

export default function ControlPage() {
  const [bedRaised, setBedRaised] = useState(false);
  const [pumpActive, setPumpActive] = useState(false);
  const [loading, setLoading] = useState("");
  const timers = useRef(new Set());

  useEffect(() => {
    const pendingTimers = timers.current;
    return () => {
      pendingTimers.forEach(clearTimeout);
    };
  }, []);

  const delay = (callback, ms) => {
    const timerId = setTimeout(() => {
      timers.current.delete(timerId);
      callback();
    }, ms);
    timers.current.add(timerId);
  };

  const sendCommand = async (command, value) => {
    setLoading(command);
    try {
      const controlRef = ref(
        database,
        `patients/patient_001/controls/${command}`,
      );
      await set(controlRef, value);

      if (command === "raise_bed") setBedRaised(value);
      if (command === "trigger_pump") {
        setPumpActive(true);
        delay(() => setPumpActive(false), 10000);
      }

      console.log(`Command sent: ${command} = ${value}`);
    } catch (err) {
      console.error("Command failed:", err);
    } finally {
      delay(() => setLoading(""), 500);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Bed Control</h1>
        <p className="text-slate-400 text-sm">
          Remote actuator control — Patient 001
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bed Control */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="text-center">
            <span className="text-5xl">🛏️</span>
            <h3 className="text-lg font-medium text-white mt-3">
              Bed Position
            </h3>
            <p className="text-slate-400 text-sm mt-1">
              {bedRaised ? "Currently RAISED" : "Currently FLAT"}
            </p>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => sendCommand("raise_bed", true)}
                disabled={bedRaised || loading === "raise_bed"}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all"
              >
                {loading === "raise_bed" ? "⏳ Raising..." : "⬆️ Raise Bed"}
              </button>
              <button
                onClick={() => sendCommand("raise_bed", false)}
                disabled={!bedRaised || loading === "raise_bed"}
                className="flex-1 py-3 bg-slate-600 hover:bg-slate-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all"
              >
                {loading === "raise_bed" ? "⏳ Lowering..." : "⬇️ Lower Bed"}
              </button>
            </div>
          </div>
        </div>

        {/* Pump Control */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="text-center">
            <span className="text-5xl">💨</span>
            <h3 className="text-lg font-medium text-white mt-3">Air Pump</h3>
            <p className="text-slate-400 text-sm mt-1">
              {pumpActive ? "Running — inflating bladders" : "Standby"}
            </p>

            <button
              onClick={() => sendCommand("trigger_pump", true)}
              disabled={pumpActive || loading === "trigger_pump"}
              className="w-full py-3 mt-6 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all"
            >
              {pumpActive
                ? "⏳ Running..."
                : loading === "trigger_pump"
                  ? "⏳ Sending..."
                  : "💨 Trigger Pump Cycle"}
            </button>
          </div>
        </div>

        {/* Emergency Stop */}
        <div className="bg-slate-800 rounded-xl p-6 border border-red-800 md:col-span-2">
          <div className="text-center">
            <span className="text-5xl">🚨</span>
            <h3 className="text-lg font-medium text-white mt-3">
              Emergency Override
            </h3>
            <p className="text-slate-400 text-sm mt-1">
              Immediately stops all actuators and resets timers
            </p>

            <button
              onClick={() => {
                sendCommand("emergency_stop", true);
                setBedRaised(false);
                setPumpActive(false);
                delay(() => sendCommand("emergency_stop", false), 2000);
              }}
              className="w-full py-4 mt-6 bg-red-600 hover:bg-red-700 text-white font-bold text-lg rounded-lg transition-all active:scale-95"
            >
              🛑 EMERGENCY STOP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
