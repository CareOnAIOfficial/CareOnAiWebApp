import { NavLink, useNavigate } from "react-router-dom";
import { auth, signOut } from "../services/firebase";
import {
  MdDashboard,
  MdHistory,
  MdNotifications,
  MdSettings,
  MdControlCamera,
  MdLogout,
} from "react-icons/md";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-slate-400 hover:bg-slate-700 hover:text-white"
    }`;

  return (
    <nav className="w-64 bg-slate-800 min-h-screen p-4 flex flex-col border-r border-slate-700">
      {/* Logo */}
      <div className="mb-8 px-4">
        <h1 className="text-xl font-bold text-white">🏥 AI Careon</h1>
        <p className="text-xs text-slate-500 mt-1">Bed Sore Prevention</p>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col gap-1 flex-1">
        <NavLink to="/" className={linkClass}>
          <MdDashboard size={20} /> Dashboard
        </NavLink>
        <NavLink to="/history" className={linkClass}>
          <MdHistory size={20} /> History
        </NavLink>
        <NavLink to="/alerts" className={linkClass}>
          <MdNotifications size={20} /> Alerts
        </NavLink>
        <NavLink to="/control" className={linkClass}>
          <MdControlCamera size={20} /> Bed Control
        </NavLink>
        <NavLink to="/settings" className={linkClass}>
          <MdSettings size={20} /> Settings
        </NavLink>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-all mt-4"
      >
        <MdLogout size={20} /> Logout
      </button>
    </nav>
  );
}
