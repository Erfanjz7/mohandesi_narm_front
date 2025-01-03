import { useEffect, useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import "../style/EmployeeOrders.css";

const PendingOrders = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async (page) => {
      try {
        const token = localStorage.getItem("authToken");

        if (!token) {
          setError("Unauthorized! Please login again.");
          setLoading(false);
          return;
        }

        const response = await Axios.get("http://127.0.0.1:8000/api/employee/orders/pending", {
          headers: {
            Authorization: `Token ${token}`,
          },
          params: {
            size: 10,
            page,
          },
        });

        setOrders(response.data.data); // Set the orders for the current page
        setCurrentPage(response.data.page); // Set the current page
        setTotalPages(response.data.total_pages); // Set the total number of pages
        setLoading(false);
      } catch (err) {
        setError("Failed to load orders.");
        setLoading(false);
      }
    };

    fetchOrders(currentPage);
  }, [currentPage]);

  const handleAcceptOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        alert("Unauthorized! Please login again.");
        return;
      }

      // Send the POST request to accept the order
      await Axios.post(
        `http://127.0.0.1:8000/api/employee/orders/accept/${orderId}/`,
        { status: "ACCEPTED" },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      alert("Order accepted successfully!");

      // Remove the accepted order from the list of pending orders
      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
    } catch (err) {
      console.error("Error accepting the order:", err);
      alert("Failed to accept order.");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    setLoading(true);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
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
          {orders.map((order) => (
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

      {/* Pagination Controls */}
      <div className="pagination">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default PendingOrders;
