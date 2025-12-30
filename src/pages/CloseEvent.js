import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://minivendoreventdaytrackerupdatebackend.onrender.com/api";

export default function CloseEvent() {
  const nav = useNavigate();
  const mobile = localStorage.getItem("mobile"); 

  const sendOtp = async () => {
    if (!mobile) {
      alert("Mobile number not found. Please login again.");
      return;
    }

    try {
      // ✅ Correct endpoint matches backend: /api/close
      const response = await axios.post(`${BASE_URL}/close`, { mobile });
      
      if (response.data.success) {
        alert("Close OTP sent! Check backend terminal.");
        // Go to next page for entering OTP
        nav("/close-otp");
      } else {
        alert("Failed to send OTP: " + (response.data.message || ""));
      }

    } catch (err) {
      console.error(err);
      alert("Failed to send OTP. See console for details.");
    }
  };

  return (
    <div className="card">
      <p className="step">Step 4 of 4</p>
      <h2>Close Event</h2>

      <button onClick={sendOtp}>
        Send Close OTP
      </button>
    </div>
  );
}
