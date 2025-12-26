import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CloseEvent() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const close = async () => {
    setError("");
    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/close", { otp });

      // ✅ SUCCESS → redirect to Thank You page
      nav("/thank-you");

    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError(err.response.data.message || "Invalid OTP");
      } else {
        setError("Server error. Try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <p className="step">Step 4 of 4: Close Event</p>
      <h2>Close Event</h2>

      <input
        type="text"
        placeholder="Enter final OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

      {error && <p className="error">{error}</p>}

      <button onClick={close} disabled={loading || !otp}>
        {loading ? "Verifying..." : "Close Event"}
      </button>
    </div>
  );
}
