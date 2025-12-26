import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [name, setName] = useState("");
  const nav = useNavigate();

  const login = () => {
    if (!name) return alert("Enter vendor name");
    localStorage.setItem("vendor", name);
    nav("/checkin");
  };

  return (
    <div className="card">
      <h2>Vendor Login</h2>

      <input
        placeholder="Vendor Name"
        onChange={(e) => setName(e.target.value)}
      />

      <button onClick={login}>Login</button>
    </div>
  );
}
