import { useNavigate } from "react-router-dom";

export default function ThankYou() {
  const nav = useNavigate();

  return (
    <div className="card" style={{ textAlign: "center" }}>
      <h2>🎉 Event Completed</h2>

      <p style={{ marginTop: 15, fontSize: 16 }}>
        Thank you for giving the information.
      </p>

      <button
        style={{ marginTop: 25 }}
        onClick={() => nav("/")}
      >
        Go to Home
      </button>
    </div>
  );
}
 