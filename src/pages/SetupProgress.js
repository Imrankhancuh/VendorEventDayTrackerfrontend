import api from "../api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SetupProgress() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData();

    // 🟢 Pre-setup
    form.append("preNotes", e.target.preNotes.value);
    for (let file of e.target.prePhotos.files) {
      form.append("prePhotos", file);
    }

    // 🔵 Post-setup
    form.append("postNotes", e.target.postNotes.value);
    for (let file of e.target.postPhotos.files) {
      form.append("postPhotos", file);
    }

    try {
      await api.post("/setup", form);
      setSubmitted(true);
    } catch (err) {
      alert("Setup upload failed");
    }

    setLoading(false);
  };

  return (
    <div className="card">
      <p className="step">Step 3 of 4: Event Setup Progress</p>

      {!submitted ? (
        <form onSubmit={submit}>

          {/* 🟢 PRE-SETUP */}
          <h3>Pre-Setup</h3>

          <label>Upload pre-setup photos</label>
          <input
            type="file"
            name="prePhotos"
            multiple
            required
          />

          <textarea
            name="preNotes"
            placeholder="Pre-setup notes (optional)"
          />

          <hr />

          {/* 🔵 POST-SETUP */}
          <h3>Post-Setup</h3>

          <label>Upload post-setup photos</label>
          <input
            type="file"
            name="postPhotos"
            multiple
            required
          />

          <textarea
            name="postNotes"
            placeholder="Post-setup notes (optional)"
          />

          <button disabled={loading}>
            {loading ? "Submitting..." : "Submit Setup"}
          </button>
        </form>
      ) : (
        <>
          <p className="success">
            ✅ Pre & Post setup successfully submitted
          </p>

          <button onClick={() => nav("/close")}>
            Proceed to Close Event
          </button>
        </>
      )}
    </div>
  );
}
