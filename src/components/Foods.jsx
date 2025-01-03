import { useEffect, useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import "../style/Foods.css";

const Foods = () => {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]); // To store categories
  const [selectedCategory, setSelectedCategory] = useState(""); // To store selected category
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [quantities, setQuantities] = useState({}); // Track quantity for each food
  const navigate = useNavigate();

  const isAdmin = localStorage.getItem("userRole") === "admin";
  const isCustomer = localStorage.getItem("userRole") === "customer"; // Check if the user is a customer
  const itemsPerPage = 10; // Limit items to 10 per page

  // Fetch categories
  useEffect(() => {
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

  // Fetch foods based on selected category and pagination
  useEffect(() => {
    const fetchFoods = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setError("Authorization token is missing. Please log in again.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Prepare the params with pagination and selected category
        const params = {
          page: currentPage,
          page_size: itemsPerPage, // Set items per page
        };

        if (selectedCategory) {
          params.category = selectedCategory; // Apply category filter
        }

        // Fetch foods
        const response = await Axios.get("http://127.0.0.1:8000/api/foods/list/", {
          headers: {
            Authorization: `Token ${token}`,
          },
          params: params,
        });

        console.log("ehe" , typeof(selectedCategory.value));
        if (response.data && response.data.data) {
          setFoods(response.data.data);
          setTotalPages(response.data.total_pages);
        } else {
          setFoods([]); // No foods found
        }
      } catch (err) {
        setError("Failed to load foods.");
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, [currentPage, selectedCategory]); // Re-fetch foods when category or page changes

  const handleEdit = (foodId) => {
    if (isAdmin) {
      navigate(`/foods/food/edit/${foodId}`);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1); // Reset to first page when category changes
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="restaurant-foods-container">
      <h2>Foods</h2>

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

      {/* Foods Display */}
      <div className="foods-row">
        {foods.length === 0 ? (
          <p>No foods available in this category.</p>
        ) : (
          foods.map((food) => (
            <div className="food-card" key={food.id}>
              <h3>{food.name}</h3>
              <p><strong>Description:</strong> {food.description}</p>
              <p><strong>Category ID:</strong> {food.category}</p>
              <p className="price"><strong>Price:</strong> {food.price} IRR</p>
              <div className="rate">
                <strong>Rate:</strong>
                <span>{food.rate} ★</span>
              </div>
              {isAdmin && (
                <button onClick={() => handleEdit(food.id)}>
                  Edit Food
                </button>
              )}
              {isCustomer && (
                <div>
                  <div className="quantity-controls">
                    <button onClick={() => handleQuantityChange(food.id, -1)}>-</button>
                    <span>{quantities[food.id] || 1}</span>
                    <button onClick={() => handleQuantityChange(food.id, 1)}>+</button>
                  </div>
                  <button onClick={() => handleAddToCart(food)}>
                    Add to Cart
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="pagination-controls">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Foods;
