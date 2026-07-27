import { useState } from "react";
import {
  FiShield,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiLogIn,
} from "react-icons/fi";

import api from "../services/api";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrorMessage("");

    if (!email.trim() || !password.trim()) {
      setErrorMessage(
        "Please enter your email and password."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/api/admin/login",
        {
          email: email.trim(),
          password,
        }
      );

      console.log(
        "Admin Login:",
        response.data
      );

      const admin = {
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role,
      };

      // Store login information
      localStorage.setItem(
        "fraudshield_admin",
        JSON.stringify(admin)
      );

      // Tell App.jsx that login succeeded
      if (onLogin) {
        onLogin(admin);
      }
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      setErrorMessage(
        error.response?.data?.message ||
          "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-background-glow login-glow-one"></div>
      <div className="login-background-glow login-glow-two"></div>

      <div className="login-container">

        {/* LEFT SIDE */}

        <div className="login-brand-section">

          <div className="login-brand">

            <div className="login-brand-icon">
              <FiShield />
            </div>

            <div>
              <h1>FraudShield</h1>
              <span>
                PROTECTION CENTER
              </span>
            </div>

          </div>

          <div className="login-introduction">

            <span className="login-security-label">
              SECURE ADMIN PORTAL
            </span>

            <h2>
              Intelligent Fraud
              <br />
              Detection & Monitoring
            </h2>

            <p>
              Monitor transactions, detect
              suspicious activity and manage
              fraud alerts from one secure
              control center.
            </p>

          </div>

          <div className="login-system-status">

            <span className="login-status-dot"></span>

            <div>
              <strong>
                Fraud Detection Engine
              </strong>

              <p>
                System operational and secure
              </p>
            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="login-form-section">

          <div className="login-card">

            <div className="login-card-icon">
              <FiShield />
            </div>

            <div className="login-heading">

              <span>
                ADMIN AUTHENTICATION
              </span>

              <h2>
                Welcome Back
              </h2>

              <p>
                Sign in to access the
                FraudShield control center.
              </p>

            </div>

            {errorMessage && (
              <div className="login-error">
                {errorMessage}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="login-form"
            >

              {/* EMAIL */}

              <div className="login-field">

                <label>
                  Email Address
                </label>

                <div className="login-input-wrapper">

                  <FiMail />

                  <input
                    type="email"
                    placeholder="admin@fraudshield.com"
                    value={email}
                    onChange={(event) =>
                      setEmail(
                        event.target.value
                      )
                    }
                    autoComplete="email"
                  />

                </div>

              </div>

              {/* PASSWORD */}

              <div className="login-field">

                <label>
                  Password
                </label>

                <div className="login-input-wrapper">

                  <FiLock />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) =>
                      setPassword(
                        event.target.value
                      )
                    }
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    className="login-password-toggle"
                    onClick={() =>
                      setShowPassword(
                        (previous) =>
                          !previous
                      )
                    }
                    title={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <FiEyeOff />
                    ) : (
                      <FiEye />
                    )}
                  </button>

                </div>

              </div>

              {/* LOGIN BUTTON */}

              <button
                type="submit"
                className="login-submit-button"
                disabled={loading}
              >

                {loading ? (
                  <>
                    <span className="login-spinner"></span>
                    Signing In...
                  </>
                ) : (
                  <>
                    <FiLogIn />
                    Sign In
                  </>
                )}

              </button>

            </form>

            <div className="login-footer">

              <FiShield />

              <span>
                Authorized administrators only
              </span>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;