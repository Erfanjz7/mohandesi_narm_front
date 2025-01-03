import { useEffect, useState } from "react";
import Axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../style/Foods.css";

const Restaurant = () => {
  const [foods, setFoods] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();  // Get the restaurant ID from the route
  const navigate = useNavigate();
  
  const isAdmin = localStorage.getItem("userRole") === "admin";  // Check if the user is an admin

  useEffect(() => {
    const token = localStorage.getItem("authToken");
  
    if (!token) {
      setError("Authorization token is missing. Please log in again.");
      setLoading(false);
      return;
    }
  
    Axios.get(`http://127.0.0.1:8000/api/foods/list/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((response) => {
        setFoods(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load foods.");
        setLoading(false);
      });
  }, []);
  

  const handleEdit = (foodId) => {
    // Only navigate to edit page if the user is an admin
    if (isAdmin) {
      navigate(`/foods/food/edit/${foodId}`);  // Navigate to the edit page
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="restaurant-foods-container">
      <h2>Foods</h2>
      <div className="foods-grid">
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default Restaurant;
