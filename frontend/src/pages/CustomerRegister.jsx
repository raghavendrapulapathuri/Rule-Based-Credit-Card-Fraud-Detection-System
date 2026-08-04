import { useState } from "react";
import api from "../services/api";
import "./CustomerRegister.css";

function CustomerRegister() {

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {

    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });

  };

  const handleSubmit = async (event) => {

    event.preventDefault();

    setMessage("");
    setError("");

    try {

      const response = await api.post(
        "/api/auth/register",
        formData
      );

      setMessage(response.data.message);

      setFormData({
        fullName: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
      });

    } catch (err) {

      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError("Server error.");
      }

    }

  };

  return (

    <div className="register-container">

      <div className="register-card">

        <h1>Create Customer Account</h1>

        <p>
          Register to access FraudShield securely.
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="phoneNumber"
            placeholder="Mobile Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <button type="submit">
            Create Account
          </button>

        </form>

        {message && (
          <p className="success">
            {message}
          </p>
        )}

        {error && (
          <p className="error">
            {error}
          </p>
        )}

      </div>

    </div>

  );

}

export default CustomerRegister;