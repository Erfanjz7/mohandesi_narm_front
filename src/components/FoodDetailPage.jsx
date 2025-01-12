import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Axios from "axios";
import "../style/FoodDetailPage.css";

const FoodDetailPage = () => {
  const { foodId } = useParams();
  const [food, setFood] = useState(null);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFoodDetails = async () => {
      try {
        const token = localStorage.getItem("authToken");

        if (!token) {
          setError("Unauthorized! Please login again.");
          setLoading(false);
          return;
        }

        const response = await Axios.get(`http://127.0.0.1:8000/api/food/detail/${foodId}/`, {
          headers: { Authorization: `Token ${token}` },
        });

        setFood(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load food details.");
        setLoading(false);
      }
    };

    fetchFoodDetails();
  }, [foodId]);

  const handleRatingSubmit = async () => {
    if (rating === 0) {
      setMessage("Please select a rating before submitting.");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setMessage("Unauthorized! Please login to submit a rating.");
        return;
      }

      const response = await Axios.post(
        "http://127.0.0.1:8000/api/ratefood/",
        { food_id: foodId, rate: rating },
        { headers: { Authorization: `Token ${token}` } }
      );

      setMessage("Rating submitted successfully!");
    } catch (err) {
      setMessage("Failed to submit rating. Please try again.");
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="food-detail-page">
      <h1>{food.name}</h1>
      <p><strong>Category:</strong> {food.category_name}</p>
      <p><strong>Description:</strong> {food.description || "No description available."}</p>
      <p><strong>Price:</strong> {parseFloat(food.price).toFixed(2)} IRR</p>
      
      <div className="rating">
        <p><strong>Current Rating:</strong> {food.rate} / 5</p>
        <p><strong>Rate this food:</strong></p>
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={star <= rating ? "star selected" : "star"}
              onClick={() => setRating(star)}
            >
              ★
            </span>
          ))}
        </div>
        <button onClick={handleRatingSubmit}>Submit Rating</button>
        {message && <p className="message">{message}</p>}
      </div>

      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  );
};

export default FoodDetailPage;
