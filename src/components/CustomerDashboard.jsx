import { useEffect, useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import "../style/CustomerDashboard.css"; // Add custom styles for the dashboard

const CustomerDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRestaurants();
    fetchOrderHistory();
  }, []);

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const response = await Axios.get("http://127.0.0.1:8000/api/restaurants/");
      setRestaurants(response.data);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMenu = async (restaurantId) => {
    setLoading(true);
    try {
      const response = await Axios.get(
        `http://127.0.0.1:8000/api/restaurants/${restaurantId}/menu/`
      );
      setMenu(response.data);
      setSelectedRestaurant(restaurantId);
    } catch (error) {
      console.error("Error fetching menu:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderHistory = async () => {
    try {
      const response = await Axios.get("http://127.0.0.1:8000/api/orders/history/");
      setOrderHistory(response.data);
    } catch (error) {
      console.error("Error fetching order history:", error);
    }
  };

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const placeOrder = async () => {
    try {
      await Axios.post("http://127.0.0.1:8000/api/orders/", {
        items: cart,
        restaurant: selectedRestaurant,
      });
      alert("Order placed successfully!");
      setCart([]);
      fetchOrderHistory();
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div className="customer-dashboard">
      <header>
        <h1>Welcome to the Customer Dashboard</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>

      <section className="restaurant-list">
        <h2>Available Restaurants</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {restaurants.map((restaurant) => (
              <li key={restaurant.id}>
                {restaurant.name}{" "}
                <button onClick={() => fetchMenu(restaurant.id)}>View Menu</button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {menu.length > 0 && (
        <section className="menu">
          <h2>Menu</h2>
          <ul>
            {menu.map((item) => (
              <li key={item.id}>
                {item.name} - ${item.price}{" "}
                <button onClick={() => addToCart(item)}>Add to Cart</button>
              </li>
            ))}
          </ul>
          <button onClick={placeOrder} disabled={cart.length === 0}>
            Place Order
          </button>
        </section>
      )}

      <section className="order-history">
        <h2>Order History</h2>
        <ul>
          {orderHistory.map((order) => (
            <li key={order.id}>
              <strong>Order #{order.id}</strong>: {order.items.map((item) => item.name).join(", ")}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default CustomerDashboard;
