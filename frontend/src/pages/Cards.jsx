import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

import {
  FiCreditCard,
  FiPlus,
  FiSearch,
  FiRefreshCw,
  FiUser,
  FiDollarSign,
  FiShield,
  FiX,
  FiCheckCircle,
  FiAlertTriangle,
} from "react-icons/fi";

function Cards() {
  const [cards, setCards] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    userId: "",
    cardNumber: "",
    cardHolderName: "",
    cardType: "",
    balance: "",
  });

  /* =====================================================
     FETCH CARDS
  ===================================================== */

  const fetchCards = async (showRefresh = false) => {
    if (showRefresh) {
      setRefreshing(true);
    }

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
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /* =====================================================
     FETCH USERS
  ===================================================== */

  const fetchUsers = async () => {
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
    }
  };

  useEffect(() => {
    fetchCards();
    fetchUsers();
  }, []);

  /* =====================================================
     INPUT CHANGE
  ===================================================== */

  const handleChange = (event) => {
    const { name, value } = event.target;

    /*
      Card number:
      only numbers and maximum 16 digits
    */
    if (name === "cardNumber") {
      const numbersOnly = value.replace(/\D/g, "");

      setFormData((previous) => ({
        ...previous,
        cardNumber: numbersOnly.slice(0, 16),
      }));

      return;
    }

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =====================================================
     VALIDATE FORM
  ===================================================== */

  const validateForm = () => {
    if (!formData.userId) {
      setErrorMessage("Please select a customer.");
      return false;
    }

    if (formData.cardNumber.length !== 16) {
      setErrorMessage(
        "Card number must contain exactly 16 digits."
      );
      return false;
    }

    if (formData.cardHolderName.trim().length < 2) {
      setErrorMessage(
        "Please enter a valid card holder name."
      );
      return false;
    }

    if (!formData.cardType) {
      setErrorMessage("Please select a card type.");
      return false;
    }

    if (
      formData.balance === "" ||
      Number(formData.balance) < 0
    ) {
      setErrorMessage(
        "Please enter a valid card balance."
      );
      return false;
    }

    return true;
  };

  /* =====================================================
     ADD CARD
  ===================================================== */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setErrorMessage("");

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    const cardData = {
      cardNumber: formData.cardNumber.trim(),

      cardHolderName:
        formData.cardHolderName.trim(),

      cardType: formData.cardType,

      balance: Number(formData.balance),

      user: {
        id: Number(formData.userId),
      },
    };

    try {
      const response = await api.post(
        "/cards",
        cardData
      );

      console.log("Card Created:", response.data);

      setMessage("Card added successfully.");

      setFormData({
        userId: "",
        cardNumber: "",
        cardHolderName: "",
        cardType: "",
        balance: "",
      });

      await fetchCards();

      setTimeout(() => {
        setShowForm(false);
        setMessage("");
      }, 1200);
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

  /* =====================================================
     FILTER CARDS
  ===================================================== */

  const filteredCards = useMemo(() => {
    const search = searchTerm
      .trim()
      .toLowerCase();

    return cards.filter((card) => {
      const matchesType =
        typeFilter === "ALL" ||
        String(card.cardType).toUpperCase() ===
          typeFilter;

      if (!matchesType) {
        return false;
      }

      if (!search) {
        return true;
      }

      const id = String(
        card.id ?? ""
      ).toLowerCase();

      const cardNumber = String(
        card.cardNumber ?? ""
      ).toLowerCase();

      const holder = String(
        card.cardHolderName ?? ""
      ).toLowerCase();

      const type = String(
        card.cardType ?? ""
      ).toLowerCase();

      const user = String(
        card.user?.fullName ?? ""
      ).toLowerCase();

      return (
        id.includes(search) ||
        cardNumber.includes(search) ||
        holder.includes(search) ||
        type.includes(search) ||
        user.includes(search)
      );
    });
  }, [cards, searchTerm, typeFilter]);

  /* =====================================================
     CARD STATISTICS
  ===================================================== */

  const visaCards = cards.filter(
    (card) =>
      String(card.cardType).toUpperCase() === "VISA"
  ).length;

  const masterCards = cards.filter(
    (card) =>
      String(card.cardType).toUpperCase() ===
      "MASTERCARD"
  ).length;

  const rupayCards = cards.filter(
    (card) =>
      String(card.cardType).toUpperCase() === "RUPAY"
  ).length;

  const totalBalance = cards.reduce(
    (total, card) =>
      total + Number(card.balance ?? 0),
    0
  );

  /* =====================================================
     MASK CARD NUMBER
  ===================================================== */

  const maskCardNumber = (cardNumber) => {
    if (!cardNumber) {
      return "N/A";
    }

    const number = String(cardNumber);

    if (number.length < 4) {
      return number;
    }

    const lastFour = number.slice(-4);

    return `•••• •••• •••• ${lastFour}`;
  };

  /* =====================================================
     CARD TYPE CLASS
  ===================================================== */

  const getCardTypeClass = (type) => {
    switch (String(type).toUpperCase()) {
      case "VISA":
        return "visa";

      case "MASTERCARD":
        return "mastercard";

      case "RUPAY":
        return "rupay";

      default:
        return "other";
    }
  };

  return (
    <div className="cards-page">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="cards-page-header">
        <div>
          <p className="cards-eyebrow">
            CARD MANAGEMENT
          </p>

          <h1>Cards</h1>

          <p className="cards-description">
            Manage registered payment cards and their
            associated customer accounts.
          </p>
        </div>

        <button
          className="cards-add-button"
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
              <FiPlus />
              Add Card
            </>
          )}
        </button>
      </div>

      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <div className="cards-summary-grid">
        <CardSummary
          type="blue"
          icon={<FiCreditCard />}
          title="Total Cards"
          value={cards.length}
          description="Registered payment cards"
        />

        <CardSummary
          type="purple"
          icon={<FiShield />}
          title="Visa Cards"
          value={visaCards}
          description="Registered VISA cards"
        />

        <CardSummary
          type="orange"
          icon={<FiCreditCard />}
          title="MasterCard"
          value={masterCards}
          description="Registered MasterCards"
        />

        <CardSummary
          type="green"
          icon={<FiDollarSign />}
          title="Total Balance"
          value={`₹${totalBalance.toLocaleString(
            "en-IN",
            {
              maximumFractionDigits: 2,
            }
          )}`}
          description={`${rupayCards} RuPay card${
            rupayCards === 1 ? "" : "s"
          } registered`}
        />
      </div>

      {/* =================================================
          ADD CARD FORM
      ================================================= */}

      {showForm && (
        <section className="cards-form-panel">
          <div className="cards-form-heading">
            <div className="cards-form-heading-icon">
              <FiCreditCard />
            </div>

            <div>
              <h3>Add New Card</h3>

              <p>
                Register a payment card and associate it
                with an existing customer.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="cards-form-grid">
              {/* CUSTOMER */}

              <div className="cards-form-group">
                <label>Customer</label>

                <div className="cards-input-wrapper">
                  <FiUser />

                  <select
                    name="userId"
                    value={formData.userId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select Customer
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
              </div>

              {/* CARD NUMBER */}

              <div className="cards-form-group">
                <label>Card Number</label>

                <div className="cards-input-wrapper">
                  <FiCreditCard />

                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    placeholder="Enter 16-digit card number"
                    inputMode="numeric"
                    maxLength="16"
                    required
                  />
                </div>

                <div
                  className={`cards-number-counter ${
                    formData.cardNumber.length === 16
                      ? "complete"
                      : ""
                  }`}
                >
                  {formData.cardNumber.length}/16 digits
                </div>
              </div>

              {/* CARD HOLDER */}

              <div className="cards-form-group">
                <label>Card Holder Name</label>

                <div className="cards-input-wrapper">
                  <FiUser />

                  <input
                    type="text"
                    name="cardHolderName"
                    value={formData.cardHolderName}
                    onChange={handleChange}
                    placeholder="Enter card holder name"
                    required
                  />
                </div>
              </div>

              {/* CARD TYPE */}

              <div className="cards-form-group">
                <label>Card Type</label>

                <div className="cards-input-wrapper">
                  <FiCreditCard />

                  <select
                    name="cardType"
                    value={formData.cardType}
                    onChange={handleChange}
                    required
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
              </div>

              {/* BALANCE */}

              <div className="cards-form-group">
                <label>Available Balance</label>

                <div className="cards-input-wrapper">
                  <span className="cards-rupee-symbol">
                    ₹
                  </span>

                  <input
                    type="number"
                    name="balance"
                    value={formData.balance}
                    onChange={handleChange}
                    placeholder="Enter balance"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
            </div>

            {/* SUCCESS */}

            {message && (
              <div className="cards-success-message">
                <FiCheckCircle />
                {message}
              </div>
            )}

            {/* ERROR */}

            {errorMessage && (
              <div className="cards-error-message">
                <FiAlertTriangle />
                {errorMessage}
              </div>
            )}

            <div className="cards-form-actions">
              <button
                type="button"
                className="cards-cancel-button"
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
                className="cards-submit-button"
                disabled={submitting}
              >
                <FiPlus />

                {submitting
                  ? "Adding Card..."
                  : "Add Card"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* =================================================
          CARD TABLE
      ================================================= */}

      <section className="cards-table-panel">
        {/* TOOLBAR */}

        <div className="cards-table-toolbar">
          <div className="cards-search">
            <FiSearch />

            <input
              type="text"
              placeholder="Search card, holder, customer or ID..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
            />
          </div>

          <select
            className="cards-type-filter"
            value={typeFilter}
            onChange={(event) =>
              setTypeFilter(event.target.value)
            }
          >
            <option value="ALL">
              All Cards
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

          <button
            className="cards-refresh-button"
            onClick={() => fetchCards(true)}
            disabled={refreshing}
          >
            <FiRefreshCw
              className={
                refreshing ? "cards-spin" : ""
              }
            />

            {refreshing
              ? "Refreshing..."
              : "Refresh"}
          </button>
        </div>

        {/* RESULTS */}

        <div className="cards-result-info">
          <span>
            Showing{" "}
            <strong>{filteredCards.length}</strong>{" "}
            of <strong>{cards.length}</strong> cards
          </span>

          <span className="cards-service-status">
            <span></span>
            Card service active
          </span>
        </div>

        {/* TABLE */}

        {loading ? (
          <div className="cards-loading">
            Loading cards...
          </div>
        ) : (
          <div className="cards-table-scroll">
            <table className="cards-table">
              <thead>
                <tr>
                  <th>Card ID</th>
                  <th>Card</th>
                  <th>Card Holder</th>
                  <th>Card Type</th>
                  <th>Customer</th>
                  <th>Balance</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredCards.length > 0 ? (
                  filteredCards.map((card) => (
                    <tr key={card.id}>
                      {/* ID */}

                      <td>
                        <span className="cards-id">
                          #{card.id}
                        </span>
                      </td>

                      {/* CARD NUMBER */}

                      <td>
                        <div className="cards-number-cell">
                          <div className="cards-mini-icon">
                            <FiCreditCard />
                          </div>

                          <div>
                            <strong>
                              {maskCardNumber(
                                card.cardNumber
                              )}
                            </strong>

                            <span>
                              Payment Card
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* HOLDER */}

                      <td>
                        <div className="cards-holder-cell">
                          <FiUser />

                          <span>
                            {card.cardHolderName ||
                              "N/A"}
                          </span>
                        </div>
                      </td>

                      {/* TYPE */}

                      <td>
                        <span
                          className={`cards-type-badge ${getCardTypeClass(
                            card.cardType
                          )}`}
                        >
                          {card.cardType || "N/A"}
                        </span>
                      </td>

                      {/* USER */}

                      <td>
                        <div className="cards-customer-cell">
                          <div className="cards-customer-avatar">
                            {card.user?.fullName
                              ?.charAt(0)
                              .toUpperCase() ||
                              "U"}
                          </div>

                          <span>
                            {card.user?.fullName ||
                              "N/A"}
                          </span>
                        </div>
                      </td>

                      {/* BALANCE */}

                      <td>
                        <span className="cards-balance">
                          ₹
                          {Number(
                            card.balance ?? 0
                          ).toLocaleString(
                            "en-IN",
                            {
                              maximumFractionDigits: 2,
                            }
                          )}
                        </span>
                      </td>

                      {/* STATUS */}

                      <td>
                        <span className="cards-active-badge">
                          <span></span>
                          Active
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="cards-empty"
                    >
                      {searchTerm ||
                      typeFilter !== "ALL"
                        ? "No cards match your filters."
                        : "No cards found."}
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

function CardSummary({
  type,
  icon,
  title,
  value,
  description,
}) {
  return (
    <div className={`cards-summary-card ${type}`}>
      <div
        className={`cards-summary-icon ${type}`}
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

export default Cards;