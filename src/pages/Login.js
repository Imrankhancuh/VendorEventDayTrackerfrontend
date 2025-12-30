// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../api";

// export default function Login() {
//   const [name, setName] = useState("");
//   const [mobile, setMobile] = useState("");
//   const [step, setStep] = useState(1); // 1 = send OTP, 2 = verify OTP
//   const [otp, setOtp] = useState("");
//   const nav = useNavigate();

//   const sendOtp = async () => {
//     if (!name || !mobile) return alert("Enter name and mobile number");

//     try {
//       await api.post("/otp", { mobile });
//       localStorage.setItem("vendor", name);
//       localStorage.setItem("mobile", mobile);
//       alert("OTP sent (mock). Check backend terminal.");
//       setStep(2);
//     } catch (err) {
//       alert("Error sending OTP");
//       console.error(err);
//     }
//   };

//   const verifyOtp = async () => {
//     try {
//       const mobile = localStorage.getItem("mobile");
//       await api.post("/otp/verify", { mobile, otp });
//       alert("OTP verified! Login successful ✅");
//       nav("/checkin");
//     } catch (err) {
//       alert(err.response?.data?.error || "Verification failed");
//     }
//   };

//   return (
//     <div className="card">
//       <h2>Vendor Login</h2>

//       {step === 1 && (
//         <>
//           <input
//             placeholder="Vendor Name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//           />
//           <input
//             placeholder="Mobile Number"
//             value={mobile}
//             maxLength={10}
//             onChange={(e) => setMobile(e.target.value)}
//           />
//           <button onClick={sendOtp}>Send OTP</button>
//         </>
//       )}

//       {step === 2 && (
//         <>
//           <p>OTP sent to {mobile}</p>
//           <input
//             placeholder="Enter OTP"
//             value={otp}
//             onChange={(e) => setOtp(e.target.value)}
//           />
//           <button onClick={verifyOtp}>Verify OTP</button>
//         </>
//       )}
//     </div>
//   );
// }
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Login() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [step, setStep] = useState(1); // 1 = send OTP, 2 = verify OTP
  const [otp, setOtp] = useState("");
  const nav = useNavigate();

  // 🔥 DO NOT CHANGE THIS LOGIC
  const login = async () => {
    await api.post("/auth/login", {
      name,
      mobile
    });

    // then send OTP
    await api.post("/otp", { mobile });
  };

  // 🔁 Uses login() internally
  const sendOtp = async () => {
    if (!name || !mobile) {
      return alert("Enter name and mobile number");
    }

    try {
      await login(); // ✅ MongoDB save + OTP send

      localStorage.setItem("vendor", name);
      localStorage.setItem("mobile", mobile);

      alert("OTP sent (mock). Check backend terminal.");
      setStep(2);
    } catch (err) {
      console.error(err);
      alert("Error sending OTP");
    }
  };

  const verifyOtp = async () => {
    try {
      const mobile = localStorage.getItem("mobile");

      await api.post("/otp/verify", {
        mobile,
        otp
      });

      alert("OTP verified! Login successful ✅");
      nav("/checkin");
    } catch (err) {
      alert(err.response?.data?.error || "Verification failed");
    }
  };

  return (
    <div className="card">
      <h2>Vendor Login</h2>

      {step === 1 && (
        <>
          <input
            placeholder="Vendor Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input 
            placeholder="Mobile Number"
            value={mobile}
            maxLength={10}
            onChange={(e) => setMobile(e.target.value)}
          />

          <button onClick={sendOtp}>Send OTP</button>
        </>
      )}

      {step === 2 && (
        <>
          <p>OTP sent to {mobile}</p>

          <input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <button onClick={verifyOtp}>Verify OTP</button>
        </>
      )}
    </div>
  );
}
