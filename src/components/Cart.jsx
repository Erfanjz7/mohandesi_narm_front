import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import "../style/Cart.css";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  // Fetch cart items from the backend
  const fetchCart = () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      Axios.get("http://127.0.0.1:8000/api/cart", {
        headers: { Authorization: `Token ${token}` },
      })
        .then((response) => {
          setCart(response.data.cart_items);
          setTotalPrice(response.data.total_price); // Set total price
        })
        .catch((error) => {
          console.error("Failed to fetch cart items", error);
        });
    } else {
      alert("You must be logged in to view the cart.");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Handle quantity change (increase/decrease)
  const handleQuantityChange = (item, action) => {
    const token = localStorage.getItem("authToken");

    if (action === -1) {
      // Decrease quantity, send a delete request with item.id
      Axios.delete(`http://127.0.0.1:8000/api/food/delete-from-cart/${item.id}/`, {
        headers: { Authorization: `Token ${token}` },
      })
        .then(() => {
          // After successfully deleting the item, fetch the updated cart
          fetchCart();
        })
        .catch((error) => {
          console.error("Failed to decrease item quantity", error);
        });
    } else if (action === 1) {
      // Increase quantity, send an add request
      Axios.post(
        "http://127.0.0.1:8000/api/food/add-to-cart/",
        { food: item.food, quantity: 1 },
        { headers: { Authorization: `Token ${token}` } }
      )
        .then(() => {
          // After successfully adding the item, fetch the updated cart
          fetchCart();
        })
        .catch((error) => {
          console.error("Failed to increase item quantity", error);
        });
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!address) {
      alert("Please provide a delivery address.");
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("You must be logged in to submit the cart.");
      return;
    }

    // Prepare the data to be sent in the request
    const orderData = {
      cart_items: cart,
      total_price: totalPrice,
      address: address,
    };

    Axios.post("http://127.0.0.1:8000/api/createorder/", orderData, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((response) => {
        alert("Order submitted successfully!");
        navigate("/customer-dashboard");
      })
      .catch((err) => {
        alert("Failed to submit the order. Please try again.");
      });
  };

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>

      {/* Cart Items */}
      <div className="cart-items">
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cart.map((item) => {
            // Convert food_price to number using parseFloat
            const price = parseFloat(item.food_price);
            const totalItemPrice = price * item.quantity;

            return (
              <div key={item.id} className="cart-item">
                <div className="food-details">
                  <h3>{item.food_name}</h3>
                  <p>Food ID: {item.id}</p>
                  <p>Food: {item.food}</p>
                  <p>Price: {price.toFixed(2)} IRR</p>
                  <p>Quantity: {item.quantity}</p>
                  <div className="quantity-controls">
                    <button onClick={() => handleQuantityChange(item, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item, 1)}>+</button>
                  </div>
                </div>
                <p className="item-total">
                  Item Total: {totalItemPrice.toFixed(2)} IRR
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* Total Price */}
      <div className="cart-total">
        <h3>Total Price: {totalPrice.toFixed(2)} IRR</h3>
      </div>

      {/* Address Input */}
      <div className="address-field">
        <label htmlFor="address">Delivery Address:</label>
        <textarea
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter your delivery address"
        ></textarea>
      </div>

      {/* Submit Button */}
      <div className="submit-order">
        <button onClick={handleSubmit}>Submit Order</button>
      </div>
    </div>
  );
};

export default Cart;
