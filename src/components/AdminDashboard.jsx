import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Axios from "axios";
import "../style/AdminDashboard.css";

const AdminDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  // Fetch restaurants, orders, and users if needed for display
  useEffect(() => {
    // Example code for fetching data (adjust the URLs and logic according to your backend)
    // Fetching restaurants

    // Fetching orders
  }, []);

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      {error && <div className="error">{error}</div>}

      <div className="dashboard-actions">
        <div className="section">
          <h3>Manage Foods</h3>
          <Link to="/foods">View Food</Link>
          <Link to="/admin/foods/add">Add Food</Link>
        </div>

        <div className="section">
          <h3>Manage Users</h3>
          <Link to="/admin/employees">View Employees</Link>
          <Link to="/admin/signup">Add an Employee</Link>
        </div>

        {/* New Discount Code Management Section */}
        <div className="section">
          <h3>Manage Discount Codes</h3>
          <Link to="/admin/discounts">View Discount Codes</Link>
          <Link to="/admin/adddiscounts">Add Discount Code</Link>
        </div>

        {/* New Sales & Revenue Section */}
        <div className="section">
          <h3>Sales & Revenue</h3>
          <Link to="/admin/most-sold-foods">See Most Sold Foods</Link>
          <Link to="/admin/restaurant-income">See Restaurant Income</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
