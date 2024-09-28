import { useState } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css";
import LoadingIndicator from "./LoadingIndicator";
import { toast } from 'react-toastify';
import '../styles/CustomToastify.css'

function Form({ route, method }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");  // State for email (used only in registration)
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");  // State for confirm password (used only in registration)
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const name = method === "login" ? "Login" : "Register";

    const isValidEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%±]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
      };
    
      // Password validation function
      const isValidPassword = (password) => {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
      };


    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        if (method === "register" && password !== confirmPassword) {
             toast.success("Passwords do not match");
            setLoading(false);
            return;
        }

        if (method === "register" && !isValidEmail(email)) {
             toast.success("Please enter a valid email address.");
            setLoading(false);
            return;
          }
      
          // Password validation (for both login and register)
          if (!isValidPassword(password)) {
             toast.success(
              "Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character."
            );
            setLoading(false);
            return;
          }

        try {
            // Payload should change depending on whether it's login or registration
            const payload = method === "login"
                ? { username, password }  // Only send username and password for login
                : { username, email, password, confirm_password: confirmPassword };  // For registration

            const res = await api.post(route, payload);

            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/");
            } else {
                navigate("/login");
            }
        } catch (error) {
            console.error("Error:", error.response?.data || error.message);
             toast.success(error.response?.data || error.message);  // Show the error in an  toast.success
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1 className="form-name">{name}</h1>
            <input
                className="form-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
            />
            {method === "register" && (
                <input
                    className="form-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                />
            )}
            <input
                className="form-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            {method === "register" && (
                <input
                    className="form-input"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                />
            )}
            {loading && <LoadingIndicator />}
            <button className="form-button" type="submit">
                {name}
            </button>
            {method === "login" && (
                <Link className="to-register" to="/register">
                    Don't have an account?
                </Link>
            )}
        </form>
    );
}

export default Form;  // Make sure you have the default export here
