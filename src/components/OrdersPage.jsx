import { useEffect, useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import "../style/OrdersPage.css";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("authToken");

        if (!token) {
          setError("Unauthorized! Please login again.");
          setLoading(false);
          return;
        }

        const response = await Axios.get("http://127.0.0.1:8000/api/orders/", {
          headers: { Authorization: `Token ${token}` },
          params: { page: page },
        });

        setOrders(response.data.data || []); // Ensure `data` exists
        setTotalPages(response.data.total_pages || 1);
        setLoading(false);
      } catch (err) {
        setError("Failed to load orders.");
        setLoading(false);
      }
    };

    fetchOrders();
  }, [page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const goToOrderDetail = (orderId) => {
    navigate(`/customer/order-detail/${orderId}`);
  };

  return (
    <div className="orders-page">
      {/* Navbar */}
      <div className="navbar">
        <h2>Your Orders</h2>
        <button onClick={() => navigate(`/customer-dashboard`)}>Back</button>
      </div>

      {/* Loading and Error Handling */}
      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}

      {/* Orders List */}
      {!loading && !error && (
        <>
          <div className="orders-list">
            {orders.length === 0 ? (
              <p>You have no orders yet.</p>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="order-card"
                  onClick={() => goToOrderDetail(order.id)}
                >
                  <h3>Order #{order.id}</h3>
                  <p><strong>Customer Name:</strong> {order.customer_name}</p>
                  <p><strong>Date:</strong> {order.order_date}</p>
                  <p><strong>Status:</strong> {order.status}</p>
                  <p><strong>Total Price:</strong> {parseFloat(order.total_price).toFixed(2)} IRR</p>
                  <p><strong>Items:</strong> {order.foods && order.foods.length > 0 
                    ? order.foods.map(food => food.name).join(", ") 
                    : "No items"}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Pagination Controls */}
          <div className="pagination">
            <button onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>
              Previous
            </button>
            <span>Page {page} of {totalPages}</span>
            <button onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default OrdersPage;
