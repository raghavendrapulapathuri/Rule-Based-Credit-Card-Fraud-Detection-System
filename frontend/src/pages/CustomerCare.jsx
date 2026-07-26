import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

import {
  FiHeadphones,
  FiClock,
  FiCheckCircle,
  FiSearch,
  FiPlus,
  FiShield,
  FiX,
  FiRefreshCw,
} from "react-icons/fi";

function CustomerCare() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [resolvingId, setResolvingId] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    customerName: "",
    issue: "",
    category: "CARD",
    priority: "MEDIUM",
  });

  /* =====================================================
     FETCH SUPPORT TICKETS
  ===================================================== */

  const fetchTickets = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await api.get("/api/support-tickets");

      console.log(
        "Support Tickets API:",
        response.data
      );

      if (Array.isArray(response.data)) {
        setTickets(response.data);
      } else {
        setTickets([]);
      }
    } catch (error) {
      console.error(
        "Error fetching support tickets:",
        error
      );

      setErrorMessage(
        "Unable to load support tickets."
      );

      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  /* =====================================================
     FORM INPUT
  ===================================================== */

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =====================================================
     CREATE SUPPORT CASE
  ===================================================== */

  const handleCreateTicket = async (event) => {
    event.preventDefault();

    setErrorMessage("");

    if (
      !formData.customerName.trim() ||
      !formData.issue.trim()
    ) {
      setErrorMessage(
        "Customer name and issue are required."
      );

      return;
    }

    setCreating(true);

    try {
      const response = await api.post(
        "/api/support-tickets",
        {
          customerName:
            formData.customerName.trim(),

          issue: formData.issue.trim(),

          category: formData.category,

          priority: formData.priority,

          status: "OPEN",
        }
      );

      console.log(
        "Created Support Ticket:",
        response.data
      );

      setTickets((previous) => [
        response.data,
        ...previous,
      ]);

      setFormData({
        customerName: "",
        issue: "",
        category: "CARD",
        priority: "MEDIUM",
      });

      setShowForm(false);
    } catch (error) {
      console.error(
        "Error creating support ticket:",
        error
      );

      setErrorMessage(
        error.response?.data?.message ||
          "Unable to create support case."
      );
    } finally {
      setCreating(false);
    }
  };

  /* =====================================================
     RESOLVE SUPPORT CASE
  ===================================================== */

  const handleResolve = async (ticketId) => {
    setResolvingId(ticketId);
    setErrorMessage("");

    try {
      const response = await api.put(
        `/api/support-tickets/${ticketId}/resolve`
      );

      setTickets((previous) =>
        previous.map((ticket) =>
          ticket.id === ticketId
            ? response.data
            : ticket
        )
      );
    } catch (error) {
      console.error(
        "Error resolving support ticket:",
        error
      );

      setErrorMessage(
        error.response?.data?.message ||
          "Unable to resolve support case."
      );
    } finally {
      setResolvingId(null);
    }
  };

  /* =====================================================
     COUNTS
  ===================================================== */

  const totalCases = tickets.length;

  const openCases = tickets.filter(
    (ticket) =>
      ticket.status?.toUpperCase() !==
      "RESOLVED"
  ).length;

  const resolvedCases = tickets.filter(
    (ticket) =>
      ticket.status?.toUpperCase() ===
      "RESOLVED"
  ).length;

  const fraudCases = tickets.filter(
    (ticket) =>
      ticket.category?.toUpperCase() ===
      "FRAUD"
  ).length;

  /* =====================================================
     SEARCH + FILTER
  ===================================================== */

  const filteredTickets = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    return tickets.filter((ticket) => {
      const matchesSearch =
        !searchValue ||
        ticket.customerName
          ?.toLowerCase()
          .includes(searchValue) ||
        ticket.issue
          ?.toLowerCase()
          .includes(searchValue) ||
        ticket.category
          ?.toLowerCase()
          .includes(searchValue) ||
        String(ticket.id).includes(
          searchValue
        );

      const matchesStatus =
        statusFilter === "ALL" ||
        ticket.status?.toUpperCase() ===
          statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [tickets, search, statusFilter]);

  /* =====================================================
     HELPERS
  ===================================================== */

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleString();
  };

  const getPriorityClass = (priority) => {
    switch (priority?.toUpperCase()) {
      case "CRITICAL":
        return "support-priority critical";

      case "HIGH":
        return "support-priority high";

      case "MEDIUM":
        return "support-priority medium";

      default:
        return "support-priority low";
    }
  };

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="customer-care-page">

      {/* HEADER */}

      <div className="customer-care-header">
        <div>
          <p className="customer-care-eyebrow">
            CUSTOMER SUPPORT
          </p>

          <h1>Customer Care</h1>

          <p className="customer-care-description">
            Manage customer support requests,
            fraud complaints and card-related
            issues.
          </p>
        </div>

        <button
          type="button"
          className="support-new-ticket-btn"
          onClick={() =>
            setShowForm(true)
          }
        >
          <FiPlus />

          New Support Case
        </button>
      </div>

      {/* ERROR */}

      {errorMessage && (
        <div className="support-error-message">
          {errorMessage}
        </div>
      )}

      {/* SUMMARY CARDS */}

      <div className="support-summary-grid">
        <SupportCard
          type="blue"
          icon={<FiHeadphones />}
          title="Total Cases"
          value={totalCases}
          text="Customer support requests"
        />

        <SupportCard
          type="orange"
          icon={<FiClock />}
          title="Open Cases"
          value={openCases}
          text="Waiting for resolution"
        />

        <SupportCard
          type="green"
          icon={<FiCheckCircle />}
          title="Resolved"
          value={resolvedCases}
          text="Successfully resolved"
        />

        <SupportCard
          type="purple"
          icon={<FiShield />}
          title="Fraud Complaints"
          value={fraudCases}
          text="Fraud-related cases"
        />
      </div>

      {/* TABLE PANEL */}

      <section className="support-table-panel">

        {/* TOOLBAR */}

        <div className="support-table-toolbar">
          <div className="support-search">
            <FiSearch />

            <input
              type="text"
              value={search}
              placeholder="Search ticket, customer, issue..."
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

          <select
            className="support-filter"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
          >
            <option value="ALL">
              All Cases
            </option>

            <option value="OPEN">
              Open
            </option>

            <option value="RESOLVED">
              Resolved
            </option>
          </select>

          <button
            type="button"
            className="support-refresh-btn"
            onClick={fetchTickets}
          >
            <FiRefreshCw />

            Refresh
          </button>

          <div className="support-service-active">
            <span></span>
            Support Service Active
          </div>
        </div>

        {/* RESULT COUNT */}

        <div className="support-results-info">
          Showing{" "}
          <strong>
            {filteredTickets.length}
          </strong>{" "}
          of{" "}
          <strong>
            {tickets.length}
          </strong>{" "}
          support cases
        </div>

        {/* TABLE */}

        <div className="support-table-scroll">
          <table className="support-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Customer</th>
                <th>Issue</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="8"
                    className="support-empty"
                  >
                    Loading support cases...
                  </td>
                </tr>
              ) : filteredTickets.length > 0 ? (
                filteredTickets.map(
                  (ticket) => (
                    <tr key={ticket.id}>
                      <td>
                        <strong className="support-ticket-id">
                          #{ticket.id}
                        </strong>
                      </td>

                      <td>
                        {ticket.customerName ||
                          "N/A"}
                      </td>

                      <td>
                        <div className="support-issue">
                          {ticket.issue ||
                            "N/A"}
                        </div>
                      </td>

                      <td>
                        <span className="support-category">
                          {ticket.category ||
                            "N/A"}
                        </span>
                      </td>

                      <td>
                        <span
                          className={getPriorityClass(
                            ticket.priority
                          )}
                        >
                          {ticket.priority ||
                            "LOW"}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`support-status ${
                            ticket.status ===
                            "RESOLVED"
                              ? "resolved"
                              : "open"
                          }`}
                        >
                          {ticket.status ||
                            "OPEN"}
                        </span>
                      </td>

                      <td>
                        {formatDate(
                          ticket.createdAt
                        )}
                      </td>

                      <td>
                        {ticket.status ===
                        "RESOLVED" ? (
                          <span className="support-resolved-text">
                            <FiCheckCircle />
                            Resolved
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="support-resolve-btn"
                            disabled={
                              resolvingId ===
                              ticket.id
                            }
                            onClick={() =>
                              handleResolve(
                                ticket.id
                              )
                            }
                          >
                            {resolvingId ===
                            ticket.id
                              ? "Resolving..."
                              : "Resolve"}
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="support-empty"
                  >
                    <div className="support-empty-icon">
                      <FiHeadphones />
                    </div>

                    <strong>
                      No support cases found
                    </strong>

                    <p>
                      Create a new support case
                      to get started.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* =================================================
          CREATE CASE MODAL
      ================================================= */}

      {showForm && (
        <div
          className="support-modal-overlay"
          onClick={() =>
            setShowForm(false)
          }
        >
          <div
            className="support-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="support-modal-header">
              <div>
                <span>
                  CUSTOMER SUPPORT
                </span>

                <h2>
                  New Support Case
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowForm(false)
                }
              >
                <FiX />
              </button>
            </div>

            <form
              onSubmit={
                handleCreateTicket
              }
            >
              <div className="support-form-group">
                <label>
                  Customer Name
                </label>

                <input
                  type="text"
                  name="customerName"
                  value={
                    formData.customerName
                  }
                  onChange={
                    handleInputChange
                  }
                  placeholder="Enter customer name"
                  required
                />
              </div>

              <div className="support-form-group">
                <label>
                  Issue Description
                </label>

                <textarea
                  name="issue"
                  value={formData.issue}
                  onChange={
                    handleInputChange
                  }
                  placeholder="Describe the customer's issue..."
                  rows="4"
                  required
                />
              </div>

              <div className="support-form-row">
                <div className="support-form-group">
                  <label>
                    Category
                  </label>

                  <select
                    name="category"
                    value={
                      formData.category
                    }
                    onChange={
                      handleInputChange
                    }
                  >
                    <option value="CARD">
                      Card
                    </option>

                    <option value="TRANSACTION">
                      Transaction
                    </option>

                    <option value="FRAUD">
                      Fraud
                    </option>

                    <option value="ACCOUNT">
                      Account
                    </option>

                    <option value="OTHER">
                      Other
                    </option>
                  </select>
                </div>

                <div className="support-form-group">
                  <label>
                    Priority
                  </label>

                  <select
                    name="priority"
                    value={
                      formData.priority
                    }
                    onChange={
                      handleInputChange
                    }
                  >
                    <option value="LOW">
                      Low
                    </option>

                    <option value="MEDIUM">
                      Medium
                    </option>

                    <option value="HIGH">
                      High
                    </option>

                    <option value="CRITICAL">
                      Critical
                    </option>
                  </select>
                </div>
              </div>

              <div className="support-modal-actions">
                <button
                  type="button"
                  className="support-cancel-btn"
                  onClick={() =>
                    setShowForm(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="support-create-btn"
                  disabled={creating}
                >
                  <FiPlus />

                  {creating
                    ? "Creating..."
                    : "Create Case"}
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

function SupportCard({
  type,
  icon,
  title,
  value,
  text,
}) {
  return (
    <div
      className={`support-summary-card ${type}`}
    >
      <div
        className={`support-summary-icon ${type}`}
      >
        {icon}
      </div>

      <div>
        <span>{title}</span>

        <strong>{value}</strong>

        <p>{text}</p>
      </div>
    </div>
  );
}

export default CustomerCare;