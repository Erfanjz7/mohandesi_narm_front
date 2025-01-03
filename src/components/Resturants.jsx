import { useEffect, useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import "../style/Resturants.css"; // Ensure this file is updated for new styles

const Resturants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch restaurants from the API
    Axios.get("http://127.0.0.1:8000/api/admin/resturants/")
      .then((response) => {
        setRestaurants(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load restaurants.");
        setLoading(false);
      });
  }, []);

  const handleCardClick = (restaurantId) => {
    // Navigate to the detailed view of the selected restaurant
    navigate(`/restaurants/${restaurantId}`);
  };

  if (loading) return <div className="loading">Loading...</div>;

  if (error) return <div className="error">{error}</div>;

  return (
    <div className="restaurants-container">
      <h2>Restaurants</h2>
      <div className="restaurants-grid">
        {restaurants.map((restaurant) => (
          <div
            className="restaurant-card"
            key={restaurant.id}
            onClick={() => handleCardClick(restaurant.id)}
          >
            {restaurant.image && (
              <img
                src={`http://127.0.0.1:8000${restaurant.image}`}
                alt={`${restaurant.name} image`}
                className="restaurant-image"
              />
            )}
            <h3>{restaurant.name}</h3>
            <p><strong>Address:</strong> {restaurant.address}</p>
            <p><strong>Phone:</strong> {restaurant.phone || "Not available"}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Resturants;
