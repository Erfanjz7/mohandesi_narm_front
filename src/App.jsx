// import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import AdminDashboard from "./components/AdminDashboard";
import EmployeeDashboard from "./components/EmployeeDashboard";
import CustomerDashboard from "./components/CustomerDashboard";
import Foods from "./components/Foods";
import FoodEdit from "./components/FoodEdit";
import EmployeeList from "./components/EmployeeList";
import AdminSignup from "./components/AdminSignup";
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
      <Route path="/foods" element={<Foods />} />
      <Route path="/foods/food/edit/:foodid" element={<FoodEdit />} />
      <Route path="/admin/employees" element={EmployeeList}/>
      <Route path="/admin/signup" element={<AdminSignup />} />
    </Routes>
  );
};

export default App;
