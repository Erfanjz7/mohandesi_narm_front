import { useEffect, useState } from "react";
import Axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../style/FoodEdit.css"; // Ensure this file is updated for styling

const FoodEdit = () => {
  const { foodid, id } = useParams(); // Get foodid and id from the URL params
  const navigate = useNavigate();
  const [food, setFood] = useState({
    name: "",
    description: "",
    price: "",
    rate: 0,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const isAdmin = localStorage.getItem("userRole") === "admin"; // Check if the user is an admin

  useEffect(() => {
    if (!isAdmin) {
      navigate("/login"); // Redirect to login if not an admin
      return;
    }

    // Fetch food details for editing
    Axios.get(`http://127.0.0.1:8000/api/resturants/${id}/foods/${foodid}/`) // Corrected URL to use id and foodid
      .then((response) => {
        setFood(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load food details.");
        setLoading(false);
      });
  }, [foodid, id, isAdmin, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFood((prevFood) => ({
      ...prevFood,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await Axios.put(`http://127.0.0.1:8000/api/resturants/${id}/foods/${foodid}/`, food);
      alert("Food updated successfully");
      navigate(`/admin/resturants/${id}/foods`); // Redirect back to restaurant foods page
    } catch (err) {
      setError("Failed to update food.");
    }
  };

  const handleDelete = async () => {
    try {
      await Axios.delete(`http://127.0.0.1:8000/api/resturants/${id}/foods/${foodid}/`);
      alert("Food deleted successfully");
      navigate(`/admin/resturants/${id}/foods`); // Redirect back to restaurant foods page
    } catch (err) {
      setError("Failed to delete food.");
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  if (error) return <div className="error">{error}</div>;

  return (
    <div className="food-edit-container">
      <h2>Edit Food: {food.name}</h2>
      <form onSubmit={handleSave}>
        <div className="form-group">
          <label htmlFor="name">Food Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={food.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={food.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            name="price"
            value={food.price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="rate">Rate</label>
          <input
            type="number"
            id="rate"
            name="rate"
            value={food.rate}
            onChange={handleChange}
            min="0"
            max="5"
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit">Save Changes</button>
          <button type="button" onClick={handleDelete} className="delete-button">
            Delete Food
          </button>
        </div>
      </form>
    </div>
  );
};

export default FoodEdit;
