import { useEffect, useState } from "react";
import api from "../services/api";

function Cards() {
  const [cards, setCards] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    userId: "",
    cardNumber: "",
    cardHolderName: "",
    cardType: "",
    balance: "",
  });

  // Fetch all cards
  const fetchCards = () => {
    api
      .get("/cards")
      .then((response) => {
        console.log("Cards API Response:", response.data);

        if (Array.isArray(response.data)) {
          setCards(response.data);
        } else {
          setCards([]);
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching cards:", error);
        setCards([]);
        setLoading(false);
      });
  };

  // Fetch users for dropdown
  const fetchUsers = () => {
    api
      .get("/users")
      .then((response) => {
        console.log("Users API Response:", response.data);

        if (Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          setUsers([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setUsers([]);
      });
  };

  useEffect(() => {
    fetchCards();
    fetchUsers();
  }, []);

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Add new card
  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitting(true);
    setMessage("");
    setErrorMessage("");

    const cardData = {
      cardNumber: formData.cardNumber.trim(),
      cardHolderName: formData.cardHolderName.trim(),
      cardType: formData.cardType,
      balance: Number(formData.balance),

      user: {
        id: Number(formData.userId),
      },
    };

    try {
      const response = await api.post("/cards", cardData);

      console.log("Card Created:", response.data);

      setMessage("Card added successfully.");

      setFormData({
        userId: "",
        cardNumber: "",
        cardHolderName: "",
        cardType: "",
        balance: "",
      });

      // Refresh card table
      fetchCards();
    } catch (error) {
      console.error("Error creating card:", error);

      setErrorMessage(
        error.response?.data?.message ||
          "Unable to add card."
      );
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
          Cards Management
        </h2>

        <button
          onClick={() => {
            setShowForm(!showForm);
            setMessage("");
            setErrorMessage("");
          }}
          style={primaryButton}
        >
          {showForm ? "Cancel" : "+ Add Card"}
        </button>
      </div>

      {/* Add Card Form */}
      {showForm && (
        <div style={formContainer}>
          <h3
            style={{
              color: "#FFD700",
              marginTop: 0,
            }}
          >
            Add New Card
          </h3>

          <form onSubmit={handleSubmit}>
            <div style={formGrid}>
              {/* User */}
              <div>
                <label style={labelStyle}>
                  Select User
                </label>

                <select
                  name="userId"
                  value={formData.userId}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                >
                  <option value="">
                    Select User
                  </option>

                  {users.map((user) => (
                    <option
                      key={user.id}
                      value={user.id}
                    >
                      {user.fullName} - {user.email}
                    </option>
                  ))}
                </select>
              </div>

              {/* Card Number */}
              <div>
                <label style={labelStyle}>
                  Card Number
                </label>

                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  placeholder="Enter card number"
                  required
                  maxLength="16"
                  style={inputStyle}
                />
              </div>

              {/* Card Holder */}
              <div>
                <label style={labelStyle}>
                  Card Holder Name
                </label>

                <input
                  type="text"
                  name="cardHolderName"
                  value={formData.cardHolderName}
                  onChange={handleChange}
                  placeholder="Enter card holder name"
                  required
                  style={inputStyle}
                />
              </div>

              {/* Card Type */}
              <div>
                <label style={labelStyle}>
                  Card Type
                </label>

                <select
                  name="cardType"
                  value={formData.cardType}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                >
                  <option value="">
                    Select Card Type
                  </option>

                  <option value="VISA">
                    VISA
                  </option>

                  <option value="MASTERCARD">
                    MasterCard
                  </option>

                  <option value="RUPAY">
                    RuPay
                  </option>
                </select>
              </div>

              {/* Balance */}
              <div>
                <label style={labelStyle}>
                  Balance
                </label>

                <input
                  type="number"
                  name="balance"
                  value={formData.balance}
                  onChange={handleChange}
                  placeholder="Enter balance"
                  min="0"
                  step="0.01"
                  required
                  style={inputStyle}
                />
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
                ? "Adding Card..."
                : "Add Card"}
            </button>
          </form>

          {message && (
            <div style={successMessage}>
              ✓ {message}
            </div>
          )}

          {errorMessage && (
            <div style={errorStyle}>
              {errorMessage}
            </div>
          )}
        </div>
      )}

      {/* Cards Table */}
      {loading ? (
        <p>Loading cards...</p>
      ) : (
        <div
          style={{
            background: "#111827",
            border: "1px solid #FFD700",
            borderRadius: "10px",
            overflowX: "auto",
          }}
        >
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
                  Card Number
                </th>
                <th style={tableHeader}>
                  Card Holder
                </th>
                <th style={tableHeader}>
                  Card Type
                </th>
                <th style={tableHeader}>
                  Balance
                </th>
                <th style={tableHeader}>
                  User
                </th>
              </tr>
            </thead>

            <tbody>
              {cards.length > 0 ? (
                cards.map((card) => (
                  <tr key={card.id}>
                    <td style={tableCell}>
                      {card.id}
                    </td>

                    <td style={tableCell}>
                      {card.cardNumber || "N/A"}
                    </td>

                    <td style={tableCell}>
                      {card.cardHolderName || "N/A"}
                    </td>

                    <td style={tableCell}>
                      {card.cardType || "N/A"}
                    </td>

                    <td style={tableCell}>
                      ₹{card.balance ?? 0}
                    </td>

                    <td style={tableCell}>
                      {card.user?.fullName || "N/A"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      textAlign: "center",
                      padding: "25px",
                    }}
                  >
                    No cards found.
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
  whiteSpace: "nowrap",
};

const tableCell = {
  padding: "15px",
  borderBottom: "1px solid #334155",
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
    "repeat(2, minmax(200px, 1fr))",
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

export default Cards;