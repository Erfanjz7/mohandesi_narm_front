import { useEffect, useState } from "react";
import Axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../style/Resturant.css"; // Ensure this file is updated for styling

const Resturant = () => {
  const [foods, setFoods] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState(null);
  const { id } = useParams(); // Get the restaurant ID from the route
  const navigate = useNavigate();

  const isAdmin = localStorage.getItem("userRole") === "admin"; // Check if the user is an admin

  useEffect(() => {
    // Fetch restaurant details and foods from the API
    Axios.get(`http://127.0.0.1:8000/api/resturants/${id}/foods/`)
      .then((response) => {
        setFoods(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load restaurant foods.");
        setLoading(false);
      });

    // Fetch restaurant details
    Axios.get(`http://127.0.0.1:8000/api/admin/resturant/${id}/`)
      .then((response) => {
        setRestaurant(response.data);
      })
      .catch((err) => {
        setError("Failed to load restaurant details.");
      });
  }, [id]);

  const handleEdit = (foodId) => {
    // Navigate to the edit page for a specific food item (admin only)
    if (isAdmin) {
        console.log("isAdmin")
      navigate(`/restaurants/${id}/food/${foodId}`);
    }
    else{
        console.log("not admin")
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  if (error) return <div className="error">{error}</div>;

  return (
    <div className="restaurant-foods-container">
      <h2>{restaurant?.name} - Foods</h2>
      <p><strong>Address:</strong> {restaurant?.address}</p>
      <p><strong>Phone:</strong> {restaurant?.phone || "Not available"}</p>
      <div className="foods-grid">
        {foods.map((food) => (
          <div
            className={`food-card ${isAdmin ? "clickable" : "non-clickable"}`} 
            key={food.id}
            onClick={() => isAdmin && handleEdit(food.id)} // Only clickable if admin
          >
            <h3>{food.name}</h3>
            <p><strong>Description:</strong> {food.description}</p>
            <p><strong>Category:</strong> {food.category.name}</p>
            <p><strong>Price:</strong> ${food.price}</p>
            <p><strong>Rate:</strong> {food.rate}</p>
            {isAdmin && (
              <button onClick={(e) => { 
                e.stopPropagation(); // Prevent button click from triggering card click
                handleEdit(food.id); 
              }}>
                Edit Food
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Resturant;
