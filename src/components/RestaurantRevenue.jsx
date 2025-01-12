import { useState } from "react";
import Axios from "axios";
import "../style/RestaurantRevenue.css";

const RestaurantRevenue = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [orders, setOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRevenueData = async () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Unauthorized! Please login.");
        setLoading(false);
        return;
      }

      const response = await Axios.get("http://127.0.0.1:8000/api/admin/ordersandrevenue/", {
        headers: { Authorization: `Token ${token}` },
        params: { start_date: startDate, end_date: endDate },
      });

      setOrders(response.data.orders || []);
      setTotalRevenue(response.data.total_revenue || 0);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch revenue data.");
      setLoading(false);
    }
  };

  return (
    <div className="restaurant-revenue">
      <h2>Restaurant Revenue</h2>

      <div className="date-selection">
        <label>Start Date:</label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />

        <label>End Date:</label>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />

        <button onClick={fetchRevenueData}>Calculate Revenue</button>
      </div>

      {error && <div className="error">{error}</div>}
      {loading && <div className="loading">Loading...</div>}

      {!loading && !error && (
        <>
          <h3>Total Revenue: {totalRevenue.toFixed(2)} IRR</h3>

          <div className="orders-table">
            <h3>Orders in Selected Period</h3>
            {orders.length === 0 ? (
              <p>No orders found.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Total Price</th>
                    <th>Items</th>
                  </tr>
                </thead>
                <tbody>
                {orders.map((order) => (
                    <tr key={order.id}>
                    <td>{order.customer_name}</td>
                    <td>{order.date}</td>
                    <td>{order.status}</td>
                    <td>{parseFloat(order.total_price).toFixed(2)} IRR</td>
                    <td>{order.items ? order.items.join(", ") : "No items"}</td>  {/* ✅ Fix applied */}
                    </tr>
                ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default RestaurantRevenue;
