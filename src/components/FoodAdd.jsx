import { useState } from "react";
import Axios from "axios";
import "../style/FoodAdd.css";

const FoodAdd = () => {
  const [foodName, setFoodName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(""); // Category is now just an ID
  const [image, setImage] = useState(null); // Image file state
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Update image state with selected file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Unauthorized! Please login again.");
      return;
    }

    const formData = new FormData();
    formData.append("name", foodName);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category); // Add category ID
    if (image) {
      formData.append("image", image); // Add image file
    }

    try {
      const response = await Axios.post(
        "http://127.0.0.1:8000/api/admin/food/add/",
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Food added successfully!");
      // Optionally reset form after submission
      setFoodName("");
      setDescription("");
      setPrice("");
      setCategory("");
      setImage(null);
    } catch (err) {
      setError("Failed to add food.");
    }
  };

  return (
    <div className="food-add-container">
      <h2>Add New Food</h2>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="foodName">Food Name</label>
          <input
            type="text"
            id="foodName"
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category ID</label>
          <input
            type="number"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Food Image</label>
          <input
            type="file"
            id="image"
            onChange={handleImageChange}
            accept="image/*"
          />
        </div>

        <button type="submit">Add Food</button>
      </form>
    </div>
  );
};

export default FoodAdd;
