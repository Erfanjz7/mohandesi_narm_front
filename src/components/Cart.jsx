import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import "../style/Cart.css";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [storedAddresses, setStoredAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(""); 
  const [newAddress, setNewAddress] = useState("");
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
    fetchStoredAddresses();
  }, []);

  // Fetch cart items
  const fetchCart = () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      Axios.get("http://127.0.0.1:8000/api/cart", {
        headers: { Authorization: `Token ${token}` },
      })
        .then((response) => {
          setCart(response.data.cart_items);
          setTotalPrice(response.data.total_price);
        })
        .catch((error) => {
          console.error("Failed to fetch cart items", error);
        });
    } else {
      alert("You must be logged in to view the cart.");
    }
  };

  // Fetch stored addresses
  const fetchStoredAddresses = () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      Axios.get("http://127.0.0.1:8000/api/getaddresses", {
        headers: { Authorization: `Token ${token}` },
      })
        .then((response) => {
          if (Array.isArray(response.data)) {
            setStoredAddresses(response.data);
          } else {
            alert("Invalid response from server.");
          }
        })
        .catch(() => {
          alert("Failed to load addresses.");
        });
    }
  };

  // Handle quantity change
  const handleQuantityChange = (item, action) => {
    const token = localStorage.getItem("authToken");

    if (action === -1) {
      Axios.delete(`http://127.0.0.1:8000/api/food/delete-from-cart/${item.id}/`, {
        headers: { Authorization: `Token ${token}` },
      })
        .then(() => fetchCart())
        .catch((error) => console.error("Failed to decrease item quantity", error));
    } else if (action === 1) {
      Axios.post(
        "http://127.0.0.1:8000/api/food/add-to-cart/",
        { food: item.food, quantity: 1 },
        { headers: { Authorization: `Token ${token}` } }
      )
        .then(() => fetchCart())
        .catch((error) => console.error("Failed to increase item quantity", error));
    }
  };

  // Handle address selection
  const handleAddressChange = (event) => {
    const selected = event.target.value;
    if (selected === "new") {
      setUseNewAddress(true);
      setSelectedAddress("");
    } else {
      setUseNewAddress(false);
      setSelectedAddress(selected);
      setNewAddress(""); // Clear new address input if a stored address is selected
    }
  };

  // Handle discard selected address
  const handleDiscardAddress = () => {
    setSelectedAddress("");
    setUseNewAddress(false);
    setNewAddress("");
  };

  // Handle order submission
  const handleSubmit = () => {
    let finalAddress = useNewAddress ? newAddress : selectedAddress;

    if (!finalAddress) {
      alert("Please select or enter a delivery address.");
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("You must be logged in to submit the cart.");
      return;
    }

    const orderData = {
      cart_items: cart,
      total_price: totalPrice,
      address: finalAddress,
    };

    Axios.post("http://127.0.0.1:8000/api/createorder/", orderData, {
      headers: { Authorization: `Token ${token}` },
    })
      .then(() => {
        alert("Order submitted successfully!");
        navigate("/customer-dashboard");
      })
      .catch(() => {
        alert("Failed to submit the order. Please try again.");
      });
  };

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>

      <div className="cart-items">
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="food-details">
                <h3>{item.food_name}</h3>
                <p>Price: {parseFloat(item.food_price).toFixed(2)} IRR</p>
                <p>Quantity: {item.quantity}</p>
                <div className="quantity-controls">
                  <button onClick={() => handleQuantityChange(item, -1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleQuantityChange(item, 1)}>+</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="cart-total">
        <h3>Total Price: {totalPrice.toFixed(2)} IRR</h3>
      </div>

      {/* Address Selection */}
      <div className="address-selection">
        <label htmlFor="address">Select Address:</label>
        <select id="address" value={useNewAddress ? "new" : selectedAddress} onChange={handleAddressChange}>
          <option value="">-- Choose an address --</option>
          {storedAddresses.map((addr, index) => (
            <option key={index} value={addr.address}>{addr.address}</option>
          ))}
          <option value="new">Add New Address</option>
        </select>

        {/* Discard selected address */}
        {selectedAddress && !useNewAddress && (
          <button className="discard-btn" onClick={handleDiscardAddress}>
            ❌ Discard Address
          </button>
        )}
      </div>

      {/* New Address Input */}
      {useNewAddress && (
        <div className="address-field">
          <label htmlFor="newAddress">Enter New Address:</label>
          <textarea
            id="newAddress"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            placeholder="Enter new delivery address"
          ></textarea>
        </div>
      )}

      {/* Submit Button */}
      <div className="submit-order">
        <button onClick={handleSubmit}>Submit Order</button>
      </div>
    </div>
  );
};

export default Cart;
