import { useEffect, useState } from "react";
import Axios from "axios";
import "../style/EmployeeDashboard.css";

const EmployeeDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch orders assigned to the employee
    Axios.get("http://127.0.0.1:8000/api/employee/orders/")
      .then((response) => {
        setOrders(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load orders.");
        setLoading(false);
      });
  }, []);

  const handleAcceptOrder = async (orderId) => {
    try {
      await Axios.put(`http://127.0.0.1:8000/api/employee/orders/${orderId}/accept/`);
      alert("Order accepted successfully!");
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: "ACCEPTED" } : order
        )
      );
    } catch (err) {
      alert("Failed to accept order.");
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="employee-dashboard">
      <h1>Employee Dashboard</h1>
      <div className="orders-container">
        <h2>Pending Orders</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Address</th>
              <th>Order Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders
              .filter((order) => order.status === "PENDING")
              .map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.address}</td>
                  <td>{order.order_date}</td>
                  <td>
                    <button onClick={() => handleAcceptOrder(order.id)}>Accept</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <h2>Accepted Orders</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Address</th>
              <th>Order Date</th>
            </tr>
          </thead>
          <tbody>
            {orders
              .filter((order) => order.status === "ACCEPTED")
              .map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.address}</td>
                  <td>{order.order_date}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
