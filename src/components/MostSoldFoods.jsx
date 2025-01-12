import { useState, useEffect } from "react";
import Axios from "axios";
import "../style/MostSoldFoods.css";

const MostSoldFoods = () => {
  const [foods, setFoods] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMostSoldFoods = async () => {
      try {
        const token = localStorage.getItem("authToken");

        if (!token) {
          setError("Unauthorized! Please login again.");
          setLoading(false);
          return;
        }

        const response = await Axios.get("http://127.0.0.1:8000/api/admin/mostselledfoods/", {
          headers: { Authorization: `Token ${token}` },
          params: { page: page },
        });

        setFoods(response.data.data || []);
        setTotalPages(response.data.total_pages || 1);
        setLoading(false);
      } catch (err) {
        setError("Failed to load food data.");
        setLoading(false);
      }
    };

    fetchMostSoldFoods();
  }, [page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="most-sold-foods">
      <h2>Most Sold Foods</h2>

      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}

      {!loading && !error && (
        <>
          <div className="foods-grid">
            {foods.length === 0 ? (
              <p>No food items found.</p>
            ) : (
              foods.map((food) => (
                <div key={food.id} className="food-card">
                  <img
                    src={food.image ? `http://127.0.0.1:8000${food.image}` : "/default-food.jpg"}
                    alt={food.name}
                    className="food-image"
                  />
                  <h3>{food.name}</h3>
                  <p><strong>Category:</strong> {food.category_name}</p>
                  <p><strong>Price:</strong> {parseFloat(food.price).toFixed(2)} IRR</p>
                  <p><strong>Rating:</strong> {food.rate} ⭐</p>
                  <p><strong>Sold:</strong> {food.selled} times</p>
                </div>
              ))
            )}
          </div>

          <div className="pagination">
            <button onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>
              Previous
            </button>
            <span>Page {page} of {totalPages}</span>
            <button onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MostSoldFoods;
