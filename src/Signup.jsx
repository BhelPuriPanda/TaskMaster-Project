import React, { useState } from "react";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const provider = new GoogleAuthProvider();

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/dashboard"); // Redirect after signup
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    try {
      await signInWithPopup(auth, provider);
      navigate("/dashboard"); // Redirect after Google signup
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ display: "block", marginBottom: "10px", padding: "8px" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ display: "block", marginBottom: "10px", padding: "8px" }}
        />
        <button type="submit" style={{ padding: "8px 12px" }}>Sign Up</button>
      </form>

      <button
        onClick={handleGoogleSignup}
        style={{ marginTop: "15px", padding: "8px 12px" }}
      >
        Sign up with Google
      </button>
      <p style={{ marginTop: "10px" }}>
        Already have an account? <Link to="/login">Log in</Link>
      </p>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </div>
  );
}
