import api from "../api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CheckIn() {
  const [checkedIn, setCheckedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [timestamp, setTimestamp] = useState(null);
  const [vendor, setVendor] = useState(null);
  const [error, setError] = useState("");   // ✅ NEW
  const nav = useNavigate();

  // 🔐 Mock authentication
  useEffect(() => {
    const v = localStorage.getItem("vendor");
    if (!v) nav("/");
    else setVendor(v);
  }, [nav]);

  // 📍 Location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        }),
      () => alert("Location permission required")
    );
  }, []);

  // ⏱️ Timestamp
  useEffect(() => {
    const interval = setInterval(() => setTimestamp(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const form = new FormData();
      form.append("vendor", vendor);
      form.append("photo", e.target.photo.files[0]);
      form.append("lat", location.lat);
      form.append("lng", location.lng);
      form.append("timestamp", timestamp.toISOString());

      await api.post("/checkin", form);

      setCheckedIn(true);
    } catch (err) {
      // ✅ BACKEND OFF MESSAGE ONLY
      if (!err.response) {
        setError("Backend is not connected. Please start the server.");
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("vendor");
    nav("/");
  };

  return (
    <div className="card">
      <p className="step">Step 1 of 4: Vendor Check-In</p>

      {vendor && (
        <div className="auth-bar">
          <span>👤 Logged in as <strong>{vendor}</strong></span>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      )}

      <h2>Vendor Check-In</h2>

      {location && (
        <div className="location-box">
          <p><strong>Latitude:</strong> {location.lat}</p>
          <p><strong>Longitude:</strong> {location.lng}</p>
        </div>
      )}

      {timestamp && (
        <div className="location-box">
          <p><strong>Timestamp:</strong></p>
          <p>{timestamp.toLocaleString()}</p>
        </div>
      )}

      {!checkedIn ? (
        <form onSubmit={submit}>
          <label className="photo-label">Submit a photo on arrival</label>

          <input type="file" name="photo" accept="image/*" required />

          <small className="hint">
            Please capture a clear photo of the event location
          </small>

          {error && <p className="error">{error}</p>} {/* ✅ SHOW MESSAGE */}

          <button disabled={loading || !location || !timestamp}>
            {loading ? "Checking In..." : "Check In"}
          </button>
        </form>
      ) : (
        <>
          <p className="success">✅ Vendor successfully checked in</p>
          <button onClick={() => nav("/otp")}>
            Proceed to Customer OTP
          </button>
        </>
      )}
    </div>
  );
}
