// pages/OTPStart.js
import api from "../api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OTPStart() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const verify = async () => {
    setError("");
    setLoading(true);

    try {
      await api.post("/otp/verify", { otp });

      // ✅ OTP correct → go to setup page
      nav("/setup");

    } catch (err) {
      // ✅ Handle invalid OTP (400)
      if (err.response && err.response.status === 400) {
        setError(err.response.data.message || "Invalid OTP");
      } else {
        setError("Server error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Customer OTP</h2>

      <input
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
      />

      {error && <p className="error">{error}</p>}

      <button onClick={verify} disabled={loading || !otp}>
        {loading ? "Verifying..." : "Start Event"}
      </button>
    </div>
  );
}
