import { useEffect, useState } from "react";
import Axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "../style/EmployeeEdit.css"; // Ensure the appropriate styling is added

const EmployeeEdit = () => {
  const { employeeId } = useParams(); // Get employeeId from the URL params
  const navigate = useNavigate();
  const { state } = useLocation(); // Get the state passed from the previous page

  // Set individual attributes instead of an employee object
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    // If employee data is passed through state, set it
    if (state && state.employee) {
      const { username, password } = state.employee; // Destructure employee data
      setUsername(username);
      setPassword(password);
    } else {
      setError("Employee data is not available.");
    }
  }, [state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "username") {
      setUsername(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");

    // Log to debug payload and token
    console.log("Employee Data:", { username, password });
    console.log("Authorization Token:", token);

    if (!token) {
      setError("Unauthorized! Please login again.");
      return;
    }

    try {
      // Send PUT request to update employee with the correct payload format
      await Axios.put(
        `http://127.0.0.1:8000/api/admin/employee/edit/${employeeId}/`,
        { username, password },  // Send username and password as a JSON object
        {
          headers: {
            Authorization: `Token ${token}`, // Correct token value from localStorage
            "Content-Type": "application/json", // Ensure the correct Content-Type
          },
        }
      );

      alert("Employee details updated successfully!");
      navigate("/admin/employees"); // Redirect to employee list
    } catch (err) {
      // Log the error response to investigate further
      console.error("Error response:", err.response);
      setError(`Failed to update employee details: ${err.response?.data?.detail || err.message}`);
    }
  };

  if (error) return <div className="error">{error}</div>;

  return (
    <div className="employee-edit-container">
      <h2>Edit Employee: {username}</h2>
      <form onSubmit={handleSave}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
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
            value={password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit">Save Changes</button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeEdit;
