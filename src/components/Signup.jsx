import { useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import "../style/Signup.css";

const Signup = () => {
  const [userData, setUserData] = useState({
    username: "",
    password: "",
    first_name: "",
    email: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);

      const endpoint = "http://127.0.0.1:8000/api/signup/";

      const response = await Axios.post(endpoint, userData);

      if (response.status === 201) {
        alert("Account created successfully!");
        localStorage.removeItem("authToken"); // Remove auth token
        localStorage.removeItem("userRole");  // Remove user role
        navigate("/login");
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "An error occurred. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={userData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="first_name">First Name</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={userData.first_name}
            onChange={handleChange}
            required
          />
        </div>
        {error && <div className="error">{error}</div>}
        <div>
          <button type="submit" disabled={loading}>
            {loading ? "Signing up..." : "Signup"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
