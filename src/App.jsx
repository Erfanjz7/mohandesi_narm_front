// import React from "react";
import { useState } from "react";
import Axios from "axios";
import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import AddDiscount from "./components/AddDiscount";
import AdminDashboard from "./components/AdminDashboard";
import EmployeeDashboard from "./components/EmployeeDashboard";
import CustomerDashboard from "./components/CustomerDashboard";
import CustomerAddress from "./components/CustomerAddress";
import DiscountCodes from "./components/DiscountCodes";
import Foods from "./components/Foods";
import FoodDetailPage from "./components/FoodDetailPage";
import FoodEdit from "./components/FoodEdit";
import AdminSignup from "./components/AdminSignup";
import EmployeeList from "./components/EmployeeList";
import EmployeeEdit from "./components/EmployeeEdit";
import PendingOrders from "./components/PendingOrders";
import AcceptedOrders from "./components/AcceptedOrders";
import FoodAdd from "./components/FoodAdd";
import Cart from "./components/Cart";
import MostSoldFoods from "./components/MostSoldFoods";
import OrderDetailPage from "./components/OrderDetailPage";
import OrdersPage from "./components/OrdersPage";
import Welcome from "./components/Welcome";
import "./App.css";


const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [signupData, setSignupData] = useState({
    username: "",
    password: "",
    first_name: "",
    email: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setError(null);
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await Axios.post("http://127.0.0.1:8000/api/login/", loginData);
      if (response.status === 200) {
        const { token, role } = response.data;
        localStorage.setItem("authToken", token);
        localStorage.setItem("userRole", role);

        switch (role) {
          case "admin":
            navigate("/admin-dashboard");
            break;
          case "employee":
            navigate("/employee-dashboard");
            break;
          case "customer":
            navigate("/customer-dashboard");
            break;
          default:
            navigate("/login");
        }
      }
    } catch (error) {
      setError("Invalid credentials or an error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await Axios.post("http://127.0.0.1:8000/api/signup/", signupData);
      if (response.status === 201) {
        alert("Account created successfully!");
        navigate("/");
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`auth-container ${isLogin ? "login-active" : "signup-active"}`}>
      {isLogin ? (
        <>
          <div className="poster">
            <h1>Welcome Back!</h1>
            <p>Sign in to continue your journey with us.</p>
            <button onClick={handleToggle}>Switch to Signup</button>
          </div>
          <div className="form-container">
            <h2>Login</h2>
            <form onSubmit={handleLoginSubmit}>
              <div>
                <label htmlFor="login-username">Username</label>
                <input
                  type="text"
                  id="login-username"
                  name="username"
                  value={loginData.username}
                  onChange={handleLoginChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="login-password">Password</label>
                <input
                  type="password"
                  id="login-password"
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  required
                />
              </div>
              {error && <div className="error">{error}</div>}
              <button type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        </>
      ) : (
        <>
          <div className="form-container">
            <h2>Signup</h2>
            <form onSubmit={handleSignupSubmit}>
              <div>
                <label htmlFor="signup-username">Username</label>
                <input
                  type="text"
                  id="signup-username"
                  name="username"
                  value={signupData.username}
                  onChange={handleSignupChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="signup-email">Email</label>
                <input
                  type="email"
                  id="signup-email"
                  name="email"
                  value={signupData.email}
                  onChange={handleSignupChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="signup-password">Password</label>
                <input
                  type="password"
                  id="signup-password"
                  name="password"
                  value={signupData.password}
                  onChange={handleSignupChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="signup-first_name">First Name</label>
                <input
                  type="text"
                  id="signup-first_name"
                  name="first_name"
                  value={signupData.first_name}
                  onChange={handleSignupChange}
                  required
                />
              </div>
              {error && <div className="error">{error}</div>}
              <button type="submit" disabled={loading}>
                {loading ? "Signing up..." : "Signup"}
              </button>
            </form>
          </div>
          <div className="poster">
            <h1>Welcome!</h1>
            <p>Create an account to start your adventure.</p>
            <button onClick={handleToggle}>Switch to Login</button>
          </div>
        </>
      )}
    </div>
  );
};


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/admin/discounts" element={<DiscountCodes />} />
      <Route path="/admin/adddiscounts" element={<AddDiscount />} />
      <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
      <Route path="/customer-dashboard" element={<CustomerDashboard />} />
      <Route path="/customer/addresses" element={<CustomerAddress />} />  {/* New Route */}
      <Route path="/food/detail/:foodId" element={<FoodDetailPage />} />
      <Route path="/foods" element={<Foods />} />
      <Route path="/foods/food/edit/:foodid" element={<FoodEdit />} />
      <Route path="/admin/employees" element={<EmployeeList />} />
      <Route path="/admin/signup" element={<AdminSignup />} />
      <Route path="/admin/employees/edit/:employeeId" element={<EmployeeEdit />} />
      <Route path="/employee/pending-orders" element={<PendingOrders />} />
      <Route path="/employee/accepted-orders" element={<AcceptedOrders />} />
      <Route path="/admin/foods/add" element={<FoodAdd />} />
      <Route path="/customer/cart" element={<Cart />} />
      <Route path="/customer/orders" element={<OrdersPage />} />
      <Route path="customer/order-detail/:id" element={<OrderDetailPage />} />
      <Route path="/admin/most-sold-foods" element={<MostSoldFoods />} />
    </Routes>
  );
};

export default App;


