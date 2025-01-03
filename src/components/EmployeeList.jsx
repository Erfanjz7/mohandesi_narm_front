import { useEffect, useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import "../style/EmployeeList.css";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("userRole") === "admin";

  useEffect(() => {
    if (!isAdmin) {
      navigate("/login"); // Redirect to login if not an admin
      return;
    }

    // Fetch employees data
    Axios.get("http://127.0.0.1:8000/api/admin/employees/")
      .then((response) => {
        setEmployees(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load employees data.");
        setLoading(false);
      });
  }, [isAdmin, navigate]);

  const handleDelete = async (employeeId) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;

    try {
      await Axios.delete(`http://127.0.0.1:8000/api/admin/employees/${employeeId}/`);
      alert("Employee deleted successfully");
      setEmployees((prev) => prev.filter((emp) => emp.id !== employeeId));
    } catch (err) {
      alert("Failed to delete employee.");
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="employee-list-container">
      <h2>Employees List</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>{employee.username}</td>
              <td>{employee.email}</td>
              <td>{employee.first_name}</td>
              <td>{employee.last_name}</td>
              <td>
                <button onClick={() => navigate(`/admin/employees/edit/${employee.id}`)}>
                  Edit
                </button>
                <button onClick={() => handleDelete(employee.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;
