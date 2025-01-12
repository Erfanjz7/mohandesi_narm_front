import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Axios from "axios";
import "../style/OrderDetailPage.css";

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem("authToken");

        if (!token) {
          setError("Unauthorized! Please login again.");
          setLoading(false);
          return;
        }

        const response = await Axios.get(`http://127.0.0.1:8000/api/orderdetail/${id}/`, {
          headers: { Authorization: `Token ${token}` },
        });

        setOrder(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load order details.");
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="order-detail-page">
      <h1>Order #{order.id} Details</h1>
      <p><strong>Customer Name:</strong> {order.customer_name}</p>
      <p><strong>Date:</strong> {order.order_date}</p>
      <p><strong>Status:</strong> {order.status}</p>
      <p><strong>Created At:</strong> {new Date(order.created_at).toLocaleString()}</p>
      <p><strong>Updated At:</strong> {new Date(order.updated_at).toLocaleString()}</p>
      
      <h3>Ordered Items:</h3>
      {order.foods && order.foods.length > 0 ? (
        <ul>
          {order.foods.map((food) => (
            <li key={food.id}>
              <button onClick={() => navigate(`/food/detail/${food.id}`)}>
                {food.name}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No items in this order.</p>
      )}

      <h3>Total Price: {parseFloat(order.total_price).toFixed(2)} IRR</h3>

      <button onClick={() => navigate("/customer/orders")}>Back to Orders</button>
    </div>
  );
};

export default OrderDetailPage;
