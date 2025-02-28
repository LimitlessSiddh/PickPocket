import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Register.css"; // ✅ Ensure this CSS file is updated
import axios from "axios";
import GoogleSignButton from "../components/GoogleButton";


const Register = ({ setUser }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // ✅ Basic Input Validation
    if (!username || !email || !password) {
      setError("All fields are required!");
      setLoading(false);
      return;
    }

    try {
      console.log("🔍 Sending registration request...");
      const response = await axios.post("http://localhost:5002/api/auth/register", {
        username,
        email,
        password,
      });

      console.log("✅ Server response:", response.data);

      if (response.status === 201) {
        const { token, user } = response.data;

        // ✅ Store token and user info
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);

        // ✅ Redirect to profile after successful sign-up
        navigate("/profile");
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("❌ Registration error:", err);

      // ✅ Handle API Response Errors
      if (err.response) {
        if (err.response.status === 400) {
          setError("Email or username already in use.");
        } else {
          setError(err.response.data.message || "Something went wrong. Try again.");
        }
      } else {
        setError("Could not connect to server. Check your internet connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Join PickPocket</h2>
        <p className="register-subtitle">Create an account to start tracking your bets.</p>

        {error && <p className="register-error">{error}</p>}

        <form onSubmit={handleRegister}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="register-footer">
          <Link to={"/login"}>Already have an account?</Link>
        </p>
        <GoogleSignButton setUser = { setUser }/>
      </div>
    </div>
  );
};

export default Register;



