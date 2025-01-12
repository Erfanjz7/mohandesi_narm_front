import { useEffect, useState } from "react";
import Axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../style/FoodEdit.css"; // Ensure this file is updated for styling

const FoodEdit = () => {
  const { foodid } = useParams(); // Get foodid from the URL params
  const navigate = useNavigate();
  const [food, setFood] = useState({
    name: "",
    description: "",
    price: "",
    rate: 0,
    image: "", // Add image field
    category: "", // Add category field
  });
  const [newImage, setNewImage] = useState(null); // To handle new image upload
  const [categories, setCategories] = useState([]); // Store categories
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const isAdmin = localStorage.getItem("userRole") === "admin"; // Check if the user is an admin
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (!isAdmin) {
      navigate("/login"); // Redirect to login if not an admin
      return;
    }

    // Fetch food details for editing
    Axios.get(`http://127.0.0.1:8000/api/food/detail/${foodid}/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((response) => {
        setFood(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load food details.");
        setLoading(false);
      });

    // Fetch categories for the dropdown
    Axios.get("http://127.0.0.1:8000/api/getcategories/", {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((response) => {
        setCategories(response.data); // Store categories in state
      })
      .catch(() => {
        setError("Failed to load categories.");
      });
  }, [foodid, isAdmin, navigate, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFood((prevFood) => ({
      ...prevFood,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  const handleSave = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('name', food.name);
    formData.append('description', food.description);
    formData.append('price', food.price);
    formData.append('rate', food.rate);
    formData.append('category', food.category);
  
    // If a new image is selected, append it to FormData
    if (newImage) {
      formData.append('image', newImage);
    }
  
    try {
      const response = await Axios.put(
        `http://127.0.0.1:8000/api/admin/food/${foodid}/edit/`,
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
            // Do NOT set "Content-Type", Axios will set it automatically when using FormData
          },
        }
      );
      alert("Food updated successfully");
      navigate(`/foods`);
    } catch (err) {
      setError("Failed to update food.");
      console.error("Error:", err.response ? err.response.data : err.message);
    }
  };

  const handleDelete = async () => {
    try {
      await Axios.delete(`http://127.0.0.1:8000/api/admin/food/${foodid}/delete/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      alert("Food deleted successfully");
      navigate(`/foods`); // Redirect back to restaurant foods page
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
        <div className="form-container">
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
          <div className="form-group">
            <label>Current Image</label>
            <img
              src={`http://127.0.0.1:8000${food.image}`}
              alt={food.name}
              className="food-image-preview"
            />
          </div>
          <div className="form-group">
            <label htmlFor="image">Change Image</label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={food.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
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
