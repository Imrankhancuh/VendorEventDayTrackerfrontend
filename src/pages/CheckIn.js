import api from "../api";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function CheckIn() {
  const [checkedIn, setCheckedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [timestamp, setTimestamp] = useState(null);
  const [vendor, setVendor] = useState(null);
  const [photoBlob, setPhotoBlob] = useState(null);

  // ✅ ADDED
  const [photoPreview, setPhotoPreview] = useState(null);

  const [cameraStream, setCameraStream] = useState(null);

  const nav = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  /* ===========================
     🔐 AUTH CHECK
  ============================ */
  useEffect(() => {
    const v = localStorage.getItem("vendor");
    if (!v) nav("/");
    else setVendor(v);
  }, [nav]);

  /* ===========================
     📍 FAST LOCATION PICKUP
  ============================ */
  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => alert("Location permission required"),
      { enableHighAccuracy: false, timeout: 8000 }
    );
  }, []);

  /* ===========================
     ⏱️ TIMESTAMP
  ============================ */
  useEffect(() => {
    const interval = setInterval(() => {
      setTimestamp(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  /* ===========================
     📸 CAMERA INIT
  ============================ */
  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setCameraStream(stream);
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch {
        alert("Camera access is required");
      }
    }

    startCamera();

    return () => {
      cameraStream?.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ===========================
     📸 CAPTURE PHOTO
  ============================ */
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return alert("Photo capture failed");

        setPhotoBlob(blob);

        // ✅ ADDED: PREVIEW LOGIC
        setPhotoPreview(URL.createObjectURL(blob));
      },
      "image/jpeg",
      0.9
    );

    // ❌ Do not stop camera here; stop after successful submit
  };

  /* ===========================
     ✅ SUBMIT CHECK-IN 
  ============================ */
  const submit = async (e) => {
    e.preventDefault();

    if (!location) return alert("Location is required");
    if (!timestamp) return alert("Timestamp is required");
    if (!photoBlob) return alert("Photo is required");

    setLoading(true);

    const form = new FormData();
    form.append("vendor", vendor);
    form.append("photo", photoBlob, "checkin.jpg");
    form.append("lat", location.lat);
    form.append("lng", location.lng);

    // ✅ LOCAL TIMESTAMP LOGIC
    const tzOffset = timestamp.getTimezoneOffset() * 60000; // offset in ms
    const localISOTime = new Date(timestamp - tzOffset).toISOString().slice(0, -1); // remove 'Z'
    form.append("timestamp", localISOTime);

    try {
      await api.post("/checkin", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setCheckedIn(true);

      // ✅ STOP CAMERA ONLY AFTER SUCCESSFUL SUBMIT
      cameraStream?.getTracks().forEach((t) => t.stop());
      setCameraStream(null);
    } catch (err) {
      if (!err.response) alert("Backend not connected");
      else alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  /* ===========================
     🚪 LOGOUT
  ============================ */
  const logout = () => {
    cameraStream?.getTracks().forEach((t) => t.stop());
    localStorage.removeItem("vendor");
    nav("/");
  };

  return (
    <div className="card">
      <p className="step">Step 1 of 4: Vendor Check-In</p>

      {vendor && (
        <div className="auth-bar">
          <span>👤 Logged in as <b>{vendor}</b></span>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      )}

      <h2>Vendor Check-In</h2>

      {!location && <p className="info">📍 Fetching location…</p>}

      {location && (
        <div className="location-box">
          <p><b>Latitude:</b> {location.lat}</p>
          <p><b>Longitude:</b> {location.lng}</p>
        </div>
      )}

      {timestamp && (
        <div className="location-box">
          <p><b>Timestamp:</b></p>
          <p>{timestamp.toLocaleString()}</p>
        </div>
      )}

      {!checkedIn ? (
        <form onSubmit={submit}>
          {!photoBlob && (
            <div className="camera-box">
              <video ref={videoRef} autoPlay playsInline style={{ width: "100%", maxHeight: 300 }} />
              <canvas ref={canvasRef} style={{ display: "none" }} />

              <button
                type="button"
                onClick={capturePhoto}
                disabled={!location || !timestamp}
              >
                Capture Photo
              </button>
            </div>
          )}

          {photoPreview && (
            <img
              src={photoPreview}
              alt="Captured"
              style={{ width: "100%", marginTop: 10, borderRadius: 6 }}
            />
          )}

          {photoBlob && <p className="success">✅ Photo captured</p>}

          <button
            type="submit"
            disabled={loading || !location || !timestamp || !photoBlob}
          >
            {loading ? "Checking In…" : "Check In"}
          </button>
        </form>
      ) : (
        <>
          <p className="success">✅ Vendor checked in successfully</p>
          <button onClick={() => nav("/otp")}>Proceed to Customer OTP</button>
        </>
      )}
    </div>
  );
}
