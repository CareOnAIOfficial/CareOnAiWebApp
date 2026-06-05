import { NavLink, useNavigate } from "react-router-dom";
import { auth, signOut } from "../services/firebase";
import {
  MdClose,
  MdMenu,
  MdDashboard,
  MdHistory,
  MdNotifications,
  MdSettings,
  MdControlCamera,
  MdLogout,
} from "react-icons/md";

export default function Navbar({ isOpen, onClose, onToggle }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    onClose();
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-slate-400 hover:bg-slate-700 hover:text-white"
    }`;

  const handleNavClick = () => {
    onClose();
  };

  return (
    <>
      <button
        type="button"
        onClick={onToggle}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        className="fixed left-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-white shadow-lg transition hover:bg-slate-700 md:hidden"
      >
        {isOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
      </button>

      {isOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-slate-950/60 md:hidden"
        />
      )}

      <nav
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-800 p-4 flex flex-col border-r border-slate-700 transition-transform duration-200 md:static md:min-h-screen md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
      {/* Logo */}
      <div className="mb-8 px-4 pt-14 md:pt-0">
        <h1 className="text-xl font-bold text-white">🏥 AI Careon</h1>
        <p className="text-xs text-slate-500 mt-1">Bed Sore Prevention</p>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col gap-1 flex-1">
        <NavLink to="/" className={linkClass} onClick={handleNavClick}>
          <MdDashboard size={20} /> Dashboard
        </NavLink>
        <NavLink to="/history" className={linkClass} onClick={handleNavClick}>
          <MdHistory size={20} /> History
        </NavLink>
        <NavLink to="/alerts" className={linkClass} onClick={handleNavClick}>
          <MdNotifications size={20} /> Alerts
        </NavLink>
        <NavLink to="/control" className={linkClass} onClick={handleNavClick}>
          <MdControlCamera size={20} /> Bed Control
        </NavLink>
        <NavLink to="/settings" className={linkClass} onClick={handleNavClick}>
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
    </>
  );
}
