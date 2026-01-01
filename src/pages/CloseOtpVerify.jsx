import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:5000/api"; 

export default function CloseOtpVerify() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate(); 

  const mobile = localStorage.getItem("mobile");
 
  const verifyOtp = async () => {
    setError("");
    setLoading(true);

    try {
      await axios.post(`${BASE_URL}/close/verify`, {
        mobile,
        otp,
      }); 

      nav("/thank-you");

    } catch (err) {
      if (err.response) {
        setError(err.response.data.error);
      } else {
        setError("Server error. Try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Verify Close OTP</h2>

      <input
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

      {error && <p className="error">{error}</p>}

      <button onClick={verifyOtp} disabled={!otp || loading}>
        {loading ? "Verifying..." : "Close Event"}
      </button>
    </div>
  );
}
 