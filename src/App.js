import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import CheckIn from "./pages/CheckIn";
import OTPStart from "./pages/OTPStart";
import SetupProgress from "./pages/SetupProgress";
// import CloseEvent from "./pages/CloseEvent";
import ThankYou from "./pages/ThankYou";
import CloseEvent from "./pages/CloseEvent";
import CloseOtpVerify from "./pages/CloseOtpVerify";
import "./styles.css";

export default function App() { 
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/checkin" element={<CheckIn />} />
        <Route path="/otp" element={<OTPStart />} />
        <Route path="/setup" element={<SetupProgress />} />
        <Route path="/close" element={<CloseEvent />} />
        <Route path="/close-event" element={<CloseEvent />} />
        <Route path="/close-otp" element={<CloseOtpVerify />} />    
        <Route path="/thank-you" element={<ThankYou />} />
      </Routes>
    </BrowserRouter>
  );
}
