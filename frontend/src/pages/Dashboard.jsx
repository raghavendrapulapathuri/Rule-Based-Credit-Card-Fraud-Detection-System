import { useEffect, useState } from "react";
import api from "../services/api";

import {
  FiCreditCard,
  FiCheckCircle,
  FiAlertTriangle,
  FiShield,
  FiBell,
  FiActivity,
  FiArrowUpRight,
  FiCheck,
} from "react-icons/fi";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

function Dashboard() {
  const [dashboard, setDashboard] = useState({
    totalTransactions: 0,
    safeTransactions: 0,
    suspiciousTransactions: 0,
    fraudTransactions: 0,
    totalAlerts: 0,
  });

  const [transactions, setTransactions] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/dashboard/summary"),
      api.get("/transactions"),
      api.get("/alerts"),
    ])
      .then(
        ([
          dashboardResponse,
          transactionsResponse,
          alertsResponse,
        ]) => {
          setDashboard(dashboardResponse.data);

          setTransactions(
            Array.isArray(transactionsResponse.data)
              ? transactionsResponse.data
              : []
          );

          setAlerts(
            Array.isArray(alertsResponse.data)
              ? alertsResponse.data
              : []
          );
        }
      )
      .catch((error) => {
        console.error("Dashboard error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  /* =========================================
     RATES
  ========================================= */

  const fraudRate =
    dashboard.totalTransactions > 0
      ? (
          (dashboard.fraudTransactions /
            dashboard.totalTransactions) *
          100
        ).toFixed(1)
      : "0.0";

  const safeRate =
    dashboard.totalTransactions > 0
      ? (
          (dashboard.safeTransactions /
            dashboard.totalTransactions) *
          100
        ).toFixed(1)
      : "0.0";

  /* =========================================
     CHART DATA
  ========================================= */

  const chartData = [];

  let safeCount = 0;
  let suspiciousCount = 0;
  let fraudCount = 0;

  const sortedTransactions = [...transactions].sort((a, b) => {
    return (
      new Date(a.transactionTime) -
      new Date(b.transactionTime)
    );
  });

  sortedTransactions.forEach((transaction, index) => {
    const status = transaction.status?.toUpperCase();

    if (status === "SUCCESS" || status === "SAFE") {
      safeCount++;
    } else if (status === "SUSPICIOUS") {
      suspiciousCount++;
    } else if (status === "FRAUD") {
      fraudCount++;
    }

    const date = transaction.transactionTime
      ? new Date(transaction.transactionTime)
      : null;

    chartData.push({
      name: date
        ? date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        : `T${index + 1}`,

      Safe: safeCount,
      Suspicious: suspiciousCount,
      Fraud: fraudCount,
    });
  });

  /* =========================================
     ALERT DATA
  ========================================= */

  const activeAlerts = alerts.filter(
    (alert) => alert.status?.toUpperCase() !== "RESOLVED"
  );

  const recentAlerts = [...alerts]
    .sort((a, b) => {
      return (
        new Date(b.alertTime || 0) -
        new Date(a.alertTime || 0)
      );
    })
    .slice(0, 4);

  /* =========================================
     DASHBOARD
  ========================================= */

  return (
    <div className="premium-dashboard">

      {/* ================= HEADER ================= */}

      <div className="dashboard-heading">
        <div>
          <p className="dashboard-eyebrow">
            FRAUD DETECTION OVERVIEW
          </p>

          <h1>Dashboard</h1>

          <p className="dashboard-subtitle">
            Monitor transactions, fraud activity and security
            alerts in real time.
          </p>
        </div>

        <div className="dashboard-live">
          <span className="live-dot"></span>
          Live Monitoring
        </div>
      </div>

      {/* ================= STAT CARDS ================= */}

      <div className="dashboard-stats">

        <StatCard
          type="blue"
          icon={<FiCreditCard />}
          title="Total Transactions"
          value={dashboard.totalTransactions}
          loading={loading}
          footer="All processed transactions"
        />

        <StatCard
          type="green"
          icon={<FiCheckCircle />}
          title="Safe Transactions"
          value={dashboard.safeTransactions}
          loading={loading}
          footer={`${safeRate}% of transactions`}
        />

        <StatCard
          type="orange"
          icon={<FiAlertTriangle />}
          title="Suspicious"
          value={dashboard.suspiciousTransactions}
          loading={loading}
          footer="Requires monitoring"
        />

        <StatCard
          type="red"
          icon={<FiShield />}
          title="Confirmed Fraud"
          value={dashboard.fraudTransactions}
          loading={loading}
          footer={`${fraudRate}% fraud rate`}
        />

      </div>

      {/* ================= MAIN GRID ================= */}

      <div className="dashboard-main-grid">

        {/* ================= TRANSACTION CHART ================= */}

        <section className="dashboard-panel transaction-overview-panel">

          <div className="panel-heading">
            <div>
              <h3>Transaction Overview</h3>

              <p>
                Transaction activity and fraud classification
              </p>
            </div>

            <div className="panel-icon blue-panel-icon">
              <FiActivity />
            </div>
          </div>

          <div
            style={{
              width: "100%",
              height: "300px",
              marginTop: "20px",
            }}
          >

            {chartData.length > 0 ? (

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <LineChart
                  data={chartData}
                  margin={{
                    top: 10,
                    right: 15,
                    left: -15,
                    bottom: 5,
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1e293b"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    tick={{
                      fill: "#64748b",
                      fontSize: 11,
                    }}
                    tickLine={false}
                    axisLine={false}
                    minTickGap={30}
                  />

                  <YAxis
                    allowDecimals={false}
                    stroke="#64748b"
                    tick={{
                      fill: "#64748b",
                      fontSize: 11,
                    }}
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip
                    contentStyle={{
                      background: "#0f172a",
                      border: "1px solid #263449",
                      borderRadius: "10px",
                      color: "#ffffff",
                    }}
                    labelStyle={{
                      color: "#94a3b8",
                    }}
                  />

                  <Legend
                    wrapperStyle={{
                      fontSize: "12px",
                      paddingTop: "10px",
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="Safe"
                    stroke="#22c55e"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 5 }}
                  />

                  <Line
                    type="monotone"
                    dataKey="Suspicious"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 5 }}
                  />

                  <Line
                    type="monotone"
                    dataKey="Fraud"
                    stroke="#ef4444"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 5 }}
                  />

                </LineChart>

              </ResponsiveContainer>

            ) : (

              <div className="chart-empty">
                No transaction data available
              </div>

            )}

          </div>

          <div className="overview-footer">

            <FiActivity />

            <span>
              Showing transaction classifications from the
              fraud detection engine.
            </span>

          </div>

        </section>

        {/* ================= SECURITY ALERTS ================= */}

        <section className="dashboard-panel alert-summary-panel">

          <div className="panel-heading">

            <div>
              <h3>Security Alerts</h3>

              <p>
                Fraud detection notifications
              </p>
            </div>

            <div className="panel-icon red-panel-icon">
              <FiBell />
            </div>

          </div>

          {/* ACTIVE ALERT COUNT */}

          <div className="alert-total">

            <div className="alert-total-icon">
              <FiBell />
            </div>

            <div>

              <span>Active Alerts</span>

              <strong>
                {loading
                  ? "--"
                  : activeAlerts.length}
              </strong>

            </div>

          </div>

          {/* RECENT ALERTS */}

          <div className="recent-alerts">

            {loading ? (

              <div className="alert-message">
                Loading alerts...
              </div>

            ) : recentAlerts.length > 0 ? (

              recentAlerts.map((alert) => {

                const resolved =
                  alert.status?.toUpperCase() ===
                  "RESOLVED";

                const fraudScore =
                  alert.transaction?.fraudScore ?? 0;

                const amount =
                  alert.transaction?.amount ?? 0;

                const merchant =
                  alert.transaction?.merchant ||
                  "Unknown Merchant";

                return (

                  <div
                    className="dashboard-alert-item"
                    key={alert.id}
                  >

                    <div
                      className={
                        resolved
                          ? "dashboard-alert-icon resolved-alert-icon"
                          : "dashboard-alert-icon active-alert-icon"
                      }
                    >

                      {resolved ? (
                        <FiCheck />
                      ) : (
                        <FiAlertTriangle />
                      )}

                    </div>

                    <div className="dashboard-alert-content">

                      <strong>
                        {alert.message ||
                          "Fraud alert detected"}
                      </strong>

                      <p>
                        {merchant} • ₹
                        {Number(amount).toLocaleString(
                          "en-IN"
                        )}
                      </p>

                      <span>
                        Fraud Score: {fraudScore}
                      </span>

                    </div>

                    <div
                      className={
                        resolved
                          ? "dashboard-alert-status resolved-status"
                          : "dashboard-alert-status active-status"
                      }
                    >

                      {resolved
                        ? "RESOLVED"
                        : alert.status || "ACTIVE"}

                    </div>

                  </div>

                );
              })

            ) : (

              <div className="alert-message">

                <div className="alert-message-icon">
                  <FiCheckCircle />
                </div>

                <div>

                  <strong>
                    No security alerts
                  </strong>

                  <p>
                    No fraud alerts have been generated.
                  </p>

                </div>

              </div>

            )}

          </div>

        </section>

      </div>

      {/* ================= BOTTOM CARDS ================= */}

      <div className="dashboard-bottom-grid">

        <section className="dashboard-panel mini-security-card">

          <div className="mini-card-icon green-mini">
            <FiShield />
          </div>

          <div>

            <span>System Status</span>

            <strong>
              Protected
            </strong>

            <p>
              Fraud engine operational
            </p>

          </div>

        </section>

        <section className="dashboard-panel mini-security-card">

          <div className="mini-card-icon purple-mini">
            <FiActivity />
          </div>

          <div>

            <span>Fraud Rate</span>

            <strong>
              {fraudRate}%
            </strong>

            <p>
              Based on all transactions
            </p>

          </div>

        </section>

        <section className="dashboard-panel mini-security-card">

          <div className="mini-card-icon orange-mini">
            <FiAlertTriangle />
          </div>

          <div>

            <span>Needs Review</span>

            <strong>
              {dashboard.suspiciousTransactions}
            </strong>

            <p>
              Suspicious transactions
            </p>

          </div>

        </section>

        <section className="dashboard-panel mini-security-card">

          <div className="mini-card-icon blue-mini">
            <FiArrowUpRight />
          </div>

          <div>

            <span>Processed</span>

            <strong>
              {dashboard.totalTransactions}
            </strong>

            <p>
              Total transaction volume
            </p>

          </div>

        </section>

      </div>

    </div>
  );
}

/* =====================================================
   STAT CARD
===================================================== */

function StatCard({
  type,
  icon,
  title,
  value,
  footer,
  loading,
}) {

  return (

    <div className={`premium-stat-card ${type}`}>

      <div className="stat-card-top">

        <div className={`stat-icon ${type}-icon`}>
          {icon}
        </div>

        <span className="stat-trend">
          <FiActivity />
          Live
        </span>

      </div>

      <p className="stat-title">
        {title}
      </p>

      <h2 className="stat-value">
        {loading ? "--" : value}
      </h2>

      <div className="stat-footer">
        {footer}
      </div>

      <div className="stat-glow"></div>

    </div>
  );
}

export default Dashboard;