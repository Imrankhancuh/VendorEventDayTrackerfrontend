import api from "../api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OTPStart() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const nav = useNavigate();

  const customerMobile = localStorage.getItem("mobile"); // same mobile as vendor login

  // Step 1: Send OTP to customer
  const sendOtp = async () => {
    setError("");
    try {
      await api.post("/otp", { mobile: customerMobile });
      setSent(true);
      alert("OTP sent (mock). Check backend terminal");
    } catch (err) {
      setError("Error sending OTP");
      console.error(err);
    }
  };

  // Step 2: Verify OTP
  const verify = async () => {
    setError("");
    setLoading(true);

    try {
      await api.post("/otp/verify", { mobile: customerMobile, otp });

      // ✅ OTP correct → go to setup page
      nav("/setup");

    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError(err.response.data.error || "Invalid OTP");
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

      {!sent && (
        <button onClick={sendOtp}>Send OTP to Customer</button>
      )}

      {sent && (
        <>
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
          />
          {error && <p className="error">{error}</p>}
          <button onClick={verify} disabled={loading || !otp}>
            {loading ? "Verifying..." : "Start Event"}
          </button>
        </>
      )}
    </div>
  );
}
