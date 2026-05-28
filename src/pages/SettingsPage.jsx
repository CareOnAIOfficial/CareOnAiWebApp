import { useState, useEffect } from "react";
import { database, ref, set, get } from "../services/firebase";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    pressure_threshold: 2800,
    temp_high: 37.5,
    spo2_low: 95.0,
    humidity_high: 70.0,
    notifications_enabled: true,
  });

  const [profile, setProfile] = useState({
    name: "Patient 001",
    age: 72,
    weight: 75,
    condition: "Post-surgery",
    bed: "A",
    ward: "ICU",
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load current settings from Firebase
    const loadSettings = async () => {
      try {
        const settingsSnap = await get(
          ref(database, "patients/patient_001/settings"),
        );
        if (settingsSnap.exists()) setSettings(settingsSnap.val());

        const profileSnap = await get(
          ref(database, "patients/patient_001/profile"),
        );
        if (profileSnap.exists()) setProfile(profileSnap.val());
      } catch {
        console.log("Using defaults — no saved settings yet");
      }
    };
    loadSettings();
  }, []);

  const handleSave = async () => {
    try {
      await set(ref(database, "patients/patient_001/settings"), settings);
      await set(ref(database, "patients/patient_001/profile"), profile);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 text-sm">
          Configure thresholds and patient profile
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Thresholds */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-medium text-white mb-4">
            ⚙️ Alert Thresholds
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">
                Pressure Threshold (0-4095)
              </label>
              <input
                type="number"
                value={settings.pressure_threshold}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    pressure_threshold: parseInt(e.target.value),
                  })
                }
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">
                Temperature High (°C)
              </label>
              <input
                type="number"
                step="0.1"
                value={settings.temp_high}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    temp_high: parseFloat(e.target.value),
                  })
                }
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">
                SpO2 Low (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={settings.spo2_low}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    spo2_low: parseFloat(e.target.value),
                  })
                }
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">
                Humidity High (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={settings.humidity_high}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    humidity_high: parseFloat(e.target.value),
                  })
                }
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm text-slate-400">Push Notifications</span>
              <button
                onClick={() =>
                  setSettings({
                    ...settings,
                    notifications_enabled: !settings.notifications_enabled,
                  })
                }
                className={`w-12 h-6 rounded-full transition-all ${
                  settings.notifications_enabled
                    ? "bg-blue-600"
                    : "bg-slate-600"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-all ${
                    settings.notifications_enabled
                      ? "translate-x-6"
                      : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Patient Profile */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-medium text-white mb-4">
            👤 Patient Profile
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">
                Patient Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Age</label>
                <input
                  type="number"
                  value={profile.age}
                  onChange={(e) =>
                    setProfile({ ...profile, age: parseInt(e.target.value) })
                  }
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  value={profile.weight}
                  onChange={(e) =>
                    setProfile({ ...profile, weight: parseInt(e.target.value) })
                  }
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">
                Condition
              </label>
              <select
                value={profile.condition}
                onChange={(e) =>
                  setProfile({ ...profile, condition: e.target.value })
                }
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option>Post-surgery</option>
                <option>Spinal cord injury</option>
                <option>Stroke</option>
                <option>ICU / Ventilated</option>
                <option>Elderly bedridden</option>
                <option>Diabetic</option>
                <option>Other</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Bed</label>
                <input
                  type="text"
                  value={profile.bed}
                  onChange={(e) =>
                    setProfile({ ...profile, bed: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">
                  Ward
                </label>
                <input
                  type="text"
                  value={profile.ward}
                  onChange={(e) =>
                    setProfile({ ...profile, ward: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all active:scale-[0.99]"
      >
        {saved ? "✅ Saved Successfully!" : "💾 Save Settings"}
      </button>
    </div>
  );
}
