import { useEffect, useState } from "react";
import api from "../services/api";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  // Transaction status filter
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [formData, setFormData] = useState({
    cardId: "",
    amount: "",
    merchant: "",
    location: "",
  });

  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

// Validation errors
  const [validationErrors, setValidationErrors] = useState({});

  // Fetch all transactions
  const fetchTransactions = () => {
    api
      .get("/transactions")
      .then((response) => {
        console.log(
          "Transactions API Response:",
          response.data
        );

        if (Array.isArray(response.data)) {
          setTransactions(response.data);
        } else {
          setTransactions([]);
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error(
          "Error fetching transactions:",
          error
        );

        setTransactions([]);
        setLoading(false);
      });
  };

  // Fetch cards for dropdown
  const fetchCards = () => {
    api
      .get("/cards")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setCards(response.data);
        } else {
          setCards([]);
        }
      })
      .catch((error) => {
        console.error(
          "Error fetching cards:",
          error
        );

        setCards([]);
      });
  };

  useEffect(() => {
    fetchTransactions();
    fetchCards();
  }, []);

  // Handle form input changes
  const handleChange = (event) => {
  const { name, value } = event.target;

  setFormData((previous) => ({
    ...previous,
    [name]: value,
  }));

  // Clear validation error while typing
  setValidationErrors((previous) => ({
    ...previous,
    [name]: "",
  }));

  // Clear backend error
  setErrorMessage("");
};

  // Create and analyze transaction
  const handleSubmit = async (event) => {
  event.preventDefault();

  setValidationErrors({});
  setErrorMessage("");
  setResult(null);

  const errors = {};

  // Card Validation
  if (!formData.cardId) {
    errors.cardId = "Please select a card.";
  }

  // Amount Validation
  if (!formData.amount) {
    errors.amount = "Amount is required.";
  } else if (Number(formData.amount) <= 0) {
    errors.amount = "Amount must be greater than 0.";
  }

  // Merchant Validation
  if (!formData.merchant.trim()) {
    errors.merchant = "Merchant name is required.";
  } else if (
    formData.merchant.trim().length < 2 ||
    formData.merchant.trim().length > 100
  ) {
    errors.merchant =
      "Merchant name must be between 2 and 100 characters.";
  }

  // Location Validation
  if (!formData.location.trim()) {
    errors.location = "Location is required.";
  } else if (
    formData.location.trim().length < 2 ||
    formData.location.trim().length > 100
  ) {
    errors.location =
      "Location must be between 2 and 100 characters.";
  }

  // Stop if validation fails
  if (Object.keys(errors).length > 0) {
    setValidationErrors(errors);
    setSubmitting(false);
    return;
  }

  setSubmitting(true);

  const transactionData = {
    amount: Number(formData.amount),
    merchant: formData.merchant.trim(),
    location: formData.location.trim(),

    card: {
      id: Number(formData.cardId),
    },
  };

  try {
    const response = await api.post(
      "/transactions",
      transactionData
    );

    setResult(response.data);
    setValidationErrors({});
    setErrorMessage("");

    setFormData({
      cardId: "",
      amount: "",
      merchant: "",
      location: "",
    });

    fetchTransactions();

    setTimeout(() => {
      setShowForm(false);
    }, 2000);

  } catch (error) {

    if (error.response?.data?.errors) {
      setErrorMessage(
        Object.values(error.response.data.errors).join(", ")
      );
    } else {
      setErrorMessage(
        error.response?.data?.message ||
        "Unable to create transaction."
      );
    }

  } finally {
    setSubmitting(false);
  }
};

  // Status colors
  const getStatusStyle = (status) => {
    if (status === "SAFE") {
      return {
        color: "#22c55e",
        fontWeight: "bold",
      };
    }

    if (status === "SUSPICIOUS") {
      return {
        color: "#facc15",
        fontWeight: "bold",
      };
    }

    if (status === "FRAUD") {
      return {
        color: "#ef4444",
        fontWeight: "bold",
      };
    }

    return {
      color: "#ffffff",
      fontWeight: "bold",
    };
  };

  // Filter transactions
  const filteredTransactions =
    statusFilter === "ALL"
      ? transactions
      : transactions.filter(
          (transaction) =>
            transaction.status === statusFilter
        );

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
          Transactions
        </h2>

        <button
          onClick={() => {
            setShowForm(!showForm);
            setResult(null);
            setErrorMessage("");
            setValidationErrors({});
          }}
          style={primaryButton}
        >
          {showForm
            ? "Cancel"
            : "+ New Transaction"}
        </button>
      </div>

      {/* New Transaction Form */}

      {showForm && (
        <div style={formContainer}>
          <h3
            style={{
              color: "#FFD700",
              marginTop: 0,
            }}
          >
            Analyze New Transaction
          </h3>

          <form onSubmit={handleSubmit}>
            <div style={formGrid}>
              {/* Card */}

              <div>
                <label style={labelStyle}>
                  Card
                </label>

                <select
                  name="cardId"
                  value={formData.cardId}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                >
                  <option value="">
                    Select Card
                  </option>

                  {cards.map((card) => (
                    <option
                      key={card.id}
                      value={card.id}
                    >
                      {card.cardHolderName} - ****
                      {card.cardNumber
                        ? card.cardNumber.slice(-4)
                        : card.id}
                    </option>
                  ))}
                </select>
                {validationErrors.cardId && (
                  <small
                    style={{
                      color: "#ef4444",
                      display: "block",
                      marginTop: "5px",
                  }}
              >
                {validationErrors.cardId}
              </small>
                )}
              </div>

              {/* Amount */}

              <div>
                <label style={labelStyle}>
                  Amount
                </label>

                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Enter amount"
                  min="0.01"
                  step="0.01"
                  required
                  style={inputStyle}
                />
                {validationErrors.amount && (
                  <small
                    style={{
                      color: "#ef4444",
                      display: "block",
                      marginTop: "5px",
                  }}
                >
    {validationErrors.amount}
  </small>
)}
              </div>

              {/* Merchant */}

              <div>
                <label style={labelStyle}>
                  Merchant
                </label>

                <input
                  type="text"
                  name="merchant"
                  value={formData.merchant}
                  onChange={handleChange}
                  placeholder="Enter merchant"
                  required
                  style={inputStyle}
                />
                {validationErrors.merchant && (
                  <small
                    style={{
                      color: "#ef4444",
                      display: "block",
                      marginTop: "5px",
                    }}
                  >
                    {validationErrors.merchant}
                  </small>
                )}
              </div>

              {/* Location */}

              <div>
                <label style={labelStyle}>
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter location"
                  required
                  style={inputStyle}
                />
                {validationErrors.location && (
                  <small
                    style={{
                      color: "#ef4444",
                      display: "block",
                      marginTop: "5px",
                    }}
                  >
                    {validationErrors.location}
                  </small>
                )}
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
                ? "Analyzing..."
                : "Analyze Transaction"}
            </button>
          </form>

          {/* Error Message */}

          {errorMessage && (
            <div style={errorMessageStyle}>
              {errorMessage}
            </div>
          )}
          {result && (
            <div
              style={{
                background: "#14532d",
                color: "#bbf7d0",
                padding: "15px",
                borderRadius: "8px",
                marginTop: "20px",
                marginBottom: "20px",
                border: "1px solid #22c55e",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              ✅ Transaction Created Successfully!
            </div>
          )}
          {/* Fraud Analysis Result */}

          {result && (
            <div style={resultContainer}>
              <h3
                style={{
                  marginTop: 0,
                  color: "#FFD700",
                }}
              >
                Analysis Result
              </h3>

              <p>
                Transaction ID:{" "}
                <strong>{result.id}</strong>
              </p>

              <p>
                Fraud Score:{" "}
                <strong>
                  {result.fraudScore}
                </strong>
              </p>

              <p>
                Status:{" "}
                <span
                  style={getStatusStyle(
                    result.status
                  )}
                >
                  {result.status}
                </span>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Transaction Filter */}

      <div style={filterContainer}>
        <label style={filterLabel}>
          Filter by Status:
        </label>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
          style={filterSelect}
        >
          <option value="ALL">
            All Transactions
          </option>

          <option value="SAFE">
            SAFE
          </option>

          <option value="SUSPICIOUS">
            SUSPICIOUS
          </option>

          <option value="FRAUD">
            FRAUD
          </option>
        </select>

        <span style={resultCount}>
          Showing {filteredTransactions.length} of{" "}
          {transactions.length} transactions
        </span>
      </div>

      {/* Transactions Table */}

      {loading ? (
        <p>Loading transactions...</p>
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
                <th style={tableHeader}>
                  ID
                </th>

                <th style={tableHeader}>
                  Amount
                </th>

                <th style={tableHeader}>
                  Merchant
                </th>

                <th style={tableHeader}>
                  Location
                </th>

                <th style={tableHeader}>
                  Time
                </th>

                <th style={tableHeader}>
                  Fraud Score
                </th>

                <th style={tableHeader}>
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredTransactions.length >
              0 ? (
                filteredTransactions.map(
                  (transaction) => (
                    <tr key={transaction.id}>
                      <td style={tableCell}>
                        {transaction.id}
                      </td>

                      <td style={tableCell}>
                        ₹{transaction.amount}
                      </td>

                      <td style={tableCell}>
                        {transaction.merchant ||
                          "N/A"}
                      </td>

                      <td style={tableCell}>
                        {transaction.location ||
                          "N/A"}
                      </td>

                      <td style={tableCell}>
                        {transaction.transactionTime
                          ? new Date(
                              transaction.transactionTime
                            ).toLocaleString()
                          : "N/A"}
                      </td>

                      <td style={tableCell}>
                        {transaction.fraudScore ??
                          0}
                      </td>

                      <td
                        style={{
                          ...tableCell,
                          ...getStatusStyle(
                            transaction.status
                          ),
                        }}
                      >
                        {transaction.status ||
                          "N/A"}
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      textAlign: "center",
                      padding: "30px",
                      color: "#94a3b8",
                    }}
                  >
                    No transactions found for{" "}
                    {statusFilter === "ALL"
                      ? "the selected filter."
                      : statusFilter + " status."}
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
  whiteSpace: "nowrap",
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

const filterContainer = {
  display: "flex",
  alignItems: "center",
  gap: "15px",
  marginBottom: "20px",
  flexWrap: "wrap",
};

const filterLabel = {
  color: "#FFD700",
  fontWeight: "bold",
};

const filterSelect = {
  padding: "10px 15px",
  background: "#111827",
  color: "#FFFFFF",
  border: "1px solid #FFD700",
  borderRadius: "7px",
  cursor: "pointer",
  outline: "none",
};

const resultCount = {
  color: "#94a3b8",
  fontSize: "14px",
};

const errorMessageStyle = {
  marginTop: "20px",
  padding: "15px",
  border: "1px solid #ef4444",
  borderRadius: "8px",
  color: "#ef4444",
};

const resultContainer = {
  marginTop: "20px",
  padding: "20px",
  background: "#0A192F",
  border: "1px solid #FFD700",
  borderRadius: "10px",
};

export default Transactions;