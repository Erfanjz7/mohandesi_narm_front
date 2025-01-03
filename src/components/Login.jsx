import { useState, useEffect } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import "../style/Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Clear auth token and role from localStorage when the Login component mounts
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Sending login request using Axios
      const response = await Axios.post("http://127.0.0.1:8000/api/login/", {
        username,
        password,
      });

      if (response.status === 200) {
        const { token, role } = response.data;
        localStorage.setItem("authToken", token); // Store auth token
        localStorage.setItem("userRole", role);  // Store user role

        // Navigate based on role
        switch (role) {
          case "admin":
            navigate("/admin-dashboard");
            break;
          case "employee":
            navigate("/employee-dashboard");
            break;
          case "customer":
            navigate("/customer-dashboard");
            break;
          default:
            navigate("/login");
        }
      }
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 401) {
        setError("Invalid credentials. Please try again.");
      } else {
        setError("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <div className="error">{error}</div>}

        <div>
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
