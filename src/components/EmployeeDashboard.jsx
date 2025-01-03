import { useState } from "react";
import { Link } from "react-router-dom";
import "../style/EmployeeDashboard.css";

const EmployeeDashboard = () => {
  return (
    <div className="employee-dashboard">
      <h1>Employee Dashboard</h1>
      <div className="navigation-buttons">
        <Link to="/employee/pending-orders">
          <button>Pending Orders</button>
        </Link>
        <Link to="/employee/accepted-orders">
          <button>Accepted Orders</button>
        </Link>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
