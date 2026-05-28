import { useState, useEffect } from "react";
import { database, ref, onValue } from "../services/firebase";

export function usePatientData(patientId = "patient_001") {
  const [latest, setLatest] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to latest data (real-time)
    const latestRef = ref(database, `patients/${patientId}/latest`);
    const unsubLatest = onValue(latestRef, (snapshot) => {
      const data = snapshot.val();
      setLatest(data || null);
      setLoading(false);
    });

    // Listen to history
    const historyRef = ref(database, `patients/${patientId}/history`);
    const unsubHistory = onValue(historyRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const arr = Object.entries(data).map(([key, val]) => ({
          time: parseInt(key),
          ...val,
        }));
        arr.sort((a, b) => a.time - b.time);
        setHistory(arr.slice(-100)); // Last 100 entries
      } else {
        setHistory([]);
      }
    });

    return () => {
      unsubLatest();
      unsubHistory();
    };
  }, [patientId]);

  return { latest, history, loading };
}
