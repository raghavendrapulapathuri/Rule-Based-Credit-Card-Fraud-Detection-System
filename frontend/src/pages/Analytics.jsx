import { useEffect, useState } from "react";
import api from "../services/api";

function Analytics() {
  const [analytics, setAnalytics] = useState({
    totalTransactions: 0,
    fraudTransactions: 0,
    fraudPercentage: 0,
    fraudAmount: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/analytics/fraud-percentage"),
      api.get("/analytics/fraud-amount"),
    ])
      .then(([percentageResponse, amountResponse]) => {
        console.log(
          "Fraud Percentage Response:",
          percentageResponse.data
        );

        console.log(
          "Fraud Amount Response:",
          amountResponse.data
        );

        setAnalytics({
          totalTransactions:
            percentageResponse.data.totalTransactions ?? 0,

          fraudTransactions:
            percentageResponse.data.fraudTransactions ?? 0,

          fraudPercentage:
            percentageResponse.data.fraudPercentage ?? 0,

          fraudAmount:
            amountResponse.data ?? 0,
        });

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching analytics:", error);
        setLoading(false);
      });
  }, []);

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
      <h2
        style={{
          color: "#FFD700",
          textAlign: "center",
          marginBottom: "35px",
        }}
      >
        Fraud Analytics
      </h2>

      {loading ? (
        <p style={{ textAlign: "center" }}>
          Loading analytics...
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 280px)",
            gap: "30px",
            justifyContent: "center",
          }}
        >
          <AnalyticsCard
            icon="💰"
            title="Total Transactions"
            value={analytics.totalTransactions}
          />

          <AnalyticsCard
            icon="🚨"
            title="Fraud Transactions"
            value={analytics.fraudTransactions}
          />

          <AnalyticsCard
            icon="📊"
            title="Fraud Percentage"
            value={`${Number(
              analytics.fraudPercentage
            ).toFixed(2)}%`}
          />

          <AnalyticsCard
            icon="💸"
            title="Total Fraud Amount"
            value={`₹${Number(
              analytics.fraudAmount
            ).toLocaleString("en-IN")}`}
          />
        </div>
      )}
    </div>
  );
}

function AnalyticsCard({ icon, title, value }) {
  return (
    <div
      style={{
        background: "#1c1c1c",
        border: "2px solid #FFD700",
        borderRadius: "15px",
        padding: "30px",
        textAlign: "center",
        minHeight: "160px",
      }}
    >
      <div
        style={{
          fontSize: "40px",
          marginBottom: "15px",
        }}
      >
        {icon}
      </div>

      <h3
        style={{
          color: "#FFD700",
          marginBottom: "15px",
        }}
      >
        {title}
      </h3>

      <h1
        style={{
          color: "#FFD700",
          margin: 0,
        }}
      >
        {value}
      </h1>
    </div>
  );
}

export default Analytics;