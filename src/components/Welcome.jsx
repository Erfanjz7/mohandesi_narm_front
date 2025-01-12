import { useNavigate } from "react-router-dom";
import "../style//Welcome.css";
const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      {/* Navigation Bar */}

      {/* Welcome Text */}
      <div className="content">
        <h1>WELCOME</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        <button onClick={() => navigate("/auth")} className="btn">
          Get Started
        </button>
      </div>

      {/* Mountain Background */}
      <div className="background">
        <div className="clouds"></div>
        <div className="mountains"></div>
        <div className="trees"></div>
      </div>
    </div>
  );
};

export default Welcome;



