import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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

    if (!username || !email || !password) {
      setError("All fields are required!");
      setLoading(false);
      return;
    }

    try {
      console.log("Sending registration request...");
      const response = await axios.post("http://localhost:5002/api/auth/register", {
        username,
        email,
        password,
      });

      console.log("Server response:", response.data);

      if (response.status === 201) {
        const { token, user } = response.data;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);

        navigate("/profile");
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Registration error:", err);

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
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-gray-900 text-white p-6 rounded-lg shadow-lg">
        
        <h2 className="text-2xl font-bold text-center">Join PickPocket</h2>
        <p className="text-gray-400 text-center mb-4">Create an account to start tracking your bets.</p>

        {error && <p className="text-red-500 text-center mb-3">{error}</p>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-md border border-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-400 outline-none disabled:opacity-50"
            />
          </div>

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
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-3">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Log in
          </Link>
        </p>

        <div className="flex justify-center items-center mt-4">
          <GoogleSignButton setUser={setUser} setError={setError} />
        </div>
      </div>
    </div>
  );
};

export default Register;