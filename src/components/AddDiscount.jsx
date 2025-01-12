import { useState } from "react";
import Axios from "axios";
import "../style/AddDiscount.css";

const AddDiscount = () => {
  const [discountCode, setDiscountCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Function to generate a random 8-character discount code
  const generateDiscountCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    setDiscountCode(code);
  };

  // Get current date-time in YYYY-MM-DDTHH:MM format for input min attribute
  const getMinDateTime = () => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  };

  // Format expiration date to "YYYY-MM-DD HH:mm:ss"
  const formatExpirationDate = (dateTime) => {
    if (!dateTime) return "";
    const date = new Date(dateTime);
    return date.toISOString().slice(0, 19).replace("T", " ");
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    if (!discountCode || !discountPercent || !expirationDate) {
      setError("All fields are required.");
      return;
    }

    const formattedExpirationDate = formatExpirationDate(expirationDate);
    const token = localStorage.getItem("authToken");

    Axios.post(
      "http://127.0.0.1:8000/api/admin/adddiscountcode/",
      {
        code: discountCode,
        discount_percent: discountPercent,
        expiration_date: formattedExpirationDate, // Send properly formatted date
      },
      { headers: { Authorization: `Token ${token}` } }
    )
      .then(() => {
        setMessage("Discount code added successfully!");
        setDiscountCode("");
        setDiscountPercent("");
        setExpirationDate("");
      })
      .catch(() => {
        setError("Failed to add discount code. Please try again.");
      });
  };

  return (
    <div className="add-discount-page">
      <h2>Add Discount Code</h2>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Discount Code:</label>
          <input type="text" value={discountCode} readOnly />
          <button type="button" onClick={generateDiscountCode}>Generate Code</button>
        </div>

        <div className="form-group">
          <label>Discount Percent:</label>
          <input
            type="number"
            value={discountPercent}
            onChange={(e) => setDiscountPercent(e.target.value)}
            placeholder="Enter discount percentage"
            min="1"
            max="100"
            required
          />
        </div>

        <div className="form-group">
          <label>Expiration Date & Time:</label>
          <input
            type="datetime-local"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            min={getMinDateTime()} // Prevent selecting past dates
            required
          />
        </div>

        <button type="submit" className="submit-btn">Add Discount Code</button>
      </form>
    </div>
  );
};

export default AddDiscount;
