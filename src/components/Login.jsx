import { useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import '../style/Login.css';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      console.log(response.data , " / " , response.status)
      console.log("eheeeeeeeeee")

      if (response.status === 200) {
        const { token, role } = response.data;
        localStorage.setItem("authToken", token); 
        console.log("token : " , token);
        console.log("status : " , response.status)// 
        console.log("role : " , role)// Store the auth token in localStorage
        localStorage.setItem("userRole", role);

        // Navigate based on role after a short delay to ensure state update
        
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
        // Adding a slight delay to ensure the token is stored before navigation
      }
    } catch (error) {
      console.log("ridi")
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
