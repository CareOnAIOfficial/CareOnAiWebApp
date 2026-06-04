import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  auth,
  fetchSignInMethodsForEmail,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "../services/firebase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const navigate = useNavigate();

  const accountEmail = email.trim();

  const formatAuthError = (err) => {
    if (err.code === "auth/invalid-credential") {
      return "Invalid email or password";
    }

    if (err.code === "auth/user-not-found") {
      return "No account exists with this email address";
    }

    if (err.code === "auth/invalid-email") {
      return "Enter a valid email address";
    }

    if (err.code === "auth/configuration-not-found") {
      return "Firebase Authentication is not enabled for this project. Enable Email/Password sign-in in Firebase Console.";
    }

    return err.message;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, accountEmail, password);
      navigate("/");
    } catch (err) {
      setError(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    setError("");
    setSuccess("");

    if (!accountEmail) {
      setError(
        "Enter the same account email first, then request a password reset.",
      );
      return;
    }

    setResetLoading(true);

    try {
      const methods = await fetchSignInMethodsForEmail(auth, accountEmail);
      if (methods.length === 0) {
        setError("No account exists with this email address.");
        return;
      }

      await sendPasswordResetEmail(auth, accountEmail);
      setSuccess(`Password reset email sent to ${accountEmail}.`);
    } catch (err) {
      setError(formatAuthError(err));
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">AI Careon</h1>
          <p className="text-slate-400 mt-2">
            Intelligent Bed Sore Prevention System
          </p>
        </div>

        <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-xl">
          <h2 className="text-xl font-semibold text-white mb-6">Nurse Login</h2>

          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-emerald-900/30 border border-emerald-700 text-emerald-300 px-4 py-3 rounded-lg mb-4 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
                placeholder="nurse@hospital.com"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
                placeholder="Password"
                autoComplete="current-password"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={handlePasswordReset}
              disabled={resetLoading}
              className="text-sm text-blue-400 hover:text-blue-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resetLoading
                ? "Sending reset email..."
                : "Forgot your password?"}
            </button>
          </div>
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          AI Careon 2025 - University of Bahrain
        </p>
      </div>
    </div>
  );
}
