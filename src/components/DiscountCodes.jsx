import { useState, useEffect } from "react";
import Axios from "axios";
import "../style/DiscountCodes.css";

const DiscountCodes = () => {
  const [discounts, setDiscounts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDiscountCodes();
  }, []);

  // Fetch all discount codes
  const fetchDiscountCodes = () => {
    const token = localStorage.getItem("authToken");
    Axios.get("http://127.0.0.1:8000/api/admin/discountcodes/", {
      headers: { Authorization: `Token ${token}` },
    })
      .then((response) => {
        setDiscounts(response.data);
      })
      .catch(() => {
        setError("Failed to fetch discount codes.");
      });
  };

  // Delete a discount code
  const handleDelete = (codeId) => {
    const token = localStorage.getItem("authToken");
    if (window.confirm("Are you sure you want to delete this discount code?")) {
      Axios.delete(`http://127.0.0.1:8000/api/admin/discountcode/delete/${codeId}/`, {
        headers: { Authorization: `Token ${token}` },
      })
        .then(() => {
          setDiscounts(discounts.filter((code) => code.id !== codeId));
          alert("Discount code deleted successfully!");
        })
        .catch(() => {
          alert("Failed to delete discount code.");
        });
    }
  };

  // Format date-time to "YYYY-MM-DD HH:mm:ss"
  const formatDateTime = (dateTime) => {
    if (!dateTime) return "";
    const date = new Date(dateTime);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  return (
    <div className="discount-codes-page">
      <h2>Manage Discount Codes</h2>

      {error && <p className="error">{error}</p>}

      <div className="discount-list">
        {discounts.length === 0 ? (
          <p>No discount codes available.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Discount (%)</th>
                <th>Expiration Date & Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {discounts.map((discount) => (
                <tr key={discount.id}>
                  <td>{discount.code}</td>
                  <td>{discount.discount_percent}%</td>
                  <td>{formatDateTime(discount.expiration_date)}</td>
                  <td>
                    <button className="delete-btn" onClick={() => handleDelete(discount.id)}>
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DiscountCodes;
