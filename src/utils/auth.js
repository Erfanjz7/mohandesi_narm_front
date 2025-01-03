// auth.js

const API_URL = 'http://localhost:8000/api'; // Adjust this URL to match your Django backend

// Function to log in the user
export const login = async (username, password) => {
    try {
        const response = await fetch(`${API_URL}/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        
        if (!response.ok) {
            throw new Error('Invalid credentials');
        }
        
        const data = await response.json();
        localStorage.setItem('token', data.token); // Store the token in local storage
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};

// Function to log out the user
export const logout = async () => {
    try {
        const response = await fetch(`${API_URL}/logout/`, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`,
            },
        });
        
        if (!response.ok) {
            throw new Error('Failed to log out');
        }
        
        localStorage.removeItem('token'); // Remove the token from local storage
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};

// Function to check if the user is authenticated
export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return token ? true : false;
};

// Function to get the authentication token
export const getToken = () => {
    return localStorage.getItem('token');
};

// Function to check if the user is an admin
export const isAdmin = () => {
    const token = getToken();
    // Assuming your API returns a role or user info with the token, you can decode it and check the user's role
    // For example, use a JWT library to decode the token (if you're using JWT)
    if (!token) return false;

    // Example of decoding the token and checking the role (if using JWT)
    const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT token
    return payload.role === 'ADMIN';
};

// src/utils/auth.js

export const getUserRole = () => {
  const token = localStorage.getItem('token');  // Assuming you store the token in localStorage

  if (token) {
    // Decode the token to get the user's role (for example, if it's a JWT)
    const decodedToken = JSON.parse(atob(token.split('.')[1]));  // Decoding JWT (if that's your format)
    return decodedToken.role;  // Assuming the role is in the 'role' field
  }

  return null;  // If there's no token, return null
};

