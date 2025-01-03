import { useEffect, useState } from "react";
import Axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../style/Foods.css";

const Foods = () => {
  const [foods, setFoods] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [quantities, setQuantities] = useState({});  // Track quantity for each food
  const navigate = useNavigate();

  const isAdmin = localStorage.getItem("userRole") === "admin";
  const isCustomer = localStorage.getItem("userRole") === "customer";  // Check if the user is a customer
  const itemsPerPage = 10; // Limit items to 10 per page

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
        const response = await Axios.get(`http://127.0.0.1:8000/api/foods/list/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
          params: {
            page: currentPage,
            page_size: itemsPerPage, // Set items per page
          },
        });

        setFoods(response.data.data); // Update with the `data` array
        setTotalPages(response.data.total_pages); // Update total pages
      } catch (err) {
        setError("Failed to load foods.");
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, [currentPage]);

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

  // Handle adding items to the cart for the customer
  const handleAddToCart = (food) => {
    const quantity = quantities[food.id] || 1;  // Get the quantity for the food item, default to 1 if not specified

    // Send quantity and food id to the backend
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

  // Handle quantity changes
  const handleQuantityChange = (foodId, action) => {
    setQuantities((prevQuantities) => {
      const newQuantities = { ...prevQuantities };
      newQuantities[foodId] = Math.max(1, (newQuantities[foodId] || 1) + action);
      return newQuantities;
    });
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="restaurant-foods-container">
      <h2>Foods</h2>
      <div className="foods-row">
        {foods.map((food) => (
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
        ))}
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
