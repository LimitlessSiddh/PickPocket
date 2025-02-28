import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css"; // ✅ Ensure this CSS file exists
import axios from "axios";
import GoogleButton from "../components/GoogleButton";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("🔍 Sending login request...");
      const response = await axios.post("http://localhost:5002/api/auth/login", {
        email,
        password,
      });

      console.log("✅ Server response:", response.data);

      if (response.status === 200 && response.data.token) {
        const { token, user } = response.data;

        // ✅ Store token and user info in local storage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);

        console.log("🟢 Token Saved:", localStorage.getItem("token"));

        // ✅ Redirect user to profile after successful login
        navigate("/profile");
      } else {
        console.error("❌ No token received.");
        setError("Invalid email or password");
      }
    } catch (err) {
      console.error("❌ Login error:", err.response?.data || err);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Log in to track your bets and compete.</p>

        {error && <p className="login-error">{error}</p>}

        <form onSubmit={handleLogin}>
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

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="login-footer">
        <Link to={"/login"}>Don't have an account?</Link>
        </p>
        <GoogleButton/>
      </div>
    </div>
  );
};

export default Login;
