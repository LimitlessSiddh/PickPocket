import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import GoogleSignButton from "../components/GoogleButton";

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

      console.log("Server response:", response.data);

      if (response.status === 200 && response.data.token) {
        const { token, user } = response.data;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);

        console.log("Token Saved:", localStorage.getItem("token"));

        navigate("/profile");
      } else {
        console.error("No token received.");
        setError("Invalid email or password");
      }
    } catch (err) {
      console.error(" Login error:", err.response?.data || err);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-[#0a192f] text-white p-6 rounded-lg shadow-lg">
        
        <h2 className="text-2xl font-bold text-center">Welcome Back</h2>
        <p className="text-gray-400 text-center mb-4">Log in to track your bets and compete.</p>

        {error && <p className="text-red-500 text-center mb-3">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-md border border-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-400 outline-none disabled:opacity-50"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-md border border-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-400 outline-none disabled:opacity-50"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 transition py-3 text-lg font-semibold rounded-md disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-3">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-400 hover:underline">
            Sign up
          </Link>
        </p>

        <div className="flex justify-center items-center mt-4">
          <GoogleSignButton setUser={setUser} setError={setError} />
        </div>
      </div>
    </div>
  );
};

export default Login;