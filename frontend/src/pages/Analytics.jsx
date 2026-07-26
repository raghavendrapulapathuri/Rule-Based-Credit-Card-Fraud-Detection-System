import { useEffect, useState } from "react";
import api from "../services/api";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import {
  FiActivity,
  FiCheckCircle,
  FiAlertTriangle,
  FiShield,
  FiDollarSign,
  FiPieChart,
  FiBarChart2,
} from "react-icons/fi";

function Analytics() {
  const [analytics, setAnalytics] = useState({
    totalTransactions: 0,
    safeTransactions: 0,
    suspiciousTransactions: 0,
    fraudTransactions: 0,
    fraudPercentage: 0,
    fraudAmount: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError("");

    try {
      const [
        percentageResponse,
        amountResponse,
        dashboardResponse,
      ] = await Promise.all([
        api.get("/analytics/fraud-percentage"),
        api.get("/analytics/fraud-amount"),
        api.get("/dashboard/summary"),
      ]);

      setAnalytics({
        totalTransactions:
          dashboardResponse.data.totalTransactions ?? 0,

        safeTransactions:
          dashboardResponse.data.safeTransactions ?? 0,

        suspiciousTransactions:
          dashboardResponse.data.suspiciousTransactions ?? 0,

        fraudTransactions:
          dashboardResponse.data.fraudTransactions ?? 0,

        fraudPercentage:
          percentageResponse.data.fraudPercentage ?? 0,

        fraudAmount:
          amountResponse.data ?? 0,
      });
    } catch (error) {
      console.error("Analytics error:", error);
      setError("Unable to load analytics data.");
    } finally {
      setLoading(false);
    }
  };

  const distributionData = [
    {
      name: "Safe",
      value: analytics.safeTransactions,
      color: "#22c55e",
    },
    {
      name: "Suspicious",
      value: analytics.suspiciousTransactions,
      color: "#f59e0b",
    },
    {
      name: "Fraud",
      value: analytics.fraudTransactions,
      color: "#ef4444",
    },
  ];

  const barData = [
    {
      name: "Safe",
      transactions: analytics.safeTransactions,
      fill: "#22c55e",
    },
    {
      name: "Suspicious",
      transactions: analytics.suspiciousTransactions,
      fill: "#f59e0b",
    },
    {
      name: "Fraud",
      transactions: analytics.fraudTransactions,
      fill: "#ef4444",
    },
  ];

  const safePercentage =
    analytics.totalTransactions > 0
      ? (
          (analytics.safeTransactions /
            analytics.totalTransactions) *
          100
        ).toFixed(1)
      : "0.0";

  const suspiciousPercentage =
    analytics.totalTransactions > 0
      ? (
          (analytics.suspiciousTransactions /
            analytics.totalTransactions) *
          100
        ).toFixed(1)
      : "0.0";

  const fraudPercentage = Number(
    analytics.fraudPercentage
  ).toFixed(1);

  return (
    <div className="analytics-page">
      {/* HEADER */}

      <div className="analytics-page-header">
        <div>
          <p className="analytics-eyebrow">
            FRAUD INTELLIGENCE
          </p>

          <h1>Analytics</h1>

          <p className="analytics-description">
            Analyze transaction patterns, fraud rates and
            financial risk across the fraud detection system.
          </p>
        </div>

        <div className="analytics-live-status">
          <span></span>
          Analytics Active
        </div>
      </div>

      {loading ? (
        <div className="analytics-loading">
          Loading analytics...
        </div>
      ) : error ? (
        <div className="analytics-error">
          {error}

          <button onClick={fetchAnalytics}>
            Try Again
          </button>
        </div>
      ) : (
        <>
          {/* TOP STAT CARDS */}

          <div className="analytics-stat-grid">
            <AnalyticsStatCard
              type="blue"
              icon={<FiActivity />}
              title="Total Transactions"
              value={analytics.totalTransactions}
              description="All processed transactions"
            />

            <AnalyticsStatCard
              type="green"
              icon={<FiCheckCircle />}
              title="Safe Transactions"
              value={analytics.safeTransactions}
              description={`${safePercentage}% of transactions`}
            />

            <AnalyticsStatCard
              type="orange"
              icon={<FiAlertTriangle />}
              title="Suspicious"
              value={analytics.suspiciousTransactions}
              description={`${suspiciousPercentage}% require review`}
            />

            <AnalyticsStatCard
              type="red"
              icon={<FiShield />}
              title="Fraud Transactions"
              value={analytics.fraudTransactions}
              description={`${fraudPercentage}% fraud rate`}
            />
          </div>

          {/* MAIN CHARTS */}

          <div className="analytics-chart-grid">
            {/* PIE CHART */}

            <section className="analytics-panel">
              <div className="analytics-panel-header">
                <div>
                  <h3>Risk Distribution</h3>
                  <p>
                    Transaction classification overview
                  </p>
                </div>

                <div className="analytics-panel-icon">
                  <FiPieChart />
                </div>
              </div>

              <div className="analytics-pie-container">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <PieChart>
                    <Pie
                      data={distributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={75}
                      outerRadius={110}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                    >
                      {distributionData.map(
                        (entry, index) => (
                          <Cell
                            key={index}
                            fill={entry.color}
                          />
                        )
                      )}
                    </Pie>

                    <Tooltip
                      contentStyle={{
                        background: "#0f172a",
                        border:
                          "1px solid #334155",
                        borderRadius: "10px",
                        color: "#fff",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                <div className="analytics-pie-center">
                  <strong>
                    {analytics.totalTransactions}
                  </strong>
                  <span>Total</span>
                </div>
              </div>

              <div className="analytics-legend">
                {distributionData.map((item) => (
                  <div
                    className="analytics-legend-item"
                    key={item.name}
                  >
                    <span
                      className="analytics-legend-dot"
                      style={{
                        background: item.color,
                      }}
                    ></span>

                    <div>
                      <span>{item.name}</span>
                      <strong>{item.value}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* BAR CHART */}

            <section className="analytics-panel">
              <div className="analytics-panel-header">
                <div>
                  <h3>Transaction Classification</h3>
                  <p>
                    Comparison by transaction status
                  </p>
                </div>

                <div className="analytics-panel-icon">
                  <FiBarChart2 />
                </div>
              </div>

              <div className="analytics-bar-container">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <BarChart data={barData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#1e293b"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="name"
                      stroke="#64748b"
                      tick={{
                        fill: "#94a3b8",
                        fontSize: 12,
                      }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <YAxis
                      stroke="#64748b"
                      tick={{
                        fill: "#94a3b8",
                        fontSize: 12,
                      }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />

                    <Tooltip
                      cursor={{
                        fill:
                          "rgba(255,255,255,0.03)",
                      }}
                      contentStyle={{
                        background: "#0f172a",
                        border:
                          "1px solid #334155",
                        borderRadius: "10px",
                        color: "#fff",
                      }}
                    />

                    <Bar
                      dataKey="transactions"
                      radius={[6, 6, 0, 0]}
                    >
                      {barData.map(
                        (entry, index) => (
                          <Cell
                            key={index}
                            fill={entry.fill}
                          />
                        )
                      )}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>

          {/* FINANCIAL RISK */}

          <div className="analytics-bottom-grid">
            <section className="analytics-risk-card">
              <div className="analytics-risk-icon fraud">
                <FiDollarSign />
              </div>

              <div>
                <span>Total Fraud Amount</span>

                <strong>
                  ₹
                  {Number(
                    analytics.fraudAmount
                  ).toLocaleString("en-IN")}
                </strong>

                <p>
                  Total monetary value associated with
                  fraudulent transactions
                </p>
              </div>
            </section>

            <section className="analytics-risk-card">
              <div className="analytics-risk-icon rate">
                <FiActivity />
              </div>

              <div>
                <span>Overall Fraud Rate</span>

                <strong>
                  {fraudPercentage}%
                </strong>

                <p>
                  Percentage of all transactions classified
                  as fraud
                </p>
              </div>
            </section>

            <section className="analytics-risk-card">
              <div className="analytics-risk-icon review">
                <FiAlertTriangle />
              </div>

              <div>
                <span>Needs Review</span>

                <strong>
                  {analytics.suspiciousTransactions}
                </strong>

                <p>
                  Suspicious transactions requiring
                  monitoring
                </p>
              </div>
            </section>
          </div>

          {/* RISK SUMMARY */}

          <section className="analytics-panel analytics-summary-panel">
            <div className="analytics-panel-header">
              <div>
                <h3>Risk Analysis Summary</h3>
                <p>
                  Current fraud detection classification
                </p>
              </div>

              <div className="analytics-panel-icon">
                <FiShield />
              </div>
            </div>

            <RiskProgress
              title="Safe Transactions"
              value={analytics.safeTransactions}
              percentage={safePercentage}
              type="safe"
            />

            <RiskProgress
              title="Suspicious Transactions"
              value={analytics.suspiciousTransactions}
              percentage={suspiciousPercentage}
              type="suspicious"
            />

            <RiskProgress
              title="Fraud Transactions"
              value={analytics.fraudTransactions}
              percentage={fraudPercentage}
              type="fraud"
            />
          </section>
        </>
      )}
    </div>
  );
}

/* =========================
   STAT CARD
========================= */

function AnalyticsStatCard({
  type,
  icon,
  title,
  value,
  description,
}) {
  return (
    <div className={`analytics-stat-card ${type}`}>
      <div
        className={`analytics-stat-icon ${type}`}
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

/* =========================
   PROGRESS
========================= */

function RiskProgress({
  title,
  value,
  percentage,
  type,
}) {
  const safePercentage = Math.min(
    Math.max(Number(percentage) || 0, 0),
    100
  );

  return (
    <div className="analytics-progress-item">
      <div className="analytics-progress-heading">
        <span>{title}</span>

        <strong>
          {value}
          <small>{percentage}%</small>
        </strong>
      </div>

      <div className="analytics-progress-track">
        <div
          className={`analytics-progress-fill ${type}`}
          style={{
            width: `${safePercentage}%`,
          }}
        ></div>
      </div>
    </div>
  );
}

export default Analytics;