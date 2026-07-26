import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

import {
  FiActivity,
  FiAlertTriangle,
  FiCheckCircle,
  FiCreditCard,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiShield,
  FiX,
} from "react-icons/fi";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    cardId: "",
    amount: "",
    merchant: "",
    location: "",
  });

  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  // ==============================
  // FETCH TRANSACTIONS
  // ==============================

  const fetchTransactions = async () => {
    try {
      setLoading(true);

      const response = await api.get("/transactions");

      if (Array.isArray(response.data)) {
        setTransactions(response.data);
      } else {
        setTransactions([]);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // FETCH CARDS
  // ==============================

  const fetchCards = async () => {
    try {
      const response = await api.get("/cards");

      if (Array.isArray(response.data)) {
        setCards(response.data);
      } else {
        setCards([]);
      }
    } catch (error) {
      console.error("Error fetching cards:", error);
      setCards([]);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchCards();
  }, []);

  // ==============================
  // FORM CHANGE
  // ==============================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setValidationErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setErrorMessage("");
  };

  // ==============================
  // CREATE TRANSACTION
  // ==============================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setValidationErrors({});
    setErrorMessage("");
    setResult(null);

    const errors = {};

    if (!formData.cardId) {
      errors.cardId = "Please select a card.";
    }

    if (!formData.amount) {
      errors.amount = "Amount is required.";
    } else if (Number(formData.amount) <= 0) {
      errors.amount = "Amount must be greater than 0.";
    }

    if (!formData.merchant.trim()) {
      errors.merchant = "Merchant name is required.";
    } else if (
      formData.merchant.trim().length < 2 ||
      formData.merchant.trim().length > 100
    ) {
      errors.merchant =
        "Merchant name must be between 2 and 100 characters.";
    }

    if (!formData.location.trim()) {
      errors.location = "Location is required.";
    } else if (
      formData.location.trim().length < 2 ||
      formData.location.trim().length > 100
    ) {
      errors.location =
        "Location must be between 2 and 100 characters.";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
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

      setFormData({
        cardId: "",
        amount: "",
        merchant: "",
        location: "",
      });

      await fetchTransactions();
    } catch (error) {
      console.error("Transaction creation error:", error);

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

  // ==============================
  // COUNTS
  // ==============================

  const totalTransactions = transactions.length;

  const safeTransactions = transactions.filter(
    (transaction) =>
      transaction.status === "SAFE" ||
      transaction.status === "SUCCESS"
  ).length;

  const suspiciousTransactions = transactions.filter(
    (transaction) => transaction.status === "SUSPICIOUS"
  ).length;

  const fraudTransactions = transactions.filter(
    (transaction) => transaction.status === "FRAUD"
  ).length;

  // ==============================
  // FILTER + SEARCH
  // ==============================

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const normalizedStatus =
        transaction.status === "SUCCESS"
          ? "SAFE"
          : transaction.status;

      const matchesStatus =
        statusFilter === "ALL" ||
        normalizedStatus === statusFilter;

      const search = searchTerm.toLowerCase().trim();

      const matchesSearch =
        !search ||
        String(transaction.id ?? "")
          .toLowerCase()
          .includes(search) ||
        String(transaction.merchant ?? "")
          .toLowerCase()
          .includes(search) ||
        String(transaction.location ?? "")
          .toLowerCase()
          .includes(search) ||
        String(transaction.amount ?? "")
          .toLowerCase()
          .includes(search);

      return matchesStatus && matchesSearch;
    });
  }, [transactions, statusFilter, searchTerm]);

  // ==============================
  // HELPERS
  // ==============================

  const normalizeStatus = (status) => {
    if (status === "SUCCESS") {
      return "SAFE";
    }

    return status || "UNKNOWN";
  };

  const formatAmount = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  const closeForm = () => {
    setShowForm(false);
    setResult(null);
    setErrorMessage("");
    setValidationErrors({});
  };

  return (
    <div className="transactions-page">

      {/* ================= HEADER ================= */}

      <div className="transactions-header">
        <div>
          <p className="transactions-eyebrow">
            TRANSACTION MONITORING
          </p>

          <h1>Transactions</h1>

          <p>
            Monitor, analyze and review card transactions
            processed by the fraud detection engine.
          </p>
        </div>

        <button
          className="new-transaction-btn"
          onClick={() => {
            setShowForm(true);
            setResult(null);
            setErrorMessage("");
            setValidationErrors({});
          }}
        >
          <FiPlus />
          New Transaction
        </button>
      </div>

      {/* ================= SUMMARY CARDS ================= */}

      <div className="transaction-summary-grid">

        <SummaryCard
          type="blue"
          icon={<FiCreditCard />}
          label="Total Transactions"
          value={totalTransactions}
          text="All processed transactions"
        />

        <SummaryCard
          type="green"
          icon={<FiCheckCircle />}
          label="Safe Transactions"
          value={safeTransactions}
          text="Approved activity"
        />

        <SummaryCard
          type="orange"
          icon={<FiAlertTriangle />}
          label="Suspicious"
          value={suspiciousTransactions}
          text="Requires monitoring"
        />

        <SummaryCard
          type="red"
          icon={<FiShield />}
          label="Fraud Transactions"
          value={fraudTransactions}
          text="High-risk activity"
        />

      </div>

      {/* ================= FILTER BAR ================= */}

      <div className="transaction-toolbar">

        <div className="transaction-search">
          <FiSearch />

          <input
            type="text"
            placeholder="Search ID, merchant, location or amount..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />
        </div>

        <select
          className="transaction-filter-select"
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
        >
          <option value="ALL">All Status</option>
          <option value="SAFE">Safe</option>
          <option value="SUSPICIOUS">
            Suspicious
          </option>
          <option value="FRAUD">Fraud</option>
        </select>

        <button
          className="transaction-refresh-btn"
          onClick={fetchTransactions}
          disabled={loading}
        >
          <FiRefreshCw
            className={loading ? "spin-icon" : ""}
          />

          Refresh
        </button>

      </div>

      {/* ================= RESULT COUNT ================= */}

      <div className="transaction-result-info">
        <span>
          Showing{" "}
          <strong>{filteredTransactions.length}</strong>{" "}
          of <strong>{transactions.length}</strong>{" "}
          transactions
        </span>

        <span className="transaction-engine-status">
          <FiActivity />
          Fraud engine active
        </span>
      </div>

      {/* ================= TABLE ================= */}

      <div className="premium-transaction-table">

        {loading ? (
          <div className="transaction-loading">
            <FiRefreshCw className="spin-icon" />

            <p>Loading transactions...</p>
          </div>
        ) : (
          <div className="transaction-table-scroll">

            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Amount</th>
                  <th>Merchant</th>
                  <th>Location</th>
                  <th>Date & Time</th>
                  <th>Risk Score</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map(
                    (transaction) => {
                      const status = normalizeStatus(
                        transaction.status
                      );

                      return (
                        <tr key={transaction.id}>

                          <td>
                            <span className="transaction-id">
                              #{transaction.id}
                            </span>
                          </td>

                          <td>
                            <strong className="transaction-amount">
                              {formatAmount(
                                transaction.amount
                              )}
                            </strong>
                          </td>

                          <td>
                            {transaction.merchant ||
                              "N/A"}
                          </td>

                          <td>
                            {transaction.location ||
                              "N/A"}
                          </td>

                          <td className="transaction-date">
                            {transaction.transactionTime
                              ? new Date(
                                  transaction.transactionTime
                                ).toLocaleString()
                              : "N/A"}
                          </td>

                          <td>
                            <RiskScore
                              score={
                                transaction.fraudScore ??
                                0
                              }
                            />
                          </td>

                          <td>
                            <span
                              className={`transaction-status status-${status.toLowerCase()}`}
                            >
                              <span className="status-dot-small"></span>

                              {status}
                            </span>
                          </td>

                        </tr>
                      );
                    }
                  )
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="transaction-empty"
                    >
                      <FiSearch />

                      <strong>
                        No transactions found
                      </strong>

                      <span>
                        Try changing your search or
                        status filter.
                      </span>
                    </td>
                  </tr>
                )}

              </tbody>
            </table>

          </div>
        )}
      </div>

      {/* ================= NEW TRANSACTION MODAL ================= */}

      {showForm && (
        <div
          className="transaction-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeForm();
            }
          }}
        >

          <div className="transaction-modal">

            <div className="transaction-modal-header">

              <div>
                <span>FRAUD ANALYSIS</span>

                <h2>New Transaction</h2>

                <p>
                  Enter transaction information for
                  real-time fraud analysis.
                </p>
              </div>

              <button
                className="transaction-modal-close"
                onClick={closeForm}
              >
                <FiX />
              </button>

            </div>

            <form
              className="transaction-form"
              onSubmit={handleSubmit}
            >

              <div className="transaction-form-grid">

                {/* CARD */}

                <FormGroup
                  label="Card"
                  error={validationErrors.cardId}
                >
                  <select
                    name="cardId"
                    value={formData.cardId}
                    onChange={handleChange}
                  >
                    <option value="">
                      Select Card
                    </option>

                    {cards.map((card) => (
                      <option
                        key={card.id}
                        value={card.id}
                      >
                        {card.cardHolderName ||
                          "Card"}{" "}
                        - ****
                        {card.cardNumber
                          ? card.cardNumber.slice(-4)
                          : card.id}
                      </option>
                    ))}
                  </select>
                </FormGroup>

                {/* AMOUNT */}

                <FormGroup
                  label="Amount"
                  error={validationErrors.amount}
                >
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="Enter amount"
                    min="0.01"
                    step="0.01"
                  />
                </FormGroup>

                {/* MERCHANT */}

                <FormGroup
                  label="Merchant"
                  error={
                    validationErrors.merchant
                  }
                >
                  <input
                    type="text"
                    name="merchant"
                    value={formData.merchant}
                    onChange={handleChange}
                    placeholder="Enter merchant name"
                  />
                </FormGroup>

                {/* LOCATION */}

                <FormGroup
                  label="Location"
                  error={
                    validationErrors.location
                  }
                >
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Enter transaction location"
                  />
                </FormGroup>

              </div>

              {errorMessage && (
                <div className="transaction-error-message">
                  <FiAlertTriangle />
                  {errorMessage}
                </div>
              )}

              {/* RESULT */}

              {result && (
                <div
                  className={`transaction-analysis-result result-${normalizeStatus(
                    result.status
                  ).toLowerCase()}`}
                >

                  <div className="analysis-result-icon">
                    {normalizeStatus(
                      result.status
                    ) === "FRAUD" ? (
                      <FiShield />
                    ) : normalizeStatus(
                        result.status
                      ) === "SUSPICIOUS" ? (
                      <FiAlertTriangle />
                    ) : (
                      <FiCheckCircle />
                    )}
                  </div>

                  <div>
                    <span>
                      Analysis Complete
                    </span>

                    <h3>
                      {normalizeStatus(
                        result.status
                      )}
                    </h3>

                    <p>
                      Transaction #{result.id} ·
                      Fraud Score:{" "}
                      <strong>
                        {result.fraudScore ?? 0}
                      </strong>
                    </p>
                  </div>

                </div>
              )}

              {/* BUTTONS */}

              <div className="transaction-form-actions">

                <button
                  type="button"
                  className="transaction-cancel-btn"
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="transaction-analyze-btn"
                  disabled={submitting}
                >
                  <FiShield />

                  {submitting
                    ? "Analyzing..."
                    : "Analyze Transaction"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

/* =====================================================
   SUMMARY CARD
===================================================== */

function SummaryCard({
  type,
  icon,
  label,
  value,
  text,
}) {
  return (
    <div
      className={`transaction-summary-card ${type}`}
    >
      <div
        className={`transaction-summary-icon ${type}`}
      >
        {icon}
      </div>

      <div>
        <span>{label}</span>

        <strong>{value}</strong>

        <p>{text}</p>
      </div>
    </div>
  );
}

/* =====================================================
   RISK SCORE
===================================================== */

function RiskScore({ score }) {
  let level = "safe";

  if (score >= 60) {
    level = "fraud";
  } else if (score >= 30) {
    level = "suspicious";
  }

  return (
    <div className={`risk-score ${level}`}>
      <strong>{score}</strong>

      <div className="risk-score-track">
        <span
          style={{
            width: `${Math.min(
              Number(score) || 0,
              100
            )}%`,
          }}
        ></span>
      </div>
    </div>
  );
}

/* =====================================================
   FORM GROUP
===================================================== */

function FormGroup({
  label,
  error,
  children,
}) {
  return (
    <div className="transaction-form-group">

      <label>{label}</label>

      {children}

      {error && (
        <small>{error}</small>
      )}

    </div>
  );
}

export default Transactions;