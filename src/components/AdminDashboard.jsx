import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Axios from "axios";
import "../style/AdminDashboard.css";

const AdminDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch restaurants
    Axios.get("http://127.0.0.1:8000/api/restaurants/")
      .then((response) => setRestaurants(response.data))
      .catch((error) => setError("Failed to fetch restaurants"));

    // Fetch orders
    Axios.get("http://127.0.0.1:8000/api/orders/")
      .then((response) => setOrders(response.data))
      .catch((error) => setError("Failed to fetch orders"));

    // Fetch users
    Axios.get("http://127.0.0.1:8000/api/users/")
      .then((response) => setUsers(response.data))
      .catch((error) => setError("Failed to fetch users"));
  }, []);

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      {error && <div className="error">{error}</div>}

      <div className="dashboard-actions">
        <div className="section">
          <h3>Manage Foods</h3>
          <Link to="/restaurants">View Restaurants</Link>
          <Link to="/admin/restaurants/add">Add New Restaurant</Link>
        </div>

        <div className="section">
          <h3>Manage Orders</h3>
          <Link to="/admin/orders">View Orders</Link>
          <Link to="/admin/orders/manage">Process Orders</Link>
        </div>

        <div className="section">
          <h3>Manage Users</h3>
          <Link to="/admin/users">View Users</Link>
          <Link to="/signup">Add a User</Link>
        </div>

        <div className="section">
          <h3>View Analytics</h3>
          <Link to="/admin/analytics">View Analytics</Link>
        </div>

        <div className="section">
          <h3>Manage Categories</h3>
          <Link to="/admin/categories">View Categories</Link>
          <Link to="/admin/categories/manage">Manage Categories</Link>
        </div>
      </div>

      <div className="dashboard-data">
        <h3>Recent Data</h3>

        <div className="recent-restaurants">
          <h4>Recent Restaurants</h4>
          <ul>
            {restaurants.slice(0, 5).map((restaurant) => (
              <li key={restaurant.id}>{restaurant.name}</li>
            ))}
          </ul>
        </div>

        <div className="recent-orders">
          <h4>Recent Orders</h4>
          <ul>
            {orders.slice(0, 5).map((order) => (
              <li key={order.id}>
                {order.customer} - {order.totalPrice} - {order.status}
              </li>
            ))}
          </ul>
        </div>

        <div className="recent-users">
          <h4>Recent Users</h4>
          <ul>
            {users.slice(0, 5).map((user) => (
              <li key={user.id}>{user.username}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
