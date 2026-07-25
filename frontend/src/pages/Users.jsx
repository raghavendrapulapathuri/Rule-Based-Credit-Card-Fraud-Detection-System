import { useEffect, useState } from "react";
import api from "../services/api";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
  });

  // Fetch users
  const fetchUsers = () => {
    api
      .get("/users")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          setUsers([]);
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setUsers([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    // Phone number should contain digits only
    if (name === "phoneNumber") {
      const onlyNumbers = value.replace(/\D/g, "");

      setFormData((previous) => ({
        ...previous,
        phoneNumber: onlyNumbers.slice(0, 10),
      }));

      return;
    }

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Frontend validation
  const validateForm = () => {
    const fullName = formData.fullName.trim();
    const email = formData.email.trim();
    const phoneNumber = formData.phoneNumber.trim();

    if (fullName.length < 2) {
      setErrorMessage(
        "Full name must contain at least 2 characters."
      );
      return false;
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      setErrorMessage(
        "Please enter a valid email address."
      );
      return false;
    }

    const phonePattern = /^[0-9]{10}$/;

    if (!phonePattern.test(phoneNumber)) {
      setErrorMessage(
        "Phone number must contain exactly 10 digits."
      );
      return false;
    }

    return true;
  };

  // Add user
  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setErrorMessage("");

    // Stop before API call if validation fails
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    const userData = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phoneNumber: formData.phoneNumber.trim(),
    };

    try {
      const response = await api.post(
        "/users",
        userData
      );

      console.log("User Created:", response.data);

      setMessage("User added successfully.");

      setFormData({
        fullName: "",
        email: "",
        phoneNumber: "",
      });

      // Refresh users table
      fetchUsers();
    } catch (error) {
      console.error("Error creating user:", error);

      // Handle validation/backend errors
      if (error.response?.status === 400) {
        setErrorMessage(
          "Invalid user details. Please check the entered information."
        );
      } else if (error.response?.status === 409) {
        setErrorMessage(
          "A user with this email already exists."
        );
      } else {
        setErrorMessage(
          error.response?.data?.message ||
            "Unable to add user."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        flex: 1,
        padding: "30px",
        background: "#0A192F",
        minHeight: "100vh",
        color: "white",
      }}
    >
      {/* Header */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
        }}
      >
        <h2
          style={{
            color: "#FFD700",
            margin: 0,
          }}
        >
          Users Management
        </h2>

        <button
          onClick={() => {
            setShowForm(!showForm);
            setMessage("");
            setErrorMessage("");
          }}
          style={primaryButton}
        >
          {showForm ? "Cancel" : "+ Add User"}
        </button>
      </div>

      {/* Add User Form */}

      {showForm && (
        <div style={formContainer}>
          <h3
            style={{
              color: "#FFD700",
              marginTop: 0,
            }}
          >
            Add New User
          </h3>

          <form onSubmit={handleSubmit}>
            <div style={formGrid}>
              {/* Full Name */}

              <div>
                <label style={labelStyle}>
                  Full Name
                </label>

                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  minLength="2"
                  maxLength="100"
                  required
                  style={inputStyle}
                />
              </div>

              {/* Email */}

              <div>
                <label style={labelStyle}>
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  required
                  style={inputStyle}
                />
              </div>

              {/* Phone Number */}

              <div>
                <label style={labelStyle}>
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter 10-digit phone number"
                  inputMode="numeric"
                  maxLength="10"
                  required
                  style={inputStyle}
                />

                <small
                  style={{
                    color:
                      formData.phoneNumber.length === 10
                        ? "#22c55e"
                        : "#94a3b8",
                  }}
                >
                  {formData.phoneNumber.length}/10 digits
                </small>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                ...primaryButton,
                marginTop: "20px",
                opacity: submitting ? 0.6 : 1,
              }}
            >
              {submitting
                ? "Adding User..."
                : "Add User"}
            </button>
          </form>

          {/* Success Message */}

          {message && (
            <div style={successMessage}>
              ✓ {message}
            </div>
          )}

          {/* Error Message */}

          {errorMessage && (
            <div style={errorStyle}>
              ⚠ {errorMessage}
            </div>
          )}
        </div>
      )}

      {/* Users Table */}

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <div style={tableContainer}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#000000",
                  color: "#FFD700",
                }}
              >
                <th style={tableHeader}>ID</th>
                <th style={tableHeader}>
                  Full Name
                </th>
                <th style={tableHeader}>Email</th>
                <th style={tableHeader}>
                  Phone Number
                </th>
              </tr>
            </thead>

            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <td style={tableCell}>
                      {user.id}
                    </td>

                    <td style={tableCell}>
                      {user.fullName || "N/A"}
                    </td>

                    <td style={tableCell}>
                      {user.email || "N/A"}
                    </td>

                    <td style={tableCell}>
                      {user.phoneNumber || "N/A"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    style={{
                      textAlign: "center",
                      padding: "25px",
                    }}
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const tableHeader = {
  padding: "15px",
  textAlign: "left",
  borderBottom: "1px solid #FFD700",
};

const tableCell = {
  padding: "15px",
  borderBottom: "1px solid #334155",
};

const tableContainer = {
  background: "#111827",
  border: "1px solid #FFD700",
  borderRadius: "10px",
  overflowX: "auto",
};

const formContainer = {
  background: "#111827",
  border: "1px solid #FFD700",
  borderRadius: "10px",
  padding: "25px",
  marginBottom: "30px",
};

const formGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(3, minmax(200px, 1fr))",
  gap: "20px",
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  color: "#FFD700",
  fontWeight: "bold",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "6px",
  border: "1px solid #475569",
  background: "#0A192F",
  color: "white",
  boxSizing: "border-box",
  marginBottom: "5px",
};

const primaryButton = {
  padding: "11px 18px",
  background: "#FFD700",
  color: "#000000",
  border: "none",
  borderRadius: "7px",
  cursor: "pointer",
  fontWeight: "bold",
};

const successMessage = {
  marginTop: "20px",
  padding: "12px",
  border: "1px solid #22c55e",
  borderRadius: "8px",
  color: "#22c55e",
};

const errorStyle = {
  marginTop: "20px",
  padding: "12px",
  border: "1px solid #ef4444",
  borderRadius: "8px",
  color: "#ef4444",
};

export default Users;