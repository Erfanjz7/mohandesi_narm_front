import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import "../style/CustomerDashboard.css";

const CustomerDashboard = () => {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]); // Store categories
  const [selectedCategory, setSelectedCategory] = useState(""); // Track selected category
  const [quantities, setQuantities] = useState({}); // Track quantity for each food
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await Axios.get("http://127.0.0.1:8000/api/getcategories/");

        setCategories(response.data); // Assuming the response contains an array of categories
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

        const params = {
          size: 10,
          page: 1,
        };

        // Add category filter to the request if selected
        if (selectedCategory) {
          params.category = selectedCategory;
        }
        console.log(typeof(selectedCategory.value))
        const response = await Axios.get("http://127.0.0.1:8000/api/foods/list/", {
          headers: {
            Authorization: `Token ${token}`,
          },
          params: params,
        });
        setFoods(response.data.data); // Update with fetched foods
        setLoading(false);
      } catch (err) {
        setError("Failed to load foods.");
        setLoading(false);
      }
    };

    fetchFoods();
  }, [selectedCategory]); // Trigger fetch when the category changes

  // Handle quantity change for each food
  const handleQuantityChange = (foodId, change) => {
    setQuantities((prevQuantities) => {
      const updatedQuantities = { ...prevQuantities };
      const newQuantity = Math.max(1, (updatedQuantities[foodId] || 1) + change); // Prevent negative or zero quantity
      updatedQuantities[foodId] = newQuantity;
      return updatedQuantities;
    });
  };

  // Handle adding food to the cart with quantity
  const handleAddToCart = (food) => {
    const quantity = quantities[food.id] || 1;  // Get the quantity for the food item, default to 1 if not specified

    const token = localStorage.getItem("authToken");

    if (!token) {
      alert("You must be logged in to add items to the cart.");
      return;
    }

    const body = {
      food: food.id,
      quantity: quantity,
    };

    Axios.post(
      "http://127.0.0.1:8000/api/food/add-to-cart/",  // Update with your cart add API endpoint
      body,
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    )
      .then((response) => {
        alert(`${food.name} (x${quantity}) added to cart!`);
      })
      .catch((err) => {
        alert("Failed to add food to cart.");
      });
  };

  // Handle navigating to the cart page
  const handleCompleteCart = () => {
    navigate("/customer/cart");  // Navigate directly to the cart page
  };

  // Handle navigating to view orders
  const handleViewOrders = () => {
    navigate("/customer/orders");  // Navigate to the orders page
  };

  // Handle viewing all foods
  const handleViewAllFoods = () => {
    navigate("/foods");
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="customer-dashboard">
      {/* Left-side Navbar */}
      <div className="navbar">
        <h2>Customer Dashboard</h2>
        <button onClick={handleCompleteCart}>Go to Cart</button>
        <button onClick={handleViewOrders}>View Orders</button>
      </div>

      {/* Main content area */}
      <div className="dashboard-content">
        {/* Category Dropdown */}
        <div className="category-filter">
          <label htmlFor="category-select">Filter by Category:</label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Popular Foods Section */}
        <div className="popular-foods">
          <h2>Popular Foods</h2>
          {foods.length === 0 ? (
            <p>No popular foods available.</p>
          ) : (
            <div className="foods-list-horizontal">
              {foods.map((food) => (
                <div key={food.id} className="food-card">
                  <a href={`/foods/${food.id}`} className="food-link">
                    <img
                      src={food.image || "https://via.placeholder.com/150"}
                      alt={food.name}
                    />
                    <h3>{food.name}</h3>
                  </a>
                  <p>Price: ${food.price}</p>
                  <div className="quantity-controls">
                    <button onClick={() => handleQuantityChange(food.id, -1)}>-</button>
                    <span>{quantities[food.id] || 1}</span>
                    <button onClick={() => handleQuantityChange(food.id, 1)}>+</button>
                  </div>
                  <button onClick={() => handleAddToCart(food)}>Add to Cart</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Button to Navigate to All Foods */}
        <div className="view-all-foods">
          <button onClick={handleViewAllFoods}>View All Foods</button>
        </div>

        {/* Cart Section */}
        <div className="cart-actions">
          <h2>Cart</h2>
          <p>{foods.filter((food) => quantities[food.id] && quantities[food.id] > 0).length} item(s) in your cart</p>
          <button onClick={handleCompleteCart}>Go to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
