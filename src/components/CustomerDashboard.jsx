import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { FaShoppingCart, FaSignOutAlt } from "react-icons/fa"; // Import icons
import "../style/CustomerDashboard.css";

const CustomerDashboard = () => {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [quantities, setQuantities] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch username from localStorage
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) setUsername(storedUsername);

    const fetchCategories = async () => {
      try {
        const response = await Axios.get("http://127.0.0.1:8000/api/getcategories/");
        setCategories(response.data);
      } catch (err) {
        setError("Failed to load categories.");
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("Unauthorized! Please login again.");
          setLoading(false);
          return;
        }

        const params = { size: 10, page: 1 };
        if (selectedCategory) params.category = selectedCategory;

        const response = await Axios.get("http://127.0.0.1:8000/api/foods/list/", {
          headers: { Authorization: `Token ${token}` },
          params: params,
        });

        setFoods(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load foods.");
        setLoading(false);
      }
    };

    fetchFoods();
  }, [selectedCategory]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    navigate("/");
  };

  const handleQuantityChange = (foodId, change) => {
    setQuantities((prevQuantities) => {
      const updated = { ...prevQuantities };
      const newQuantity = Math.max(1, (updated[foodId] || 1) + change);
      updated[foodId] = newQuantity;
      return updated;
    });
  };

  const handleAddToCart = (food) => {
    const quantity = quantities[food.id] || 1;
    const token = localStorage.getItem("authToken");

    if (!token) {
      alert("You must be logged in to add items to the cart.");
      return;
    }

    Axios.post(
      "http://127.0.0.1:8000/api/food/add-to-cart/",
      { food: food.id, quantity: quantity },
      { headers: { Authorization: `Token ${token}` } }
    )
      .then(() => alert(`${food.name} (x${quantity}) added to cart!`))
      .catch(() => alert("Failed to add food to cart."));
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="customer-dashboard">
      {/* Navbar */}
      <nav className="navbar">
        <h2>Customer Dashboard</h2>
        <div className="navbar-links">
          <a href="/customer/orders">View Orders</a>
          <a href="/foods">View All Foods</a>
          <a href="/customer/addresses" className="address-link">Manage Addresses</a>  {/* New Link */}
          <FaShoppingCart className="cart-icon" onClick={() => navigate("/customer/cart")} />
          <span className="welcome-text">Welcome, {username}!</span>
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt className="logout-icon" /> Logout
          </button>
        </div>
      </nav>


      {/* Category Selection */}
      <div className="category-container">
        <h3>Categories</h3>
        <div className="category-buttons">
          <button
            className={selectedCategory === "" ? "category-btn active" : "category-btn"}
            onClick={() => setSelectedCategory("")}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              className={selectedCategory === category.name ? "category-btn active" : "category-btn"}
              onClick={() => setSelectedCategory(category.name)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Popular Foods Section */}
      <div className="popular-foods">
        <h2>Popular Foods</h2>
        <div className="foods-list-scroll">
          {foods.length === 0 ? (
            <p>No popular foods available.</p>
          ) : (
            <div className="foods-list-horizontal">
              {foods.map((food) => (
                <div key={food.id} className="food-card">
                  <div className="image-container">
                    <img src={`http://127.0.0.1:8000${food.image}`} alt={food.name} />
                    <span className="quantity-badge">{quantities[food.id] || 1}</span>
                  </div>
                  <h3>{food.name}</h3>
                  <p>{food.description}</p>
                  <p className="food-price">${food.price}</p>
                  <button className="add-to-cart-btn" onClick={() => handleAddToCart(food)}>
                    🛒 Add to Cart
                  </button>
                </div>
              ))}
            </div>

          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
