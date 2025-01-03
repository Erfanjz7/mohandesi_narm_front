// import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import AdminDashboard from "./components/AdminDashboard";
import EmployeeDashboard from "./components/EmployeeDashboard";
import CustomerDashboard from "./components/CustomerDashboard";
import Foods from "./components/Foods";
import FoodEdit from "./components/FoodEdit";
import AdminSignup from "./components/AdminSignup";
import EmployeeList from "./components/EmployeeList";
import EmployeeEdit from "./components/EmployeeEdit";
import PendingOrders from "./components/PendingOrders";
import AcceptedOrders from "./components/AcceptedOrders";
import FoodAdd from "./components/FoodAdd";
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
      <Route path="/admin/employees" element={<EmployeeList />}/>
      <Route path="/admin/signup" element={<AdminSignup />} />
      <Route path="/admin/employees/edit/:employeeId" element={<EmployeeEdit />} />
      <Route path="/employee/pending-orders" element={<PendingOrders />} />
      <Route path="/employee/accepted-orders" element={<AcceptedOrders />} />
      <Route path="/admin/foods/add" element={<FoodAdd />} />
    </Routes>
  );
};

export default App;
