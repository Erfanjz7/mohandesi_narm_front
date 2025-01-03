// import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import AdminDashboard from "./components/AdminDashboard";
import EmployeeDashboard from "./components/EmployeeDashboard";
import CustomerDashboard from "./components/CustomerDashboard";
import Resturants from "./components/Resturants";
import Resturant from "./components/Resturant";
import FoodEdit from "./components/FoodEdit";
const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      <h1>Welcome to Our App</h1>
      <p>Please choose an option:</p>
      <div className="button-container">
        <button onClick={() => navigate("/login")} className="btn">
          Login
        </button>
        <button onClick={() => navigate("/signup")} className="btn">
          Signup
        </button>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
      <Route path="/customer-dashboard" element={<CustomerDashboard />} />
      <Route path="/restaurants" element={<Resturants />} />
      <Route path="/restaurants/:id" element={<Resturant />} />
      <Route path="/restaurants/:id/food/:foodid" element={<FoodEdit />} />
    </Routes>
  );
};

export default App;
