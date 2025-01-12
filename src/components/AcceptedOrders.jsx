import { useEffect, useState } from "react";
import Axios from "axios";
import "../style/EmployeeOrders.css";

const AcceptedOrders = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async (page) => {
      try {
        const token = localStorage.getItem("authToken");

        if (!token) {
          setError("Unauthorized! Please login again.");
          setLoading(false);
          return;
        }

        const response = await Axios.get("http://127.0.0.1:8000/api/employee/orders/accepted", {
          headers: { Authorization: `Token ${token}` },
          params: { size: 10, page },
        });

        setOrders(response.data.data);
        setCurrentPage(response.data.page);
        setTotalPages(response.data.total_pages);
        setLoading(false);
      } catch (err) {
        setError("Failed to load orders.");
        setLoading(false);
      }
    };

    fetchOrders(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    setLoading(true);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="orders-container">
      <h2>Accepted Orders</h2>
      <table>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Items Count</th>
            <th>Total Price</th>
            <th>Discount Code</th>
            <th>Order Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.customer_name}</td>
              <td>{order.foods.length}</td>
              <td>${order.total_price}</td>
              <td>{order.discount_code ? order.discount_code : "N/A"}</td>
              <td>{order.order_date}</td>
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

export default AcceptedOrders;
