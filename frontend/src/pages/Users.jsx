import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

import {
  FiUsers,
  FiUserPlus,
  FiSearch,
  FiMail,
  FiPhone,
  FiUser,
  FiCheckCircle,
  FiShield,
  FiX,
  FiRefreshCw,
} from "react-icons/fi";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
  });

  /* =====================================================
     FETCH USERS
  ===================================================== */

  const fetchUsers = async (showRefresh = false) => {
    if (showRefresh) {
      setRefreshing(true);
    }

    try {
      const response = await api.get("/users");

      if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);

      if (showRefresh) {
        setRefreshing(false);
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* =====================================================
     INPUT CHANGE
  ===================================================== */

  const handleChange = (event) => {
    const { name, value } = event.target;

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

  /* =====================================================
     VALIDATION
  ===================================================== */

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

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  /* =====================================================
     ADD CUSTOMER
  ===================================================== */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setErrorMessage("");

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

      console.log("Customer Created:", response.data);

      setMessage("Customer added successfully.");

      setFormData({
        fullName: "",
        email: "",
        phoneNumber: "",
      });

      await fetchUsers();

      setTimeout(() => {
        setShowForm(false);
        setMessage("");
      }, 1200);
    } catch (error) {
      console.error("Error creating customer:", error);

      if (error.response?.status === 400) {
        setErrorMessage(
          "Invalid customer details. Please check the entered information."
        );
      } else if (error.response?.status === 409) {
        setErrorMessage(
          "A customer with this email already exists."
        );
      } else {
        setErrorMessage(
          error.response?.data?.message ||
            "Unable to add customer."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  /* =====================================================
     SEARCH
  ===================================================== */

  const filteredUsers = useMemo(() => {
    const search = searchTerm
      .trim()
      .toLowerCase();

    if (!search) {
      return users;
    }

    return users.filter((user) => {
      const id = String(user.id ?? "").toLowerCase();

      const name = String(
        user.fullName ?? ""
      ).toLowerCase();

      const email = String(
        user.email ?? ""
      ).toLowerCase();

      const phone = String(
        user.phoneNumber ?? ""
      ).toLowerCase();

      return (
        id.includes(search) ||
        name.includes(search) ||
        email.includes(search) ||
        phone.includes(search)
      );
    });
  }, [users, searchTerm]);

  /* =====================================================
     AVATAR INITIAL
  ===================================================== */

  const getInitial = (name) => {
    if (!name) {
      return "U";
    }

    return name.trim().charAt(0).toUpperCase();
  };

  return (
    <div className="customers-page">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="customers-header">
        <div>
          <p className="customers-eyebrow">
            CUSTOMER MANAGEMENT
          </p>

          <h1>Customers</h1>

          <p className="customers-description">
            Manage customer information and monitor
            registered users in the fraud detection system.
          </p>
        </div>

        <button
          className="customer-add-button"
          onClick={() => {
            setShowForm((previous) => !previous);
            setMessage("");
            setErrorMessage("");
          }}
        >
          {showForm ? (
            <>
              <FiX />
              Cancel
            </>
          ) : (
            <>
              <FiUserPlus />
              Add Customer
            </>
          )}
        </button>
      </div>

      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <div className="customer-summary-grid">
        <CustomerSummaryCard
          type="blue"
          icon={<FiUsers />}
          title="Total Customers"
          value={users.length}
          description="Registered customers"
        />

        <CustomerSummaryCard
          type="green"
          icon={<FiCheckCircle />}
          title="Customer Records"
          value={users.length}
          description="Available customer profiles"
        />

        <CustomerSummaryCard
          type="purple"
          icon={<FiShield />}
          title="System Status"
          value="Active"
          description="Customer service operational"
        />
      </div>

      {/* =================================================
          ADD CUSTOMER FORM
      ================================================= */}

      {showForm && (
        <section className="customer-form-panel">
          <div className="customer-form-header">
            <div className="customer-form-heading-icon">
              <FiUserPlus />
            </div>

            <div>
              <h3>Add New Customer</h3>

              <p>
                Enter the customer's personal and contact
                information.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="customer-form-grid">
              {/* FULL NAME */}

              <div className="customer-form-group">
                <label htmlFor="customerFullName">
                  Full Name
                </label>

                <div className="customer-input-wrapper">
                  <FiUser />

                  <input
                    id="customerFullName"
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    minLength="2"
                    maxLength="100"
                    required
                  />
                </div>
              </div>

              {/* EMAIL */}

              <div className="customer-form-group">
                <label htmlFor="customerEmail">
                  Email Address
                </label>

                <div className="customer-input-wrapper">
                  <FiMail />

                  <input
                    id="customerEmail"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    required
                  />
                </div>
              </div>

              {/* PHONE */}

              <div className="customer-form-group">
                <label htmlFor="customerPhone">
                  Phone Number
                </label>

                <div className="customer-input-wrapper">
                  <FiPhone />

                  <input
                    id="customerPhone"
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Enter 10-digit phone number"
                    inputMode="numeric"
                    maxLength="10"
                    required
                  />
                </div>

                <div
                  className={`customer-phone-counter ${
                    formData.phoneNumber.length === 10
                      ? "complete"
                      : ""
                  }`}
                >
                  {formData.phoneNumber.length}/10 digits
                </div>
              </div>
            </div>

            {/* MESSAGES */}

            {message && (
              <div className="customer-success-message">
                <FiCheckCircle />
                {message}
              </div>
            )}

            {errorMessage && (
              <div className="customer-error-message">
                <FiAlertIcon />
                {errorMessage}
              </div>
            )}

            <div className="customer-form-actions">
              <button
                type="button"
                className="customer-cancel-button"
                onClick={() => {
                  setShowForm(false);
                  setMessage("");
                  setErrorMessage("");
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="customer-submit-button"
                disabled={submitting}
              >
                <FiUserPlus />

                {submitting
                  ? "Adding Customer..."
                  : "Add Customer"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* =================================================
          CUSTOMER TABLE PANEL
      ================================================= */}

      <section className="customer-table-panel">
        {/* TOOLBAR */}

        <div className="customer-table-toolbar">
          <div className="customer-search">
            <FiSearch />

            <input
              type="text"
              placeholder="Search by name, email, phone or ID..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
            />
          </div>

          <button
            className="customer-refresh-button"
            onClick={() => fetchUsers(true)}
            disabled={refreshing}
          >
            <FiRefreshCw
              className={
                refreshing ? "customer-spin" : ""
              }
            />

            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* RESULT INFORMATION */}

        <div className="customer-result-info">
          <span>
            Showing{" "}
            <strong>{filteredUsers.length}</strong> of{" "}
            <strong>{users.length}</strong> customers
          </span>

          <span className="customer-system-status">
            <span className="customer-status-dot"></span>
            Customer service active
          </span>
        </div>

        {/* TABLE */}

        {loading ? (
          <div className="customer-loading">
            Loading customers...
          </div>
        ) : (
          <div className="customer-table-scroll">
            <table className="customer-table">
              <thead>
                <tr>
                  <th>Customer ID</th>
                  <th>Customer</th>
                  <th>Email Address</th>
                  <th>Phone Number</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      {/* ID */}

                      <td>
                        <span className="customer-id">
                          #{user.id}
                        </span>
                      </td>

                      {/* CUSTOMER */}

                      <td>
                        <div className="customer-profile-cell">
                          <div className="customer-avatar">
                            {getInitial(user.fullName)}
                          </div>

                          <div>
                            <strong>
                              {user.fullName || "N/A"}
                            </strong>

                            <span>
                              Registered Customer
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* EMAIL */}

                      <td>
                        <div className="customer-contact-cell">
                          <FiMail />

                          <span>
                            {user.email || "N/A"}
                          </span>
                        </div>
                      </td>

                      {/* PHONE */}

                      <td>
                        <div className="customer-contact-cell">
                          <FiPhone />

                          <span>
                            {user.phoneNumber || "N/A"}
                          </span>
                        </div>
                      </td>

                      {/* STATUS */}

                      <td>
                        <span className="customer-active-badge">
                          <span></span>
                          Active
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="customer-empty"
                    >
                      {searchTerm
                        ? "No customers match your search."
                        : "No customers found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

/* =====================================================
   SUMMARY CARD
===================================================== */

function CustomerSummaryCard({
  type,
  icon,
  title,
  value,
  description,
}) {
  return (
    <div className={`customer-summary-card ${type}`}>
      <div
        className={`customer-summary-icon ${type}`}
      >
        {icon}
      </div>

      <div>
        <span>{title}</span>

        <strong>{value}</strong>

        <p>{description}</p>
      </div>
    </div>
  );
}

/* =====================================================
   SIMPLE ALERT ICON
===================================================== */

function FiAlertIcon() {
  return <span>!</span>;
}

export default Users;