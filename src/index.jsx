import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // Assuming you have your global styles here
import { BrowserRouter } from "react-router-dom";

// Create the root element where your app will be mounted
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the app
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
