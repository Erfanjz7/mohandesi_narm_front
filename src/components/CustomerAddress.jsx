import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import "../style/CustomerAddress.css"; 
import { FaTrash, FaPlus } from "react-icons/fa"; // Import FontAwesome Icons

const CustomerAddress = () => {
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          alert("Unauthorized! Please login.");
          navigate("/");
          return;
        }

        const response = await Axios.get("http://127.0.0.1:8000/api/getaddresses", {
          headers: { Authorization: `Token ${token}` },
        });

        if (Array.isArray(response.data)) {
          setAddresses(response.data);
        } else {
          alert("Invalid response from server.");
        }
      } catch (err) {
        alert("Failed to load addresses.");
      }
    };

    fetchAddresses();
  }, [navigate]);

  const handleAddAddress = async () => {
    if (newAddress.trim().length < 10) {
      alert("Address must be at least 10 characters long.");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      await Axios.post(
        "http://127.0.0.1:8000/api/addaddress/",
        { address: newAddress },
        { headers: { Authorization: `Token ${token}` } }
      );

      setAddresses([...addresses, { address: newAddress }]);
      setNewAddress("");
      alert("Address added successfully!");
    } catch (err) {
      alert("Failed to add address.");
    }
  };

  const handleDeleteAddress = async (addressToDelete) => {
    try {
      const token = localStorage.getItem("authToken");
      await Axios.delete("http://127.0.0.1:8000/api/deleteaddress/", {
        data: { address: addressToDelete },
        headers: { Authorization: `Token ${token}` },
      });

      setAddresses(addresses.filter(addr => addr.address !== addressToDelete));
      alert("Address deleted successfully!");
    } catch (err) {
      alert("Failed to delete address.");
    }
  };

  return (
    <div className="customer-address">
      <h2>Manage Your Addresses</h2>
      <ul>
        {addresses.length > 0 ? (
          addresses.map((addr, index) => (
            <li key={index}>
              {addr.address}
              <button className="delete-btn" onClick={() => handleDeleteAddress(addr.address)}>
                <FaTrash />
              </button>
            </li>
          ))
        ) : (
          <p>No addresses found.</p>
        )}
      </ul>
      <div className="add-address">
        <input
          type="text"
          placeholder="Enter new address"
          value={newAddress}
          onChange={(e) => setNewAddress(e.target.value)}
        />
        <button className="add-btn" onClick={handleAddAddress}>
          <FaPlus />
        </button>
      </div>
    </div>
  );
};

export default CustomerAddress;
