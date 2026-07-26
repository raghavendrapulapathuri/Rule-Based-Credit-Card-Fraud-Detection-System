import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

import {
  FiAlertTriangle,
  FiBell,
  FiCheckCircle,
  FiRefreshCw,
  FiSearch,
  FiShield,
  FiActivity,
} from "react-icons/fi";

function FraudAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  /* =====================================================
     FETCH ALERTS
  ===================================================== */

  const fetchAlerts = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await api.get("/alerts");

      console.log("Fraud Alerts API Response:", response.data);

      if (Array.isArray(response.data)) {
        setAlerts(response.data);
      } else {
        setAlerts([]);
      }
    } catch (error) {
      console.error("Error fetching fraud alerts:", error);

      setAlerts([]);

      setErrorMessage(
        error.response?.data?.message ||
          "Unable to load fraud alerts."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  /* =====================================================
     RESOLVE ALERT
  ===================================================== */

  const handleResolve = async (alertId) => {
    setResolvingId(alertId);
    setErrorMessage("");

    try {
      const response = await api.put(
        `/alerts/${alertId}/resolve`
      );

      console.log("Resolved Alert:", response.data);

      setAlerts((previousAlerts) =>
        previousAlerts.map((alert) =>
          alert.id === alertId ? response.data : alert
        )
      );
    } catch (error) {
      console.error("Error resolving fraud alert:", error);

      setErrorMessage(
        error.response?.data?.message ||
          "Unable to resolve fraud alert."
      );
    } finally {
      setResolvingId(null);
    }
  };

  /* =====================================================
     SUMMARY COUNTS
  ===================================================== */

  const totalAlerts = alerts.length;

  const resolvedAlerts = alerts.filter(
    (alert) =>
      String(alert.status || "").toUpperCase() === "RESOLVED"
  ).length;

  const activeAlerts = alerts.filter(
    (alert) =>
      String(alert.status || "").toUpperCase() !== "RESOLVED"
  ).length;

  const highRiskAlerts = alerts.filter(
    (alert) =>
      Number(alert.transaction?.fraudScore || 0) >= 50
  ).length;

  /* =====================================================
     SEARCH + FILTER
  ===================================================== */

  const filteredAlerts = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return alerts.filter((alert) => {
      const status = String(
        alert.status || ""
      ).toUpperCase();

      let matchesStatus = true;

      if (statusFilter === "ACTIVE") {
        matchesStatus = status !== "RESOLVED";
      } else if (statusFilter !== "ALL") {
        matchesStatus = status === statusFilter;
      }

      const searchableText = [
        alert.id,
        alert.message,
        alert.status,
        alert.transaction?.id,
        alert.transaction?.amount,
        alert.transaction?.merchant,
        alert.transaction?.fraudScore,
      ]
        .filter(
          (value) =>
            value !== null && value !== undefined
        )
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        search === "" || searchableText.includes(search);

      return matchesStatus && matchesSearch;
    });
  }, [alerts, searchTerm, statusFilter]);

  /* =====================================================
     HELPERS
  ===================================================== */

  const getRiskType = (score) => {
    const value = Number(score || 0);

    if (value >= 50) {
      return "fraud";
    }

    if (value >= 20) {
      return "suspicious";
    }

    return "safe";
  };

  const formatAmount = (amount) => {
    const value = Number(amount || 0);

    return `₹${value.toLocaleString("en-IN")}`;
  };

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleString();
  };

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div className="fraud-alerts-page">

      {/* ================= HEADER ================= */}

      <div className="fraud-alerts-header">
        <div>
          <p className="fraud-alerts-eyebrow">
            SECURITY MONITORING
          </p>

          <h1>Fraud Alerts</h1>

          <p className="fraud-alerts-subtitle">
            Review and manage suspicious and fraudulent
            transaction alerts detected by the rule engine.
          </p>
        </div>

        <div className="fraud-monitoring-badge">
          <span className="fraud-monitoring-dot"></span>
          Fraud Monitoring Active
        </div>
      </div>

      {/* ================= ERROR ================= */}

      {errorMessage && (
        <div className="fraud-alert-error">
          <FiAlertTriangle />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ================= SUMMARY ================= */}

      <div className="fraud-alert-summary-grid">
        <AlertSummaryCard
          type="blue"
          icon={<FiBell />}
          title="Total Alerts"
          value={totalAlerts}
          footer="All generated alerts"
        />

        <AlertSummaryCard
          type="red"
          icon={<FiAlertTriangle />}
          title="Active Alerts"
          value={activeAlerts}
          footer="Requires attention"
        />

        <AlertSummaryCard
          type="green"
          icon={<FiCheckCircle />}
          title="Resolved"
          value={resolvedAlerts}
          footer="Successfully reviewed"
        />

        <AlertSummaryCard
          type="orange"
          icon={<FiShield />}
          title="High Risk"
          value={highRiskAlerts}
          footer="Fraud score 50 or above"
        />
      </div>

      {/* ================= TABLE PANEL ================= */}

      <section className="fraud-alert-panel">

        {/* TOOLBAR */}

        <div className="fraud-alert-toolbar">
          <div className="fraud-alert-search">
            <FiSearch />

            <input
              type="text"
              placeholder="Search alert, merchant, transaction ID..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
            />
          </div>

          <select
            className="fraud-alert-filter"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
          >
            <option value="ALL">All Alerts</option>
            <option value="ACTIVE">Active</option>
            <option value="RESOLVED">Resolved</option>
            <option value="FRAUD">Fraud</option>
            <option value="SUSPICIOUS">
              Suspicious
            </option>
          </select>

          <button
            className="fraud-alert-refresh"
            onClick={fetchAlerts}
            disabled={loading}
          >
            <FiRefreshCw
              className={loading ? "spin-icon" : ""}
            />

            Refresh
          </button>
        </div>

        {/* RESULT INFO */}

        <div className="fraud-alert-result-info">
          <span>
            Showing{" "}
            <strong>{filteredAlerts.length}</strong> of{" "}
            <strong>{alerts.length}</strong> alerts
          </span>

          <span className="fraud-alert-engine">
            <FiActivity />
            Rule engine active
          </span>
        </div>

        {/* ================= TABLE ================= */}

        <div className="fraud-alert-table-wrapper">
          {loading ? (
            <div className="fraud-alert-loading">
              <FiRefreshCw className="spin-icon" />
              <p>Loading fraud alerts...</p>
            </div>
          ) : (
            <div className="fraud-alert-table-scroll">
              <table className="fraud-alert-table">
                <thead>
                  <tr>
                    <th>Alert ID</th>
                    <th>Message</th>
                    <th>Transaction</th>
                    <th>Amount</th>
                    <th>Merchant</th>
                    <th>Risk Score</th>
                    <th>Status</th>
                    <th>Alert Time</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAlerts.length > 0 ? (
                    filteredAlerts.map((alert) => {
                      const score =
                        Number(
                          alert.transaction?.fraudScore
                        ) || 0;

                      const riskType =
                        getRiskType(score);

                      const status = String(
                        alert.status || "UNKNOWN"
                      ).toUpperCase();

                      const isResolved =
                        status === "RESOLVED";

                      return (
                        <tr key={alert.id}>

                          {/* ALERT ID */}

                          <td>
                            <span className="fraud-alert-id">
                              #{alert.id}
                            </span>
                          </td>

                          {/* MESSAGE */}

                          <td>
                            <div className="fraud-alert-message-cell">
                              <div
                                className={`fraud-alert-message-icon ${riskType}`}
                              >
                                {isResolved ? (
                                  <FiCheckCircle />
                                ) : (
                                  <FiAlertTriangle />
                                )}
                              </div>

                              <div>
                                <strong>
                                  {alert.message ||
                                    "Fraud alert"}
                                </strong>

                                <span>
                                  Security notification
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* TRANSACTION ID */}

                          <td>
                            <span className="fraud-transaction-id">
                              #
                              {alert.transaction?.id ??
                                "N/A"}
                            </span>
                          </td>

                          {/* AMOUNT */}

                          <td>
                            <strong className="fraud-alert-amount">
                              {formatAmount(
                                alert.transaction?.amount
                              )}
                            </strong>
                          </td>

                          {/* MERCHANT */}

                          <td>
                            {alert.transaction?.merchant ||
                              "N/A"}
                          </td>

                          {/* FRAUD SCORE */}

                          <td>
                            <RiskScore
                              score={score}
                              type={riskType}
                            />
                          </td>

                          {/* STATUS */}

                          <td>
                            <span
                              className={`fraud-alert-status ${
                                isResolved
                                  ? "resolved"
                                  : status === "FRAUD"
                                  ? "fraud"
                                  : "suspicious"
                              }`}
                            >
                              <span className="fraud-status-dot"></span>

                              {status}
                            </span>
                          </td>

                          {/* TIME */}

                          <td className="fraud-alert-time">
                            {formatDate(alert.alertTime)}
                          </td>

                          {/* ACTION */}

                          <td>
                            {isResolved ? (
                              <div className="fraud-resolved-label">
                                <FiCheckCircle />
                                Resolved
                              </div>
                            ) : (
                              <button
                                className="fraud-resolve-btn"
                                disabled={
                                  resolvingId === alert.id
                                }
                                onClick={() =>
                                  handleResolve(alert.id)
                                }
                              >
                                {resolvingId ===
                                alert.id ? (
                                  <>
                                    <FiRefreshCw className="spin-icon" />
                                    Resolving
                                  </>
                                ) : (
                                  <>
                                    <FiCheckCircle />
                                    Resolve
                                  </>
                                )}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="9"
                        className="fraud-alert-empty"
                      >
                        <FiShield />

                        <strong>
                          No fraud alerts found
                        </strong>

                        <span>
                          No alerts match the current
                          search or filter.
                        </span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

/* =====================================================
   SUMMARY CARD
===================================================== */

function AlertSummaryCard({
  type,
  icon,
  title,
  value,
  footer,
}) {
  return (
    <div
      className={`fraud-alert-summary-card ${type}`}
    >
      <div
        className={`fraud-alert-summary-icon ${type}`}
      >
        {icon}
      </div>

      <div>
        <span>{title}</span>

        <strong>{value}</strong>

        <p>{footer}</p>
      </div>
    </div>
  );
}

/* =====================================================
   RISK SCORE
===================================================== */

function RiskScore({ score, type }) {
  const percentage = Math.min(
    Math.max(Number(score) || 0, 0),
    100
  );

  return (
    <div className={`fraud-risk-score ${type}`}>
      <strong>{score}</strong>

      <div className="fraud-risk-track">
        <span
          style={{
            width: `${percentage}%`,
          }}
        ></span>
      </div>
    </div>
  );
}

export default FraudAlerts;