import { useEffect, useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import "../style/CustomerDashboard.css"; // Add custom styles for the dashboard

const CustomerDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRestaurants();
    fetchOrderHistory();
  }, []);

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const response = await Axios.get("http://127.0.0.1:8000/api/restaurants/");
      setRestaurants(response.data);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMenu = async (restaurantId) => {
    setLoading(true);
    try {
      const response = await Axios.get(
        `http://127.0.0.1:8000/api/restaurants/${restaurantId}/menu/`
      );
      setMenu(response.data);
      setSelectedRestaurant(restaurantId);
    } catch (error) {
      console.error("Error fetching menu:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderHistory = async () => {
    try {
      const response = await Axios.get("http://127.0.0.1:8000/api/orders/history/");
      setOrderHistory(response.data);
    } catch (error) {
      console.error("Error fetching order history:", error);
    }
  };

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const placeOrder = async () => {
    try {
      await Axios.post("http://127.0.0.1:8000/api/orders/", {
        items: cart,
        restaurant: selectedRestaurant,
      });
      alert("Order placed successfully!");
      setCart([]);
      fetchOrderHistory();
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div className="customer-dashboard">
      <header>
        <h1>Welcome to the Customer Dashboard</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>

      <section className="restaurant-list">
        <h2>Available Restaurants</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {restaurants.map((restaurant) => (
              <li key={restaurant.id}>
                {restaurant.name}{" "}
                <button onClick={() => fetchMenu(restaurant.id)}>View Menu</button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {menu.length > 0 && (
        <section className="menu">
          <h2>Menu</h2>
          <ul>
            {menu.map((item) => (
              <li key={item.id}>
                {item.name} - ${item.price}{" "}
                <button onClick={() => addToCart(item)}>Add to Cart</button>
              </li>
            ))}
          </ul>
          <button onClick={placeOrder} disabled={cart.length === 0}>
            Place Order
          </button>
        </section>
      )}

      <section className="order-history">
        <h2>Order History</h2>
        <ul>
          {orderHistory.map((order) => (
            <li key={order.id}>
              <strong>Order #{order.id}</strong>: {order.items.map((item) => item.name).join(", ")}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default CustomerDashboard;


// import { useEffect, useState } from "react";
// import Axios from "axios";
// import "../style/CustomerDashboard.css"; // Ensure the CSS file is updated for styling

// const CustomerDashboard = () => {
//   const [categories, setCategories] = useState([]);
//   const [foods, setFoods] = useState([]);
//   const [popularFoods, setPopularFoods] = useState([]); // Popular foods state
//   const [filteredFoods, setFilteredFoods] = useState([]);
//   const [cart, setCart] = useState([]);
//   const [address, setAddress] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const categoryResponse = await Axios.get("http://127.0.0.1:8000/api/categories/");
//         const foodResponse = await Axios.get("http://127.0.0.1:8000/api/foods/");
//         setCategories(categoryResponse.data);
//         setFoods(foodResponse.data);
//         setFilteredFoods(foodResponse.data);

//         // Fetch popular foods (based on rating or any other criteria)
//         const popularFoodResponse = await Axios.get("http://127.0.0.1:8000/api/popular-foods/");
//         setPopularFoods(popularFoodResponse.data);

//         setLoading(false);
//       } catch (err) {
//         setError("Failed to load data. Please try again.");
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const filterFoods = (categoryId) => {
//     if (!categoryId) {
//       setFilteredFoods(foods); // Show all foods if no category is selected
//     } else {
//       const filtered = foods.filter((food) => food.category === categoryId);
//       setFilteredFoods(filtered);
//     }
//     setSelectedCategory(categoryId);
//   };

//   const addToCart = (foodId, quantity) => {
//     const existingItem = cart.find((item) => item.foodId === foodId);
//     if (existingItem) {
//       setCart(
//         cart.map((item) =>
//           item.foodId === foodId ? { ...item, quantity: item.quantity + quantity } : item
//         )
//       );
//     } else {
//       setCart([...cart, { foodId, quantity }]);
//     }
//   };

//   const placeOrder = async () => {
//     if (!address) {
//       alert("Please enter your address.");
//       return;
//     }

//     try {
//       const orderData = {
//         items: cart.map((item) => ({ food_id: item.foodId, quantity: item.quantity })),
//         address,
//       };
//       await Axios.post("http://127.0.0.1:8000/api/orders/", orderData);
//       alert("Order placed successfully!");
//       setCart([]);
//       setAddress("");
//     } catch (err) {
//       alert("Failed to place order. Please try again.");
//     }
//   };

//   if (loading) return <div className="loading">Loading...</div>;
//   if (error) return <div className="error">{error}</div>;

//   return (
//     <div className="customer-dashboard">
//       <h1>Popular Foods</h1>

//       {/* Display popular foods */}
//       <div className="popular-foods">
//         {popularFoods.length > 0 ? (
//           popularFoods.map((food) => (
//             <div className="food-card" key={food.id}>
//               <h3>{food.name}</h3>
//               <p>{food.description}</p>
//               <p>Price: ${food.price}</p>
//               <button
//                 onClick={() => {
//                   const quantity = prompt("Enter quantity:");
//                   if (quantity > 0) addToCart(food.id, parseInt(quantity, 10));
//                 }}
//               >
//                 Add to Cart
//               </button>
//             </div>
//           ))
//         ) : (
//           <p>No popular foods available.</p>
//         )}
//       </div>

//       <h1>Foods</h1>

//       {/* Category Filter */}
//       <div className="category-filter">
//         <button onClick={() => filterFoods("")} className={!selectedCategory ? "active" : ""}>
//           All
//         </button>
//         {categories.map((category) => (
//           <button
//             key={category.id}
//             onClick={() => filterFoods(category.id)}
//             className={selectedCategory === category.id ? "active" : ""}
//           >
//             {category.name}
//           </button>
//         ))}
//       </div>

//       {/* Food List */}
//       <div className="food-list">
//         {filteredFoods.map((food) => (
//           <div className="food-card" key={food.id}>
//             <h3>{food.name}</h3>
//             <p>{food.description}</p>
//             <p>Price: ${food.price}</p>
//             <button
//               onClick={() => {
//                 const quantity = prompt("Enter quantity:");
//                 if (quantity > 0) addToCart(food.id, parseInt(quantity, 10));
//               }}
//             >
//               Add to Cart
//             </button>
//           </div>
//         ))}
//       </div>

//       {/* Cart Section */}
//       <div className="cart-section">
//         <h2>Your Cart</h2>
//         {cart.length === 0 ? (
//           <p>Your cart is empty.</p>
//         ) : (
//           <ul>
//             {cart.map((item) => {
//               const food = foods.find((f) => f.id === item.foodId);
//               return (
//                 <li key={item.foodId}>
//                   {food.name} x {item.quantity}
//                 </li>
//               );
//             })}
//           </ul>
//         )}
//       </div>

//       {/* Order Section */}
//       <div className="order-section">
//         <h2>Place Your Order</h2>
//         <textarea
//           placeholder="Enter your address"
//           value={address}
//           onChange={(e) => setAddress(e.target.value)}
//           required
//         />
//         <button onClick={placeOrder} disabled={cart.length === 0}>
//           Place Order
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CustomerDashboard;

